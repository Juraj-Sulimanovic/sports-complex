import {
  IsEnum,
  IsInt,
  Min,
  Max,
  IsString,
  IsArray,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SportType } from '../entities/class.entity';

export class UpdateClassDto {
  @ApiProperty({
    description: 'Class name',
    example: 'Basketball Basics',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Sport type',
    enum: SportType,
    example: SportType.BASKETBALL,
    required: false,
  })
  @IsOptional()
  @IsEnum(SportType)
  sportType?: SportType;

  @ApiProperty({
    description: 'Class description',
    example: 'Learn the basics of basketball',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Maximum number of participants',
    example: 20,
    minimum: 1,
    maximum: 30,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(30)
  maxParticipants?: number;

  @ApiProperty({
    description: 'Class start time (HH:MM format)',
    example: '09:00',
    required: false,
  })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiProperty({
    description: 'Class end time (HH:MM format)',
    example: '10:00',
    required: false,
  })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiProperty({
    description: 'Days of the week when the class takes place',
    example: ['Monday', 'Wednesday'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  weekDays?: string[];
}
