import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InsightsService } from './insights.service';
import { CreateInsightDto } from './dto/create-insight.dto';
import { UpdateInsightDto } from './dto/update-insight.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiResponse } from '../../common/constants/response.constant';

@Controller('insights')
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Get()
  async findAll(@Query('status') status?: string): Promise<ApiResponse> {
    const insights = await this.insightsService.findAll(status);
    return {
      code: 200,
      message: '获取洞察列表成功',
      data: insights,
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse> {
    const insight = await this.insightsService.findOne(id);
    return {
      code: 200,
      message: '获取洞察详情成功',
      data: insight,
      timestamp: new Date().toISOString(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createInsightDto: CreateInsightDto): Promise<ApiResponse> {
    const insight = await this.insightsService.create(createInsightDto);
    return {
      code: 201,
      message: '创建洞察成功',
      data: insight,
      timestamp: new Date().toISOString(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInsightDto: UpdateInsightDto,
  ): Promise<ApiResponse> {
    const insight = await this.insightsService.update(id, updateInsightDto);
    return {
      code: 200,
      message: '更新洞察成功',
      data: insight,
      timestamp: new Date().toISOString(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiResponse> {
    await this.insightsService.remove(id);
    return {
      code: 200,
      message: '删除洞察成功',
      data: null,
      timestamp: new Date().toISOString(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ): Promise<ApiResponse> {
    const insight = await this.insightsService.updateStatus(id, status);
    return {
      code: 200,
      message: '更新洞察状态成功',
      data: insight,
      timestamp: new Date().toISOString(),
    };
  }
}
