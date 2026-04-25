import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsObject, IsOptional, IsString } from 'class-validator';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export class CreateEndpointRequestDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the route group this endpoint belongs to',
  })
  @IsInt()
  routeGroupId: number;

  @ApiProperty({
    enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    example: 'GET',
    description: 'HTTP method of the endpoint',
  })
  @IsEnum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
  method: HttpMethod;

  @ApiProperty({
    example: '/getInfo',
    description: 'Endpoint path appended to the route group prefix',
  })
  @IsString()
  path: string;

  @ApiPropertyOptional({
    example: 200,
    description: 'HTTP status code returned by the mock endpoint',
  })
  @IsOptional()
  @IsInt()
  statusCode?: number;

  @ApiPropertyOptional({
    example: 500,
    description: 'Artificial response delay in milliseconds',
  })
  @IsOptional()
  @IsInt()
  delay?: number;

  @ApiProperty({
    type: Object,
    example: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
    },
    description: 'JSON response body returned by the mock endpoint',
  })
  @IsObject()
  responseBody: Record<string, any>;
}
