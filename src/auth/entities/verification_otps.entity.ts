import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity'; // Adjust the import path based on your project structure

export enum OtpType {
  ACCOUNT_VERIFICATION = 'account_verification',
  PASSWORD_RESET = 'password_reset',
  EMAIL_CHANGE = 'email_change',
}

@Entity('verification_otps')
export class VerificationOtp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' }) // Add the name mapping here
  @Index()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) // This correctly maps to user_id
  user: User;

  @Column({ length: 255 })
  @Index()
  email: string;

  @Column({ length: 5, name: 'otp_code' })
  otpCode: string;

  @Column({
    type: 'enum',
    enum: OtpType,
    default: OtpType.ACCOUNT_VERIFICATION,
  })
  type: OtpType;

  @Column({
    type: 'timestamp',
    name: 'expires_at',
    default: () => `now() + interval '10 minutes'`,
  })
  expiresAt: Date;

  @Column({ default: false })
  verified: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  /**
   * Check if the OTP has expired
   */
  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  /**
   * Check if the OTP is valid (not expired and not verified)
   */
  isValid(): boolean {
    return !this.isExpired() && !this.verified;
  }
}
