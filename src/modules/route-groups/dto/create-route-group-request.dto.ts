import { IsString, IsInt, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRouteGroupRequestDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the project this route group belongs to',
  })
  @IsInt()
  projectId: number;

  @ApiProperty({
    example: 'User Routes',
    description: 'Name of the route group',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'Endpoints related to user management',
    description: 'Optional description of the route group',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: '/users',
    description: 'URL prefix applied to all endpoints in this group',
  })
  @IsString()
  prefix: string;
}
