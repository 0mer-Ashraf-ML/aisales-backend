import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompanyService } from './companies.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/create-company.dto';
import { CompanyImportDto } from './dto/create-prospect.dto';
import { RolesGuard } from '@src/auth/guards/roles.guard';
import { Role } from '@src/auth/enum/enum.roles';
import { Roles } from '@src/auth/decorators/roles.decorator';

@Controller('companies')
@UseGuards(JwtAuthGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  async create(@Request() req, @Body() createCompanyDto: CreateCompanyDto) {
    const userId = req.user.id;
    return this.companyService.create(createCompanyDto, userId);
  }

  @Post('import')
  async importCompanyWithProspects(
    @Request() req,
    @Body() companyData: CompanyImportDto,
  ) {
    const userId = req.user.id;
    return this.companyService.importCompanyWithProspects(companyData, userId);
  }

  @Get()
  async findAll(@Request() req) {
    const userId = req.user.id;
    return this.companyService.findAll(userId);
  }

  @Roles(Role.SuperAdmin, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/projects')
  async findAllCompanies() {
    return this.companyService.findAllComapnies();
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const userId = req.user.id;
    return this.companyService.findOne(id, userId);
  }

  @Patch(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    const userId = req.user.id;
    return this.companyService.update(id, userId, updateCompanyDto);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const userId = req.user.id;
    return this.companyService.remove(id, userId);
  }
}
