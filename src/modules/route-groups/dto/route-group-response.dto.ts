import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RouteGroupResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({
    example: 1,
    description: 'ID of the project this group belongs to',
  })
  @Expose()
  projectId: number;

  @ApiProperty({ example: 'User Routes' })
  @Expose()
  name: string;

  @ApiProperty({
    example: 'Endpoints related to user management',
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
    example: '2026-04-24T08:05:00.000Z',
    type: String,
    format: 'date-time',
  })
  @Expose()
  updatedAt: Date;

  @ApiProperty({
    example: 'user-service',
    description: 'URL slug applied to all endpoints in this route group',
  })
  @Expose()
  slug: string;
}
