import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { OtpType } from './entities/verification_otps.entity';
import { AuthGuard } from '@nestjs/passport';
import {
  IAuth,
  IResendOtp,
  IResponse,
  IVerifyOtp,
} from '@src/common/interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() createAuthDto: IAuth) {
    return this.authService.login(createAuthDto);
  }

  @Post('/register')
  register(@Body() createAuthDto: IAuth) {
    return this.authService.register(createAuthDto);
  }

  /**
   * Forgot password request
   */
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() body: { email: string; otpCode: string; newPassword: string },
  ) {
    return this.authService.resetPassword(
      body.email,
      body.otpCode,
      body.newPassword,
    );
  }

  /**
   * Verify OTP for authenticated users
   */
  @Post('verify-otp')
  @UseGuards(AuthGuard('jwt'))
  async verifyOtp(
    @Body() body: { otpCode: string; type?: OtpType; email: string },
  ): Promise<IResponse> {
    return this.authService.verifyOtpByEmail(
      body?.email,
      body?.otpCode,
      body?.type || OtpType.ACCOUNT_VERIFICATION,
    );
  }

  /**
   * Verify OTP with explicit userId (for non-authenticated flows like signup)
   */
  @Post('verify-otp/:userId')
  @HttpCode(HttpStatus.OK)
  async verifyOtpWithUserId(
    @Param('userId') userId: string,
    @Body() verifyOtpDto: IVerifyOtp,
  ): Promise<IResponse> {
    return this.authService.verifyOtp(
      userId,
      verifyOtpDto.otpCode,
      verifyOtpDto.type || OtpType.ACCOUNT_VERIFICATION,
    );
  }

  /**
   * Resend OTP for authenticated users
   */
  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  async resendOtp(@Body() body: IResendOtp): Promise<IResponse> {
    return this.authService.resendOtp(
      body.userId,
      body.email,
      body.type || OtpType.ACCOUNT_VERIFICATION,
    );
  }

  /**
   * Resend OTP with explicit userId (for non-authenticated flows)
   */
  @Post('resend-otp/:userId')
  @HttpCode(HttpStatus.OK)
  async resendOtpWithUserId(
    @Param('userId') userId: string,
    @Body() resendOtpDto: IResendOtp,
  ): Promise<IResponse> {
    return this.authService.resendOtp(
      userId,
      resendOtpDto.email,
      resendOtpDto.type || OtpType.ACCOUNT_VERIFICATION,
    );
  }
}
