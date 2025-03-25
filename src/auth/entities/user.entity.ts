import { Notification } from '../../notifications/entities/notification.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ type: 'jsonb', nullable: true, name: 'profile_data' })
  profileData: Record<string, any>;

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ nullable: true, name: 'last_login' })
  lastLogin: Date;

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  //   // Relationships
  //   @OneToMany(() => Subscription, (subscription) => subscription.user)
  //   subscriptions: Subscription[];

  //   @OneToMany(() => ChatSession, (chatSession) => chatSession.user)
  //   chatSessions: ChatSession[];

  //   @OneToMany(() => Payment, (payment) => payment.user)
  //   payments: Payment[];

  //   @OneToMany(() => ExportLog, (exportLog) => exportLog.user)
  //   exportLogs: ExportLog[];

  //   @OneToMany(() => PushNotification, (notification) => notification.user)
  //   notifications: PushNotification[];

  //   @OneToMany(() => DeviceToken, (deviceToken) => deviceToken.user)
  //   deviceTokens: DeviceToken[];

  //   @OneToOne(
  //     () => UpcoachIntegration,
  //     (upcoachIntegration) => upcoachIntegration.user,
  //   )
  //   upcoachIntegration: UpcoachIntegration;

  //   // Helper methods
  //   hasActiveSubscription(): boolean {
  //     if (!this.subscriptions || this.subscriptions.length === 0) {
  //       return false;
  //     }

  //     const now = new Date();

  //     return this.subscriptions.some(
  //       (subscription) =>
  //         (subscription.status === 'active' &&
  //           subscription.subscriptionEndDate > now) ||
  //         (subscription.status === 'trial' && subscription.trialEndDate > now),
  //     );
  //   }

  //   getActiveSubscription(): Subscription | null {
  //     if (!this.subscriptions || this.subscriptions.length === 0) {
  //       return null;
  //     }

  //     const now = new Date();

  //     return (
  //       this.subscriptions.find(
  //         (subscription) =>
  //           (subscription.status === 'active' &&
  //             subscription.subscriptionEndDate > now) ||
  //           (subscription.status === 'trial' && subscription.trialEndDate > now),
  //       ) || null
  //     );
  //   }

  //   isInTrialPeriod(): boolean {
  //     if (!this.subscriptions || this.subscriptions.length === 0) {
  //       return false;
  //     }

  //     const now = new Date();

  //     return this.subscriptions.some(
  //       (subscription) =>
  //         subscription.status === 'trial' && subscription.trialEndDate > now,
  //     );
  //   }

  //   getThemePreference(): 'light' | 'dark' {
  //     return this.preferences?.theme || 'light';
  //   }

  //   getNotificationPreference(): boolean {
  //     return this.preferences?.notifications !== false;
  //   }
}
