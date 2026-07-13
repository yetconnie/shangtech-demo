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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiResponse } from '../../common/constants/response.constant';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Query('status') status?: string): Promise<ApiResponse> {
    const products = await this.productsService.findAll(status);
    return {
      code: 200,
      message: '获取产品列表成功',
      data: products,
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse> {
    const product = await this.productsService.findOne(id);
    return {
      code: 200,
      message: '获取产品详情成功',
      data: product,
      timestamp: new Date().toISOString(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<ApiResponse> {
    const product = await this.productsService.create(createProductDto);
    return {
      code: 201,
      message: '创建产品成功',
      data: product,
      timestamp: new Date().toISOString(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ApiResponse> {
    const product = await this.productsService.update(id, updateProductDto);
    return {
      code: 200,
      message: '更新产品成功',
      data: product,
      timestamp: new Date().toISOString(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ): Promise<ApiResponse> {
    const product = await this.productsService.updateStatus(id, status);
    return {
      code: 200,
      message: '更新产品状态成功',
      data: product,
      timestamp: new Date().toISOString(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiResponse> {
    await this.productsService.remove(id);
    return {
      code: 200,
      message: '删除产品成功',
      timestamp: new Date().toISOString(),
    };
  }
}