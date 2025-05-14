import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entity/subscription.entity';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { NotificationsService } from '@src/notifications/notifications.service';
import { EmailTemplate } from '@src/notifications/entities/EmailTemplates.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, EmailTemplate])],
  providers: [SubscriptionService, NotificationsService],
  controllers: [SubscriptionController],
})
export class SubscriptionModule {}
