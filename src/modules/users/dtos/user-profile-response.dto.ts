import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserProfileResponseDto {
  @Expose()
  @ApiProperty({
    description: 'Unique id of the user',
    example: 42,
  })
  id!: number;

  @Expose()
  @ApiProperty({
    description: 'Username of the user',
    example: 'user_123',
  })
  userName!: string;

  @Expose()
  @ApiProperty({
    description: 'User creation timestamp',
    example: '2026-05-11T08:34:00.000Z',
  })
  createdAt!: Date;
}
