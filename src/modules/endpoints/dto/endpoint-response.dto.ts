import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class EndpointResponseDto {
  @ApiProperty({
    example: 1,
  })
  @Expose()
  id: number;

  @ApiProperty({
    example: 2,
  })
  @Expose()
  routeGroupId: number;

  @ApiProperty({
    example: 'GET',
    enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })
  @Expose()
  method: string;

  @ApiProperty({
    example: '/getInfo',
  })
  @Expose()
  path: string;

  @ApiProperty({
    example: 200,
  })
  @Expose()
  statusCode: number;

  @ApiProperty({
    example: 500,
    description: 'Delay in milliseconds before sending the response',
  })
  @Expose()
  delay: number;

  @ApiProperty({
    type: Object,
    example: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
    },
  })
  @Expose()
  responseBody: Record<string, any>;

  @ApiProperty({
    example: '2026-04-24T08:00:00.000Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: '2026-04-24T08:05:00.000Z',
  })
  @Expose()
  updatedAt: Date;
}
