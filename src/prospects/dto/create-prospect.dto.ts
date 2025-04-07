import { IsArray, IsEmail, IsInt, IsString, IsUrl } from 'class-validator';

export class CreateProspectDto {
  @IsString() country: string;
  @IsString() company_name: string;
  @IsUrl() company_website: string;
  @IsString() industry: string;
  @IsInt() num_employees: number;
  @IsInt() annual_revenue: number;
  @IsString() name: string;
  @IsString() title: string;
  @IsEmail() recommended_email: string;
  @IsArray() emails: string[];
  @IsArray() phones: string[];
  @IsArray() company_keyword: string[];
  @IsUrl() linkedin_url: string;
}
