import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prospect } from './entities/prospect.entity';
import { User } from '@src/auth/entities/user.entity';
import { CompanyController } from './companies.controller';
import { CompanyService } from './companies.service';
import { Companies } from './entities/companies.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Companies, Prospect, User])],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompaniesModule {}
