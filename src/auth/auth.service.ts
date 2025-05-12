import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { generateAccessToken } from 'src/common/Authentication';
import { IAuth, IResponse } from 'src/common/interfaces';
import { PaymentService } from 'src/payment/payment.service';
import { NotificationsService } from '@src/notifications/notifications.service';
import { OtpType, VerificationOtp } from './entities/verification_otps.entity';
import { Role } from './enum/enum.roles';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(VerificationOtp)
    private readonly verificationOtps: Repository<VerificationOtp>,

    private readonly notification: NotificationsService,
    private readonly paymentService: PaymentService,
  ) {}

  /**
   * Generates a random 5-digit OTP code
   * @returns A string containing a 5-digit number
   */
  generateOTP(): string {
    // Generate a random number between 10000 and 99999
    const min = 10000;
    const max = 99999;
    const otp: number = Math.floor(min + Math.random() * (max - min + 1));

    return otp.toString();
  }

  async register(body: IAuth): Promise<IResponse> {
    try {
      const { email, password, fullName, contact } = body;

      // Check if user already exists
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      const stripeCustomer = await this.paymentService.createCustomer(
        fullName,
        email,
        contact,
      );

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user with required fields
      const user = this.userRepository.create({
        email,
        passwordHash: hashedPassword,
        fullName: fullName || email.split('@')[0], // Use part of email as name if not provided
        profileData: {},
        preferences: { theme: 'light', notifications: true },
        lastLogin: new Date(),
        stripe_customer_id: stripeCustomer?.id,
      });

      // Save the user
      const newUser = await this.userRepository.save(user);

      // Generate JWT token
      const payload = { sub: newUser.id, email: newUser.email };
      const accessToken = generateAccessToken(payload);

      // Return user data (excluding sensitive information) and token
      const { passwordHash: _, ...userWithoutPassword } = newUser;

      const OTP = this.generateOTP();

      const emailBody = {
        name: fullName,
        verification_link: '#',
        otp: OTP,
      };
      console.log(OTP);

      await this.notification.sendEmail('VERIFY_OTP', emailBody, newUser.email);

      try {
        const data = await this.verificationOtps.save({
          userId: newUser.id, // Use userId instead of user relation
          email: newUser.email, // Required field based on your entity
          otpCode: OTP, // Field should be 'otpCode' not 'otp'
          type: OtpType.ACCOUNT_VERIFICATION,
          // Other fields will use defaults defined in the entity
        });
      } catch (otpError) {
        console.error('Failed to save OTP:', otpError);
        // Continue with registration even if OTP saving fails
      }

      return {
        message: 'User registered successfully',
        data: {
          user: userWithoutPassword,
          accessToken,
          OTP,
        },
      };
    } catch (error) {
      console.error('Registration error:', error);

      // If it's already a NestJS exception, rethrow it
      if (error instanceof ConflictException) {
        throw error;
      }

      // Handle different types of errors
      if (error.code === '23505') {
        // PostgreSQL unique violation
        throw new ConflictException('User with this email already exists');
      }

      // Return a generic error message for other errors
      throw new Error('Registration failed. Please try again later.');
    }
  }

  async login(body: IAuth): Promise<IResponse> {
    const { email, password } = body;

    // Find the user
    const user = await this.userRepository.findOne({
      where: { email },
    });

    // Check if user exists and password is correct
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user?.isVerified) {
      throw new UnauthorizedException('Email is not verified');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.isSuspended) {
      throw new ForbiddenException('Your account is suspended');
    }

    user.lastLogin = new Date();
    await this.userRepository.save(user);

    // Generate JWT token
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);

    // Return user data (excluding sensitive information) and token
    const { passwordHash, ...userWithoutPassword } = user;

    return {
      message: 'User loggedin successfully',
      data: {
        user: userWithoutPassword,
        accessToken,
      },
    };
  }

  async updateUser(id: string, updateUserDto: IAuth): Promise<IResponse> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);

    const { passwordHash, ...userWithoutPassword } = user;

    return {
      message: 'User updated successfully',
      data: userWithoutPassword,
    };
  }

  async patchUser(id: string, updateUserDto: IAuth): Promise<IResponse> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.id === id && updateUserDto.role) {
      throw new ForbiddenException('You cannot change your own role');
    }

    if (updateUserDto.password) {
      user.passwordHash = await bcrypt.hash(updateUserDto.password, 10);
      delete updateUserDto.password;
    }

    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);

    const { passwordHash, ...userWithoutPassword } = user;

    return {
      message: 'User updated successfully',
      data: userWithoutPassword,
    };
  }

  async findOne(id: string): Promise<IResponse> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { passwordHash, ...userWithoutPassword } = user;

    return {
      message: 'User fetched successfully',
      data: userWithoutPassword,
    };
  }

  async adminLogin(body: IAuth): Promise<IResponse> {
    const { email, password } = body;

    // Find the user
    const user = await this.userRepository.findOne({
      where: { email },
    });

    // Check if user exists and password is correct
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user?.isVerified) {
      throw new UnauthorizedException('Email is not verified');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    if (user.isSuspended) {
      throw new ForbiddenException('Your account is suspended');
    }

    //check if user is admin
    if (![Role.Admin, Role.SuperAdmin].includes(Number(user.role))) {
      throw new UnauthorizedException(
        'You are not authorized to access Admin Panel',
      );
    }

    user.lastLogin = new Date();
    await this.userRepository.save(user);

    // Generate JWT token
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);

    // Return user data (excluding sensitive information) and token
    const { passwordHash, ...userWithoutPassword } = user;

    return {
      message: 'User loggedin successfully',
      data: {
        user: userWithoutPassword,
        accessToken,
      },
    };
  }

  /**
   * Verify an OTP code
   * @param userId User ID
   * @param otpCode OTP code to verify
   * @param type OTP type
   */
  async verifyOtp(
    email: string,
    otpCode: string,
    type: OtpType = OtpType.ACCOUNT_VERIFICATION,
  ): Promise<IResponse> {
    try {
      // Find the OTP record
      const otpRecord = await this.verificationOtps.findOne({
        where: {
          email,
          otpCode,
          type,
          verified: false,
        },
        order: {
          createdAt: 'DESC', // Get the most recent one if multiple exist
        },
      });

      // Check if OTP exists and is valid
      if (!otpRecord) {
        return {
          success: false,
          message: 'Invalid verification code',
        };
      }

      // Check if OTP has expired
      if (otpRecord.isExpired()) {
        return {
          success: false,
          message: 'Verification code has expired',
        };
      }

      // Mark OTP as verified
      otpRecord.verified = true;
      await this.verificationOtps.save(otpRecord);

      // If it's for account verification, update user's verified status
      if (type === OtpType.ACCOUNT_VERIFICATION) {
        const user = await this.userRepository.findOne({
          where: { email },
        });

        if (user) {
          // Add emailVerified field to your user entity if not already present
          user.isVerified = true;
          // await this.userRepository.save(user);

          // If you don't have an emailVerified field, you can add it to the profileData
          if (!user.profileData) {
            user.profileData = {};
          }

          user.profileData = {
            ...user.profileData,
            emailVerified: true,
            emailVerifiedAt: new Date(),
          };

          await this.userRepository.save(user);
        }
      }

      return {
        success: true,
        message: 'Verification successful',
      };
    } catch (error) {
      console.error('OTP verification error:', error);
      return {
        success: false,
        message: 'Failed to verify code. Please try again.',
      };
    }
  }

  /**
   * Verify an OTP code by Email
   * @param email User Email
   * @param otpCode OTP code to verify
   * @param type OTP type
   */
  async verifyOtpByEmail(
    email: string,
    otpCode: string,
    type: OtpType = OtpType.ACCOUNT_VERIFICATION,
  ): Promise<IResponse> {
    try {
      // Find the OTP record
      const otpRecord = await this.verificationOtps.findOne({
        where: {
          email,
          otpCode,
          type,
          verified: false,
        },
        order: {
          createdAt: 'DESC', // Get the most recent one if multiple exist
        },
      });

      // Check if OTP exists and is valid
      if (!otpRecord) {
        return {
          success: false,
          message: 'Invalid verification code',
        };
      }

      // Check if OTP has expired
      if (otpRecord.isExpired()) {
        return {
          success: false,
          message: 'Verification code has expired',
        };
      }

      // Mark OTP as verified
      otpRecord.verified = true;
      await this.verificationOtps.save(otpRecord);

      // If it's for account verification, update user's verified status
      if (type === OtpType.ACCOUNT_VERIFICATION) {
        const user = await this.userRepository.findOne({
          where: { email },
        });

        if (user) {
          // Add emailVerified field to your user entity if not already present
          user.isVerified = true;
          // await this.userRepository.save(user);

          // If you don't have an emailVerified field, you can add it to the profileData
          if (!user.profileData) {
            user.profileData = {};
          }

          user.profileData = {
            ...user.profileData,
            emailVerified: true,
            emailVerifiedAt: new Date(),
          };

          await this.userRepository.save(user);
        }
      }

      return {
        success: true,
        message: 'Verification successful',
        data: otpCode,
      };
    } catch (error) {
      console.error('OTP verification error:', error);
      return {
        success: false,
        message: 'Failed to verify code. Please try again.',
      };
    }
  }

  /**
   * Resend verification OTP
   * @param userId User ID
   * @param email Email address
   * @param type OTP type
   */
  async resendOtp(
    email: string,
    type: OtpType = OtpType.ACCOUNT_VERIFICATION,
  ): Promise<IResponse> {
    try {
      // Invalidate any existing OTPs
      await this.verificationOtps.update(
        {
          type,
          verified: false,
        },
        { verified: true },
      );

      // Generate new OTP
      const otpCode = this.generateOTP();

      // Get user details for the email
      const user = await this.userRepository.findOne({
        where: { email: email },
      });

      if (!user) {
        return {
          success: false,
          message: 'User is not registered with us',
        };
      }

      // Create new OTP record
      const otpRecord = this.verificationOtps.create({
        email: user?.email,
        userId: user?.id,
        otpCode,
        type,
      });

      await this.verificationOtps.save(otpRecord);

      // Send email with OTP
      const emailBody = {
        name: user?.fullName || email.split('@')[0],
        verification_link: '#',
        otp: otpCode,
      };

      // Uncomment this when your notification service is ready
      await this.notification.sendEmail('VERIFY_OTP', emailBody, email);

      return {
        success: true,
        message: 'Verification code has been resent',
        data: otpCode,
      };
    } catch (error) {
      console.error('Error resending OTP:', error);
      return {
        success: false,
        message: 'Failed to resend verification code. Please try again.',
      };
    }
  }

  /**
   * Handles password reset requests by generating and sending an OTP
   * @param email User's email address
   * @returns Response indicating success or failure
   */
  async forgotPassword(email: string): Promise<IResponse> {
    try {
      // Find the user
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (user) {
      }

      // Check if user exists
      if (!user) {
        // For security reasons, don't reveal whether the email exists or not
        return {
          success: true,
          message:
            'If an account with this email exists, a password reset code has been sent',
        };
      }

      try {
        // Invalidate any existing password reset OTPs for this user
        const updateResult = await this.verificationOtps.update(
          {
            userId: user.id,
            type: OtpType.PASSWORD_RESET,
            verified: false,
          },
          { verified: true },
        );
      } catch (updateError) {
        console.error('Error invalidating previous OTPs:', updateError);
        // Continue with the process even if this fails
      }

      // Generate new OTP
      const otpCode = this.generateOTP();

      // Prepare OTP data
      const otpData = {
        userId: user.id,
        email: user.email,
        otpCode: otpCode,
        type: OtpType.PASSWORD_RESET,
      };

      // Save OTP record directly
      try {
        const savedOtp = await this.verificationOtps.save(otpData);
      } catch (saveError) {
        console.error('Error saving OTP:', saveError);
        throw saveError; // Re-throw to be caught by the outer try-catch
      }

      // Prepare email body
      const emailBody = {
        name: user.fullName,
        verification_link: '#',
        otp: otpCode,
      };
      console.log(otpCode);
      await this.notification.sendEmail(
        'PASSWORD_RESET_OTP',
        emailBody,
        user.email,
      );

      return {
        success: true,
        message: 'Password reset code has been sent',
        data: otpCode,
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      // Log the specific error type and message for debugging
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      if (error.stack) {
        console.error('Error stack:', error.stack);
      }

      return {
        success: false,
        message:
          'Failed to process password reset request. Please try again later.',
      };
    }
  }

  /**
   * Reset user's password using the OTP verification
   * @param email User's email address
   * @param otpCode OTP code for verification
   * @param newPassword New password to set
   * @returns Response indicating success or failure
   */
  async resetPassword(
    email: string,
    otpCode: string,
    newPassword: string,
  ): Promise<IResponse> {
    try {
      // Find the user
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        return {
          success: false,
          message: 'Invalid request',
        };
      }

      // Verify the OTP
      // const otpVerification = await this.verifyOtp(
      //   user.id,
      //   otpCode,
      //   OtpType.PASSWORD_RESET,
      // );

      // if (!otpVerification.success) {
      //   return otpVerification;
      // }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update user's password
      user.passwordHash = hashedPassword;

      // Optional: Record password change timestamp in profileData
      if (!user.profileData) {
        user.profileData = {};
      }

      user.profileData = {
        ...user.profileData,
        passwordLastChangedAt: new Date(),
      };

      await this.userRepository.save(user);

      return {
        success: true,
        message: 'Password has been reset successfully',
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        message: 'Failed to reset password. Please try again later.',
      };
    }
  }

  async findAll(currentUser: User): Promise<IResponse<User[]>> {
    let users: User[];

    if (Number(currentUser.role) === Role.SuperAdmin) {
      users = await this.userRepository.find();
    } else {
      users = await this.userRepository.find({
        where: { role: Not(Role.SuperAdmin) },
      });
    }

    return {
      status: 'success',
      message: 'Users fetched successfully',
      data: users,
    };
  }

  // user.service.ts

  async deleteUser(targetUserId: string, currentUser: any): Promise<IResponse> {
    const currentUserRole = currentUser.role;
    const targetUser = await this.userRepository.findOne({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    const targetRole = targetUser.role;

    // Prevent deleting SuperAdmin
    if (Number(targetRole) === Role.SuperAdmin) {
      throw new ForbiddenException('SuperAdmin cannot be deleted');
    }

    // SuperAdmin can delete Admin and User
    if (Number(currentUserRole) === Role.SuperAdmin) {
      // allow
    }
    // Admin can only delete User
    else if (
      Number(currentUserRole) === Role.Admin &&
      Number(targetRole) === Role.User
    ) {
      // allow
    } else {
      throw new ForbiddenException(
        'You are not authorized to delete this user',
      );
    }

    await this.userRepository.remove(targetUser);

    return {
      success: true,
      message: `User with ID ${targetUserId} deleted successfully`,
    };
  }

  async updateStatus(id: string, updates: Partial<User>) {
    const data= await this.userRepository.update(id, updates);
    console.log("Update data",data);
    return this.userRepository.findOne({ where: { id } });
  }
}
