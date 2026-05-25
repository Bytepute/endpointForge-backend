import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateCurrentUserRequestDto {
  @Expose()
  @IsString()
  @MinLength(3)
  @MaxLength(15)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain alphanumeric and underscores',
  })
  @ApiProperty({
    description: 'Username for the current user',
    example: 'user_123',
  })
  userName!: string;
}
