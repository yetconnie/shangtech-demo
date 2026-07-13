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
import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiResponse } from '../../common/constants/response.constant';

@Controller('cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Get()
  async findAll(@Query('status') status?: string): Promise<ApiResponse> {
    const cases = await this.casesService.findAll(status);
    return {
      code: 200,
      message: '获取案例列表成功',
      data: cases,
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse> {
    const caseEntity = await this.casesService.findOne(id);
    return {
      code: 200,
      message: '获取案例详情成功',
      data: caseEntity,
      timestamp: new Date().toISOString(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createCaseDto: CreateCaseDto): Promise<ApiResponse> {
    const caseEntity = await this.casesService.create(createCaseDto);
    return {
      code: 201,
      message: '创建案例成功',
      data: caseEntity,
      timestamp: new Date().toISOString(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCaseDto: UpdateCaseDto,
  ): Promise<ApiResponse> {
    const caseEntity = await this.casesService.update(id, updateCaseDto);
    return {
      code: 200,
      message: '更新案例成功',
      data: caseEntity,
      timestamp: new Date().toISOString(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ): Promise<ApiResponse> {
    const caseEntity = await this.casesService.updateStatus(id, status);
    return {
      code: 200,
      message: '更新案例状态成功',
      data: caseEntity,
      timestamp: new Date().toISOString(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiResponse> {
    await this.casesService.remove(id);
    return {
      code: 200,
      message: '删除案例成功',
      timestamp: new Date().toISOString(),
    };
  }
}