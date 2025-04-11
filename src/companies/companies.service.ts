import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prospect } from './entities/prospect.entity';
import { Companies } from './entities/companies.entity';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/create-company.dto';
import { IResponse } from '@src/common/interfaces';
import { CompanyImportDto } from './dto/create-prospect.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Companies)
    private companyRepository: Repository<Companies>,
    @InjectRepository(Prospect)
    private prospectRepository: Repository<Prospect>,
  ) {}

  async create(
    createCompanyDto: CreateCompanyDto,
    userId: string,
  ): Promise<IResponse<Companies>> {
    try {
      const company = this.companyRepository.create({
        ...createCompanyDto,
        user_id: userId,
      });
      const savedCompany = await this.companyRepository.save(company);

      return {
        success: true,
        message: 'Company created successfully',
        data: savedCompany,
        code: 201,
      };
    } catch (error) {
      console.log(error)
      return {
        success: false,
        message: 'Failed to create company',
        error: error.message,
        code: 400,
      };
    }
  }

  async importCompanyWithProspects(
    companyData: CompanyImportDto,
    userId: string,
  ): Promise<IResponse<Companies>> {
    try {
      // Create the company
      const company = this.companyRepository.create({
        company_name: companyData.company_name,
        dba: companyData.dba,
        products_services: companyData.products_services,
        buyer_industries: companyData.buyer_industries,
        web_url: companyData.web_url,
        target_region: companyData.target_region,
        target_industries: companyData.target_industries,
        preferred_company_size: companyData.preferred_company_size,
        preferred_contact_department: companyData.preferred_contact_department,
        preferred_industry_keywords: companyData.preferred_industry_keywords,
        tech_stack: companyData.tech_stack,
        user_id: userId,
      });

      // Create the prospects if they exist
      if (companyData.prospects && companyData.prospects.length > 0) {
        const prospects = companyData.prospects.map((prospectData) =>
          this.prospectRepository.create({
            ...prospectData,
            user_id: userId, // Set user_id for backward compatibility
          }),
        );
        company.prospects = prospects;
      }

      // Save the company with its prospects
      const savedCompany = await this.companyRepository.save(company);

      return {
        success: true,
        message: `Company imported successfully with ${
          company.prospects?.length || 0
        } prospects`,
        data: savedCompany,
        code: 201,
        total: company.prospects?.length || 0,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to import company with prospects',
        error: error.message,
        code: 400,
      };
    }
  }

  async findAll(userId: string): Promise<IResponse<Companies[]>> {
    try {
      const companies = await this.companyRepository.find({
        where: { user_id: userId },
        relations: ['prospects'],
      });

      return {
        success: true,
        message: 'Companies retrieved successfully',
        data: companies,
        total: companies.length,
        code: 200,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve companies',
        error: error.message,
        code: 400,
      };
    }
  }

  async findOne(id: string, userId: string): Promise<IResponse<Companies>> {
    try {
      const company = await this.companyRepository.findOne({
        where: { id, user_id: userId },
        relations: ['prospects'],
      });

      if (!company) {
        return {
          success: false,
          message: `Company with ID ${id} not found`,
          code: 404,
        };
      }

      return {
        success: true,
        message: 'Company retrieved successfully',
        data: company,
        code: 200,
        total: company.prospects?.length || 0,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve company',
        error: error.message,
        code: 400,
      };
    }
  }

  async update(
    id: string,
    userId: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<IResponse<Companies>> {
    try {
      const findResponse = await this.findOne(id, userId);

      if (!findResponse.success) {
        return findResponse;
      }

      const company = findResponse.data;
      Object.assign(company, updateCompanyDto);

      const updatedCompany = await this.companyRepository.save(company);

      return {
        success: true,
        message: 'Company updated successfully',
        data: updatedCompany,
        code: 200,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update company',
        error: error.message,
        code: 400,
      };
    }
  }

  async remove(id: string, userId: string): Promise<IResponse> {
    try {
      const findResponse = await this.findOne(id, userId);

      if (!findResponse.success) {
        return findResponse;
      }

      await this.companyRepository.remove(findResponse.data);

      return {
        success: true,
        message: 'Company deleted successfully',
        code: 200,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete company',
        error: error.message,
        code: 400,
      };
    }
  }
}
