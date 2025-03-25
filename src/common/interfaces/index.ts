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
  id: number;
  email: string;
  status: string;
  contact: string;
  role_id: number;
  last_name: string;
  first_name: string;
  is_onboarded: boolean;
  profile_picture: string;
}

export interface IAuth {
  email: string;
  password: string;
  contact?: string;
  fullName?: string;
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
