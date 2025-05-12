import { Companies } from '../../companies/entities/companies.entity';
import { Notification } from '../../notifications/entities/notification.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Role } from '../enum/enum.roles';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  contact: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ type: 'jsonb', nullable: true, name: 'profile_data' })
  profileData: Record<string, any>;

  @Column({
    type: 'integer',
    enum: Role,
    default: Role.User,
    select: true,
  })
  role: number;

  @Column({ name: 'stripe_customer_id' })
  stripe_customer_id: string;

  @Column({
    type: 'jsonb',
    default: { theme: 'light', notifications: true },
    name: 'preferences',
  })
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    [key: string]: any;
  };
  @Column({ default: false })
  isSuspended: boolean;

  @Column({ default: false, name: 'is_verified' })
  isVerified: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ nullable: true, name: 'last_login' })
  lastLogin: Date;

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => Companies, (company) => company.user)
  companies: Companies[];
}
