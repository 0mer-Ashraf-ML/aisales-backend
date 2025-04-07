import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PaymentController } from 'src/payment/payment.controller';
import { PaymentService } from 'src/payment/payment.service';
import { VerificationOtp } from './entities/verification_otps.entity';

import { NotificationsService } from '@src/notifications/notifications.service';
import { Notification } from '@src/notifications/entities/notification.entity';
import { EmailTemplate } from '@src/notifications/entities/EmailTemplates.entity';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './guards/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      VerificationOtp,
      Notification,
      EmailTemplate,
      ConfigService,
    ]),
  ],
  controllers: [AuthController, PaymentController],
  providers: [AuthService, PaymentService, NotificationsService, JwtStrategy],
})
export class AuthModule {}
