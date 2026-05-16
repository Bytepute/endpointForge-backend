import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterRequestDto {
  @Expose()
  @IsString()
  @MinLength(3)
  @MaxLength(15)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain alphanumeric and underscores',
  })
  @ApiProperty({
    description: 'Username for the new user',
    example: 'user_123',
  })
  userName!: string;

  @Expose()
  @IsString()
  @MinLength(8)
  @ApiProperty({
    description: 'Password for the new user',
    example: 'StrongPass!9',
  })
  password!: string;
}

export class RegisterResponseDto {
  @Expose()
  @ApiProperty({
    description: 'Unique id of the registered user',
    example: 42,
  })
  userId!: number;

  @Expose()
  @ApiProperty({
    description: 'Username of the registered user',
    example: 'user_123',
  })
  userName!: string;

  @Expose()
  @ApiProperty({
    description: 'User creation timestamp',
    example: '2026-05-11T08:34:00.000Z',
  })
  createdAt!: Date;

  @Expose()
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken!: string;

  @Expose()
  @ApiProperty({
    description: 'Expire time',
    example: '1h',
  })
  expiresIn!: number;

  constructor(partial: Partial<RegisterResponseDto>) {
    Object.assign(this, partial);
  }
}
