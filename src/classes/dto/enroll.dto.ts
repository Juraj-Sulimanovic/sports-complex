import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EnrollDto {
  @ApiProperty({
    description: 'The ID of the user to enroll',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  userId: number;
} 