import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginRequestDto } from '../users/dtos/login.dto';

import { AuthenticatedUser } from './types/authenticated-user.type';
import { TokenPair } from './types/tokenpair.type';
import {
  ACCESS_TOKEN_EXPIRES_IN,
  ACCESS_TOKEN_EXPIRES_IN_SECONDS,
  REFRESH_TOKEN_EXPIRES_IN,
  TOKEN_TYPE,
} from './constants/auth.constants';
import { PasswordService } from './password.service';
import { RegisterRequestDto } from '../users/dtos/register.dto';
import { RegisterResponse } from './types/register-response.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
  ) {}

  private async validateUser(
    username: string,
    password: string,
  ): Promise<AuthenticatedUser> {
    const user = await this.usersService.findByUsername(username);
    if (!user) throw new UnauthorizedException('User not found');

    const isPasswordValid = await this.passwordService.verify(
      user.passwordHash,
      password,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Wrong username or password');

    return {
      id: user.id,
      userName: user.userName,
    };
  }

  async login(loginDto: LoginRequestDto): Promise<TokenPair> {
    const user = await this.validateUser(loginDto.userName, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user.id, user.userName);
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      const decoded = this.jwtService.verify<{ sub: number }>(refreshToken);

      await this.usersService.incrementTokenVersion(decoded.sub);
    } catch {
      // Ignore invalid/expired refresh tokens during logout
    }
  }

  async register(dto: RegisterRequestDto): Promise<RegisterResponse> {
    const passwordHash = await this.passwordService.hash(dto.password);

    const user = await this.usersService.create({
      userName: dto.userName,
      passwordHash,
    });

    const tokens = await this.generateTokens(user.id, user.userName);

    return {
      userId: user.id,
      userName: user.userName,
      createdAt: user.createdAt,
      ...tokens,
    };
  }

  async generateTokens(userId: number, userName: string): Promise<TokenPair> {
    const tokenVersion = await this.usersService.getTokensVersion(userId);
    const payload = { username: userName, sub: userId };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
    const refreshToken = this.jwtService.sign(
      { sub: userId, tokenVersion },
      {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      },
    );
    return {
      username: userName,
      accessToken: accessToken,
      refreshToken: refreshToken,
      expiresIn: ACCESS_TOKEN_EXPIRES_IN_SECONDS,
      tokenType: TOKEN_TYPE,
    };
  }

  async refreshToken(refreshToken: string): Promise<TokenPair> {
    try {
      const decoded = this.jwtService.verify<{
        sub: number;
        tokenVersion: number;
      }>(refreshToken);

      const userId = decoded.sub;
      const tokenVersionInToken = decoded.tokenVersion;

      const currentTokenVersion =
        await this.usersService.getTokensVersion(userId);

      if (tokenVersionInToken !== currentTokenVersion) {
        throw new UnauthorizedException('Refresh token revoked');
      }

      const user = await this.usersService.findById(userId);

      await this.usersService.incrementTokenVersion(userId);

      return this.generateTokens(user.id, user.userName);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
