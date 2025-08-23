import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiTags,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

interface AuthRequest extends Request {
  user: {
    sub: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
  };
  cookies: { [key: string]: string };
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  private setRefreshCookie(res: Response, token: string) {
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'strict' : 'lax',
      domain: process.env.COOKIE_DOMAIN || undefined,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });
  }

  @Post('register')
  @HttpCode(201)
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async register(@Body() dto: RegisterDto) {
    // Chỉ trả về user, không tạo token
    const result = await this.auth.register(dto.name, dto.email, dto.password);
    return { user: result.user };
  }

  @Post('login')
  @HttpCode(200)
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.auth.login(dto.email, dto.password);
    this.setRefreshCookie(res, result.refreshToken);
    return { user: result.user, accessToken: result.accessToken };
  }

  @ApiCookieAuth()
  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(200)
  async refresh(
    @Req() req: AuthRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const oldRefreshToken = req.cookies?.refreshToken;
    const tokens = await this.auth.refresh(req.user.sub, oldRefreshToken);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken: tokens.accessToken };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAccessGuard)
  @Get('me')
  @ApiResponse({ status: 200, description: 'Current logged in user' })
  me(@Req() req: AuthRequest) {
    return req.user; // { sub, email, role, iat, exp }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAccessGuard)
  @Post('logout')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  async logout(
    @Req() req: AuthRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.user.sub;

    // 1. Xóa refresh token trên server (nếu lưu database/Redis)
    await this.auth.logout(userId);

    // 2. Xóa cookie refreshToken trên client
    res.clearCookie('refreshToken', { path: '/' });

    return { success: true, message: 'Logged out successfully' };
  }
}
