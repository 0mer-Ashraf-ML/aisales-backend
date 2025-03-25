import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../src/auth/entities/user.entity';

import { Notification } from './entities/notification.entity';
import { AuthModule } from '@src/auth/auth.module';
import { EmailTemplate } from './entities/EmailTemplates.entity';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([User, EmailTemplate, Notification]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, ConfigService],
})
export class NotificationsModule {}
