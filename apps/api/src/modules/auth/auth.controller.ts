import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiResponse } from '../../common/constants/response.constant';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<ApiResponse> {
    const result = await this.authService.login(loginDto);
    return {
      code: 200,
      message: '登录成功',
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: any): Promise<ApiResponse> {
    return {
      code: 200,
      message: '获取用户信息成功',
      data: req.user,
      timestamp: new Date().toISOString(),
    };
  }
}