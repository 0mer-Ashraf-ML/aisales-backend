import {
  IsArray,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';

export class CreateProspectDto {
  @IsUUID()
  user_id: string;

  @IsString()
  country: string;

  @IsString()
  company_name: string;

  @IsUrl()
  company_website: string;

  @IsString()
  industry: string;

  @IsInt()
  num_employees: number;

  @IsInt()
  annual_revenue: number;

  @IsString()
  name: string;

  @IsString()
  title: string;

  @IsEmail()
  recommended_email: string;

  @IsArray()
  emails: string[];

  @IsArray()
  phones: string[];

  @IsArray()
  company_keyword: string[];

  @IsUrl()
  linkedin_url: string;
}
