import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProspectDto } from './dto/create-prospect.dto';
import { UpdateProspectDto } from './dto/update-prospect.dto';
import { Prospect } from './entities/prospect.entity';
import { IResponse } from '@src/common/interfaces';

@Injectable()
export class ProspectsService {
  constructor(
    @InjectRepository(Prospect)
    private readonly repo: Repository<Prospect>,
  ) {}

  async create(dto: CreateProspectDto): Promise<IResponse> {
    try {
      const entity = this.repo.create(dto);
      const saved = await this.repo.save(entity);
      return {
        code: 201,
        success: true,
        status: 'created',
        message: 'Prospect created successfully',
        data: saved,
      };
    } catch (error) {
      return this.handleError('Failed to create prospect', error);
    }
  }

  async findAll(): Promise<IResponse> {
    try {
      const data = await this.repo.find();
      return {
        code: 200,
        success: true,
        status: 'ok',
        message: 'Prospects retrieved successfully',
        data,
        total: data.length,
      };
    } catch (error) {
      return this.handleError('Failed to retrieve prospects', error);
    }
  }

  async findOne(id: string): Promise<IResponse> {
    try {
      const prospect = await this.repo.findOne({ where: { id } });
      if (!prospect) {
        return {
          code: 404,
          success: false,
          status: 'not_found',
          message: 'Prospect not found',
        };
      }
      return {
        code: 200,
        success: true,
        status: 'ok',
        message: 'Prospect retrieved successfully',
        data: prospect,
      };
    } catch (error) {
      return this.handleError('Failed to retrieve prospect', error);
    }
  }

  async update(id: string, dto: UpdateProspectDto): Promise<IResponse> {
    try {
      const existing = await this.repo.findOne({ where: { id } });
      if (!existing) {
        return {
          code: 404,
          success: false,
          status: 'not_found',
          message: 'Prospect not found',
        };
      }
      const updated = await this.repo.save({ ...existing, ...dto });
      return {
        code: 200,
        success: true,
        status: 'ok',
        message: 'Prospect updated successfully',
        data: updated,
      };
    } catch (error) {
      return this.handleError('Failed to update prospect', error);
    }
  }

  async remove(id: string): Promise<IResponse> {
    try {
      const existing = await this.repo.findOne({ where: { id } });
      if (!existing) {
        return {
          code: 404,
          success: false,
          status: 'not_found',
          message: 'Prospect not found',
        };
      }
      const deleted = await this.repo.remove(existing);
      return {
        code: 200,
        success: true,
        status: 'ok',
        message: 'Prospect deleted successfully',
        data: deleted,
      };
    } catch (error) {
      return this.handleError('Failed to delete prospect', error);
    }
  }

  private handleError(message: string, error: any): IResponse {
    console.error(`[ProspectsService Error]: ${message}`, error);
    return {
      code: 500,
      success: false,
      status: 'error',
      message,
      error: error?.message || 'Internal Server Error',
    };
  }
}
