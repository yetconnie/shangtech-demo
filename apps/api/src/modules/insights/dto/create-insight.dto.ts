import { IsString, IsOptional, IsEnum, IsInt, IsNotEmpty } from 'class-validator';

export enum InsightCategory {
  TECHNOLOGY = 'technology',
  INDUSTRY = 'industry',
  LEADERSHIP = 'leadership',
}

export enum InsightStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  OFFLINE = 'offline',
}

export class CreateInsightDto {
  @IsString()
  @IsNotEmpty({ message: '标题不能为空' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: '摘要不能为空' })
  summary: string;

  @IsEnum(InsightCategory, { message: '分类必须是 technology、industry 或 leadership' })
  @IsOptional()
  category?: InsightCategory;

  @IsEnum(InsightStatus, { message: '状态必须是 draft、published 或 offline' })
  @IsOptional()
  status?: InsightStatus;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsString()
  @IsOptional()
  authorName?: string;

  @IsString()
  @IsOptional()
  authorRole?: string;

  @IsString()
  @IsOptional()
  authorAvatar?: string;

  @IsString()
  @IsOptional()
  url?: string;

  @IsInt()
  @IsOptional()
  sortOrder?: number;
}
