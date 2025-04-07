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
  @IsOptional()
  @IsUUID()
  user_id?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  company_name?: string;

  @IsOptional()
  @IsUrl()
  company_website?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsInt()
  num_employees?: number;

  @IsOptional()
  @IsInt()
  annual_revenue?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEmail()
  recommended_email?: string;

  @IsOptional()
  @IsArray()
  emails?: string[];

  @IsOptional()
  @IsArray()
  phones?: string[];

  @IsOptional()
  @IsArray()
  company_keyword?: string[];

  @IsOptional()
  @IsUrl()
  linkedin_url?: string;
}
