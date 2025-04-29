import { OtpType } from '@src/auth/entities/verification_otps.entity';

export interface IResponse<T = any> {
  code?: number;
  success?: boolean;
  status?: string;
  data?: T;
  message?: string;
  total?: number;
  meta?: Record<string, any>;
  error?: string;
}

export interface IUser {
  id: string;
  email: string;
  fullName: Record<string, any>;
  profileData: boolean;
}

export interface IAuth {
  email: string;
  password: string;
  contact?: string;
  fullName?: string;
  role?: string;
}

export interface IVerifyOtp {
  email?: string;
  otpCode: string;
  type?: OtpType;
}

export interface IResendOtp {
  email: string;
  type?: OtpType;
}
