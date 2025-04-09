import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProspectService } from './prospect.service';
import { JwtAuthGuard } from '@src/auth/guards/jwt-auth.guard';
import { CreateProspectDto } from '../dto/create-prospect.dto';
import { UpdateProspectDto } from '../dto/update-company.dto';

@Controller('prospects')
@UseGuards(JwtAuthGuard)
export class ProspectController {
  constructor(private readonly prospectService: ProspectService) {}

  @Post()
  async create(@Body() createProspectDto: CreateProspectDto) {
    return this.prospectService.create(createProspectDto);
  }

  @Get()
  async findAll(@Query('companyId') companyId: string) {
    return this.prospectService.findAll(companyId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query('companyId') companyId: string,
  ) {
    return this.prospectService.findOne(id, companyId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Query('companyId') companyId: string,
    @Body() updateProspectDto: UpdateProspectDto,
  ) {
    return this.prospectService.update(id, companyId, updateProspectDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Query('companyId') companyId: string) {
    return this.prospectService.remove(id, companyId);
  }
}
