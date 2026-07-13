import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
} from 'class-validator';

export class CreateInquiryDto {
  @IsString()
  @IsNotEmpty({ message: '姓名不能为空' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: '公司名称不能为空' })
  company: string;

  @IsString()
  @IsNotEmpty({ message: '职位不能为空' })
  position: string;

  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsNotEmpty({ message: '请选择感兴趣的产品' })
  productInterest: string;

  @IsString()
  @IsOptional()
  message?: string;
}
