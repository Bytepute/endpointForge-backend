import {
  IsString,
  IsInt,
  IsOptional,
  IsNotEmpty,
  Matches,
} from 'class-validator';
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
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'Endpoints related to user management',
    description: 'Optional description of the route group',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'user-service',
    description: 'Unique URL identifier for the project',
  })
  @IsString()
  @IsNotEmpty({ message: 'Slug is required' })
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug can only contain lowercase letters, numbers, and hyphens',
  })
  slug: string;
}
