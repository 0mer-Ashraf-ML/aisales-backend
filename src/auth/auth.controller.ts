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
  Delete,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { OtpType } from './entities/verification_otps.entity';
import { IAuth, IResendOtp, IResponse } from '@src/common/interfaces';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Role } from './enum/enum.roles';
import { Roles } from './decorators/roles.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Common APIs

  @Post('/login')
  login(@Body() createAuthDto: IAuth) {
    return this.authService.login(createAuthDto);
  }

  @Post('/register')
  register(@Body() createAuthDto: IAuth) {
    return this.authService.register(createAuthDto);
  }

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

  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  async resendOtp(@Body() body: IResendOtp): Promise<IResponse> {
    return this.authService.resendOtp(
      body.email,
      body.type || OtpType.ACCOUNT_VERIFICATION,
    );
  }

  // User APIs

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string): Promise<IResponse> {
    return this.authService.findOne(id);
  }

  @Patch('user/:id')
  @UseGuards(JwtAuthGuard)
  async patchUser(
    @Param('id') id: string,
    @Body() updateUserDto: IAuth,
  ): Promise<IResponse> {
    return this.authService.patchUser(id, updateUserDto);
  }

  // Admin APIs

  @Post('/admin/login')
  adminLogin(@Body() createAuthDto: IAuth) {
    return this.authService.adminLogin(createAuthDto);
  }

  @Get('admin/users')
  @Roles(Role.SuperAdmin, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll(@CurrentUser() user: User) {
    return this.authService.findAll(user);
  }

  @Patch('admin/:id')
  @Roles(Role.SuperAdmin, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: IAuth,
  ): Promise<IResponse> {
    return this.authService.updateUser(id, updateUserDto);
  }

  @Delete('admin/:id')
  @Roles(Role.SuperAdmin, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteUser(@Param('id') userId: string, @Req() req: any) {
    return this.authService.deleteUser(userId, req.user);
  }

}
