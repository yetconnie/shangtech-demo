import { IsString, IsNotEmpty, IsOptional, IsArray, IsEnum, IsInt } from 'class-validator';

export enum CaseStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  OFFLINE = 'offline',
}

export interface CaseResult {
  metric: string;
  value: string;
  description?: string;
}

export class CreateCaseDto {
  @IsString()
  @IsNotEmpty({ message: '客户名称不能为空' })
  clientName: string;

  @IsString()
  @IsOptional()
  clientLogoUrl?: string;

  @IsString()
  @IsNotEmpty({ message: '项目名称不能为空' })
  projectName: string;

  @IsString()
  @IsNotEmpty({ message: '项目摘要不能为空' })
  projectSummary: string;

  @IsString()
  @IsOptional()
  clientBackground?: string;

  @IsString()
  @IsOptional()
  challenges?: string;

  @IsString()
  @IsOptional()
  solution?: string;

  @IsString()
  @IsOptional()
  implementation?: string;

  @IsArray()
  @IsOptional()
  results?: CaseResult[];

  @IsString()
  @IsOptional()
  clientTestimonial?: string;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsArray()
  @IsOptional()
  videos?: string[];

  @IsEnum(CaseStatus, { message: '状态必须是 draft、published 或 offline' })
  @IsOptional()
  status?: CaseStatus;

  @IsInt()
  @IsOptional()
  sortOrder?: number;

  @IsArray()
  @IsOptional()
  productIds?: string[];
}