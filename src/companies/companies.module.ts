import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prospect } from './entities/prospect.entity';
import { User } from '@src/auth/entities/user.entity';
import { CompanyController } from './companies.controller';
import { CompanyService } from './companies.service';
import { Companies } from './entities/companies.entity';
import { ProspectController } from './prospects/prospect.controller';
import { ProspectService } from './prospects/prospect.service';

@Module({
  imports: [TypeOrmModule.forFeature([Companies, Prospect, User])],
  controllers: [CompanyController, ProspectController],
  providers: [CompanyService, ProspectService],
  exports: [CompanyService, ProspectService],
})
export class CompaniesModule {}
