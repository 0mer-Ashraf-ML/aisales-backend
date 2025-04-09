import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  ValidateNested,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProspectResponseDto {
  id: string;
  name?: string;
  title?: string;
  country?: string;
  company_name?: string;
  company_website?: string;
  industry?: string;
  recommended_email?: string;
  emails?: string[];
  phones?: string[];
  company_keyword?: string[];
  linkedin_url?: string;
  num_employees?: number;
  annual_revenue?: number;
  user_id?: string;
  company_id: string;
  created_at: Date;
  updated_at: Date;
}

export class ProspectImportDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  company_name?: string;

  @IsOptional()
  @IsString()
  company_website?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  recommended_email?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  emails?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  phones?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  company_keyword?: string[];

  @IsOptional()
  @IsString()
  linkedin_url?: string;

  @IsOptional()
  @IsNumber()
  num_employees?: number;

  @IsOptional()
  @IsNumber()
  annual_revenue?: number;
}

export class CompanyImportDto {
  @IsNotEmpty()
  @IsString()
  company_name: string;

  @IsOptional()
  @IsString()
  dba?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  products_services?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  buyer_industries?: string[];

  @IsOptional()
  @IsString()
  web_url?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  target_region?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  target_industries?: string[];

  @IsOptional()
  @IsString()
  preferred_company_size?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferred_contact_department?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferred_industry_keywords?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tech_stack?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProspectImportDto)
  prospects?: ProspectImportDto[];
}

export class CompanyResponseDto {
  id: string;
  company_name: string;
  dba?: string;
  products_services?: string[];
  buyer_industries?: string[];
  web_url?: string;
  target_region?: string[];
  target_industries?: string[];
  preferred_company_size?: string;
  preferred_contact_department?: string[];
  preferred_industry_keywords?: string[];
  tech_stack?: string[];
  user_id: string;
  prospects?: ProspectResponseDto[];
  created_at: Date;
  updated_at: Date;
}

export class CreateProspectDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  company_name?: string;

  @IsOptional()
  @IsString()
  company_website?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  recommended_email?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  emails?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  phones?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  company_keyword?: string[];

  @IsOptional()
  @IsString()
  linkedin_url?: string;

  @IsOptional()
  @IsNumber()
  num_employees?: number;

  @IsOptional()
  @IsNumber()
  annual_revenue?: number;

  @IsNotEmpty()
  @IsUUID()
  company_id: string;
}
