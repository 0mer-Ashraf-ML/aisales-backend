import { Module } from '@nestjs/common';
import { ProspectsService } from './prospects.service';
import { ProspectsController } from './prospects.controller';
import { Prospect } from './entities/prospect.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Prospect])],
  controllers: [ProspectsController],
  providers: [ProspectsService],
})
export class ProspectsModule {}
