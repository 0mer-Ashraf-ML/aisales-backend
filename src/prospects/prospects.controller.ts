import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProspectsService } from './prospects.service';
import { CreateProspectDto } from './dto/create-prospect.dto';
import { UpdateProspectDto } from './dto/update-prospect.dto';
import { JwtAuthGuard } from '@src/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@src/auth/decorators/current-user.decorator';
import { IUser } from '@src/common/interfaces';

@UseGuards(JwtAuthGuard)
@Controller('prospects')
export class ProspectsController {
  constructor(private readonly service: ProspectsService) {}

  @Post()
  create(@Body() dto: CreateProspectDto, @CurrentUser() user: IUser) {
    return this.service.create({ ...dto, user_id: user.id });
  }

  @Get()
  findAll(@CurrentUser() user: IUser) {
    return this.service.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: IUser) {
    return this.service.findOne(id, user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProspectDto,
    @CurrentUser() user: IUser,
  ) {
    return this.service.update(id, dto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: IUser) {
    return this.service.remove(id, user.id);
  }
}
