import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ProjectResponseDto {
  @ApiProperty({
    example: 1,
  })
  @Expose()
  id: number;

  @ApiProperty({
    example: 'User Service Mock',
  })
  @Expose()
  name: string;

  @ApiProperty({
    example: 'Mock APIs for user microservice',
    nullable: true,
  })
  @Expose()
  description: string | null;

  @ApiProperty({
    example: 4001,
    nullable: true,
    description: 'Port where the mock server runs',
  })
  @Expose()
  port: number | null;

  @ApiProperty({
    example: '2026-04-24T08:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @Expose()
  createdAt: Date;
}
