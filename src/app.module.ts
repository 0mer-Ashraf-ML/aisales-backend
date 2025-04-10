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

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        ...AppDataSource.options,
        autoLoadEntities: true,
      }),
    }),
    PaymentModule,
    CompaniesModule,
  ],
  controllers: [AppController],
  providers: [
    JwtStrategy,
    AppService,
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
