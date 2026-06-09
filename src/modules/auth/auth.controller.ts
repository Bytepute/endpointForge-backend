import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  Res,
  Req,
} from '@nestjs/common';
import {
  RegisterRequestDto,
  RegisterResponseDto,
} from '../users/dtos/register.dto';
import { LoginRequestDto, LoginResponseDto } from '../users/dtos/login.dto';
import { AuthService } from './auth.service';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { TokenPairResponseDto } from './dtos/token-pair.dto';
import type { Request, Response } from 'express';
import {
  REFRESH_COOKIE_NAME,
  REFRESH_COOKIE_OPTIONS,
} from './constants/auth.constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({
    description: 'User registered successfully',
    type: RegisterResponseDto,
  })
  async register(
    @Body() dto: RegisterRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RegisterResponseDto> {
    const tokens = await this.authService.register(dto);

    res.cookie(
      REFRESH_COOKIE_NAME,
      tokens.refreshToken,
      REFRESH_COOKIE_OPTIONS,
    );

    return {
      userId: tokens.userId,
      userName: tokens.userName,
      createdAt: tokens.createdAt,
      accessToken: tokens.accessToken,
      expiresIn: tokens.expiresIn,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'User logged in successfully',
    type: LoginResponseDto,
  })
  async login(
    @Body() loginDto: LoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const tokens = await this.authService.login(loginDto);

    res.cookie(
      REFRESH_COOKIE_NAME,
      tokens.refreshToken,
      REFRESH_COOKIE_OPTIONS,
    );
    return {
      accessToken: tokens.accessToken,
      expiresIn: tokens.expiresIn,
      tokenType: tokens.tokenType,
      username: loginDto.userName,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies[REFRESH_COOKIE_NAME];

    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    res.clearCookie(REFRESH_COOKIE_NAME, {
      path: '/auth',
    });
    return {
      message: 'Logged out successfully',
    };
  }

  @Post('refresh-token')
  @ApiOkResponse({
    description: 'New tokens sent',
    type: TokenPairResponseDto,
  })
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<TokenPairResponseDto> {
    const refreshToken = req.cookies[REFRESH_COOKIE_NAME];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const tokens = await this.authService.refreshToken(refreshToken);

    res.cookie(
      REFRESH_COOKIE_NAME,
      tokens.refreshToken,
      REFRESH_COOKIE_OPTIONS,
    );
    return {
      username: tokens.username,
      accessToken: tokens.accessToken,
      expiresIn: tokens.expiresIn,
      tokenType: tokens.tokenType,
    };
  }
}
