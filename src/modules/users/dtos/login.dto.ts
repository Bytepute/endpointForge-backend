import { IsString, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Username to login',
    example: 'user_123',
  })
  userName!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Password of the user',
    example: 'StrongPassword!9',
  })
  password!: string;
}

export class LoginResponseDto {
  @Expose()
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken!: string;

  @Expose()
  @ApiProperty({
    description: 'Access token expiration time in seconds',
    example: 3600,
  })
  expiresIn!: number;

  @Expose()
  @ApiProperty({
    description: 'Type of the token',
    example: 'Bearer',
  })
  tokenType!: string;

  constructor(partial: Partial<LoginResponseDto>) {
    Object.assign(this, partial);
  }
}
