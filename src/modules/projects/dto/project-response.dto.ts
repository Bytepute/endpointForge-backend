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
    example: '2026-04-24T08:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: true,
    description:
      'Whether the mock server for this project is currently running',
  })
  @Expose()
  isRuntimeEnabled: boolean;
}
