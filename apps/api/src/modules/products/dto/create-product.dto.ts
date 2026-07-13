import { IsString, IsNotEmpty, IsOptional, IsArray, IsObject, IsEnum, IsInt } from 'class-validator';

export enum ProductStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  OFFLINE = 'offline',
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: '产品名称不能为空' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: '产品描述不能为空' })
  description: string;

  @IsArray()
  @IsOptional()
  features?: string[];

  @IsObject()
  @IsOptional()
  technicalParams?: Record<string, any>;

  @IsArray()
  @IsOptional()
  applicationScenarios?: string[];

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsArray()
  @IsOptional()
  documents?: string[];

  @IsEnum(ProductStatus, { message: '状态必须是 draft、published 或 offline' })
  @IsOptional()
  status?: ProductStatus;

  @IsInt()
  @IsOptional()
  sortOrder?: number;
}