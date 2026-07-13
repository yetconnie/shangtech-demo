import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { InquiriesService } from './inquiries.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiResponse } from '../../common/constants/response.constant';

@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Post()
  async create(@Body() createInquiryDto: CreateInquiryDto): Promise<ApiResponse> {
    const inquiry = await this.inquiriesService.create(createInquiryDto);
    return {
      code: 201,
      message: '提交成功，我们将尽快与您联系',
      data: inquiry,
      timestamp: new Date().toISOString(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<ApiResponse> {
    const inquiries = await this.inquiriesService.findAll();
    return {
      code: 200,
      message: '获取询价列表成功',
      data: inquiries,
      timestamp: new Date().toISOString(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse> {
    const inquiry = await this.inquiriesService.findOne(id);
    return {
      code: 200,
      message: '获取询价详情成功',
      data: inquiry,
      timestamp: new Date().toISOString(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'new' | 'read' | 'replied',
  ): Promise<ApiResponse> {
    const inquiry = await this.inquiriesService.updateStatus(id, status);
    return {
      code: 200,
      message: '更新询价状态成功',
      data: inquiry,
      timestamp: new Date().toISOString(),
    };
  }
}

