import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './database/data-source';
import { PaymentModule } from './payment/payment.module';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './auth/guards/jwt.strategy';
import { CompaniesModule } from './companies/companies.module';
import { NotificationsController } from './notifications/notifications.controller';
import { NotificationsService } from './notifications/notifications.service';
import { NotificationsModule } from './notifications/notifications.module';
import { EmailTemplate } from './notifications/entities/EmailTemplates.entity';
import { User } from './auth/entities/user.entity';
import { Notification } from './notifications/entities/notification.entity';
import { SubscriptionModule } from './email subscribe/subscription.module';

@Module({
  imports: [
    AuthModule,
    NotificationsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        ...AppDataSource.options,
        autoLoadEntities: true,
      }),
    }),
    TypeOrmModule.forFeature([User, EmailTemplate, Notification]),
    PaymentModule,
    CompaniesModule,
    SubscriptionModule,
  ],
  controllers: [AppController, NotificationsController],
  providers: [
    JwtStrategy,
    AppService,
    NotificationsService,
    {
      provide: 'AUTH_GUARD',
      useClass: JwtAuthGuard,
    },
    {
      provide: 'ROLE_GUARD',
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
