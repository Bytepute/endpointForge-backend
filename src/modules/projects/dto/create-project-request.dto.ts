import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class CreateProjectRequestDto {
  @ApiProperty({
    example: 'User Service Mock',
    description: 'Name of the mock project',
  })
  @IsString()
  @IsNotEmpty({ message: 'Project name is required' })
  name: string;

  @ApiPropertyOptional({
    example: 'Mock APIs for user microservice',
    description: 'Optional project description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 4001,
    description: 'Port where the mock server will run',
    minimum: 4000,
    maximum: 5000,
  })
  @IsInt()
  @Min(4000)
  @Max(5000)
  @IsOptional()
  port?: number;
}
