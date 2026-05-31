import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class CreateProjectRequestDto {
  @ApiProperty({
    example: 'User Service Mock',
    description: 'Name of the mock project',
  })
  @IsString()
  @IsNotEmpty({ message: 'Project name is required' })
  name: string;

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

  @ApiPropertyOptional({
    example: 'Mock APIs for user microservice',
    description: 'Optional project description',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
