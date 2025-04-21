import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
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
  @IsString({ each: true })
  session_id?: string;
}

export class UpdateCompanyDto extends CreateCompanyDto {
  @IsOptional()
  @IsString()
  company_name: string;
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
  created_at: Date;
  updated_at: Date;
}
