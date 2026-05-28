import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TokenPairResponseDto {
  @Expose()
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  username!: string;

  @Expose()
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  accessToken!: string;

  @Expose()
  @ApiProperty({
    example: 3600,
    description: 'Access token expiration time in seconds',
  })
  expiresIn!: number;

  @Expose()
  @ApiProperty({
    example: 'Bearer',
    description: 'Token type',
  })
  tokenType!: string;
}
