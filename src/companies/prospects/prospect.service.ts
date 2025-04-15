import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prospect } from '../entities/prospect.entity';
import { Companies } from '../entities/companies.entity';
import { IResponse } from '@src/common/interfaces';
import { CreateProspectDto } from '../dto/create-prospect.dto';
import { UpdateProspectDto } from '../dto/update-company.dto';

@Injectable()
export class ProspectService {
  constructor(
    @InjectRepository(Prospect)
    private prospectRepository: Repository<Prospect>,
    @InjectRepository(Companies)
    private companyRepository: Repository<Companies>,
  ) {}

  async create(
    createProspectDto: CreateProspectDto[],
  ): Promise<IResponse<Prospect[]>> {
    try {
      const companyId = createProspectDto[0]?.company_id;
      if (!companyId) {
        return {
          success: false,
          message: 'Missing company_id in payload',
          code: 400,
        };
      }

      const company = await this.companyRepository.findOne({
        where: { id: companyId },
      });

      if (!company) {
        return {
          success: false,
          message: `Company with ID ${companyId} not found`,
          code: 404,
        };
      }

      const prospects = createProspectDto.map((dto) => ({
        ...dto,
        user_id: company.user_id, // Set user_id from company
      }));

      const createdProspects = this.prospectRepository.create(prospects);
      const savedProspects = await this.prospectRepository.save(
        createdProspects,
      );

      return {
        success: true,
        message: 'Prospect(s) created successfully',
        data: savedProspects,
        code: 201,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: 'Failed to create prospect(s)',
        error: error.message,
        code: 400,
      };
    }
  }

  async findAll(companyId: string): Promise<IResponse<Prospect[]>> {
    try {
      const prospects = await this.prospectRepository.find({
        where: { company_id: companyId },
        relations: ['company'],
      });

      return {
        success: true,
        message: 'Prospects retrieved successfully',
        data: prospects,
        total: prospects.length,
        code: 200,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve prospects',
        error: error.message,
        code: 400,
      };
    }
  }

  async findOne(id: string, companyId: string): Promise<IResponse<Prospect>> {
    try {
      const prospect = await this.prospectRepository.findOne({
        where: { id, company_id: companyId },
        relations: ['company'],
      });

      if (!prospect) {
        return {
          success: false,
          message: `Prospect with ID ${id} not found`,
          code: 404,
        };
      }

      return {
        success: true,
        message: 'Prospect retrieved successfully',
        data: prospect,
        code: 200,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve prospect',
        error: error.message,
        code: 400,
      };
    }
  }

  async update(
    id: string,
    companyId: string,
    updateProspectDto: UpdateProspectDto,
  ): Promise<IResponse<Prospect>> {
    try {
      const findResponse = await this.findOne(id, companyId);

      if (!findResponse.success) {
        return findResponse;
      }

      const prospect = findResponse.data;

      // If company_id is being updated, verify new company exists
      if (
        updateProspectDto.company_id &&
        updateProspectDto.company_id !== companyId
      ) {
        const newCompany = await this.companyRepository.findOne({
          where: { id: updateProspectDto.company_id },
        });

        if (!newCompany) {
          return {
            success: false,
            message: `Company with ID ${updateProspectDto.company_id} not found`,
            code: 404,
          };
        }

        // Update user_id to match the new company's user_id for backward compatibility
        prospect.user_id = newCompany.user_id;
      }

      Object.assign(prospect, updateProspectDto);

      const updatedProspect = await this.prospectRepository.save(prospect);

      return {
        success: true,
        message: 'Prospect updated successfully',
        data: updatedProspect,
        code: 200,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update prospect',
        error: error.message,
        code: 400,
      };
    }
  }

  async remove(id: string, companyId: string): Promise<IResponse> {
    try {
      const findResponse = await this.findOne(id, companyId);

      if (!findResponse.success) {
        return findResponse;
      }

      await this.prospectRepository.remove(findResponse.data);

      return {
        success: true,
        message: 'Prospect deleted successfully',
        code: 200,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete prospect',
        error: error.message,
        code: 400,
      };
    }
  }
}
