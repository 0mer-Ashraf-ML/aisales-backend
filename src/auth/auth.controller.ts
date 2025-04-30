import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Put,
  Param,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { OtpType } from './entities/verification_otps.entity';
import { IAuth, IResendOtp, IResponse } from '@src/common/interfaces';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Role } from './enum/enum.roles';
import { Roles } from './decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() createAuthDto: IAuth) {
    return this.authService.login(createAuthDto);
  }

  @Post('/admin/login')
  adminLogin(@Body() createAuthDto: IAuth) {
    return this.authService.adminLogin(createAuthDto);
  }

  @Post('/register')
  register(@Body() createAuthDto: IAuth) {
    return this.authService.register(createAuthDto);
  }

  @Get('/users')
  @Roles(Role.SuperAdmin, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll() {
    return this.authService.findAll();
  }

  // @Put()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // updateUser(@Body() createAuthDto: IAuth) {
  //   return this.authService.updateUser(createAuthDto);
  // }

  @Get(':id') // Get user by ID via route param
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string): Promise<IResponse> {
    return this.authService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.SuperAdmin, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: IAuth,
  ): Promise<IResponse> {
    return this.authService.updateUser(id, updateUserDto);
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
  async verifyOtp(
    @Body()
    body: {
      otpCode: string;
      type?: OtpType;
      email: string;
    },
  ): Promise<IResponse> {
    return this.authService.verifyOtpByEmail(
      body?.email,
      body?.otpCode,
      body?.type || OtpType.ACCOUNT_VERIFICATION,
    );
  }

  /**
   * Resend OTP for authenticated users
   */
  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  async resendOtp(@Body() body: IResendOtp): Promise<IResponse> {
    return this.authService.resendOtp(
      body.email,
      body.type || OtpType.ACCOUNT_VERIFICATION,
    );
  }
}
