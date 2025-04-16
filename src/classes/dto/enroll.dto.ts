import { IsInt, Min, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EnrollmentStatus } from '../entities/enrollment.entity';

export class EnrollDto {
  @ApiProperty({
    description:
      'The ID of the user to enroll (optional for authenticated users)',
    example: 1,
    minimum: 1,
    required: false,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  userId?: number;

  @ApiProperty({
    description: 'The enrollment status',
    enum: EnrollmentStatus,
    default: EnrollmentStatus.PENDING,
    required: false,
  })
  @IsEnum(EnrollmentStatus)
  @IsOptional()
  status?: EnrollmentStatus;
}
