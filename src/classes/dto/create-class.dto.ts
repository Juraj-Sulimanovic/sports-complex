import { IsNotEmpty, IsEnum, IsInt, Min, Max, IsString, IsArray, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SportType, ClassType } from '../entities/class.entity';

export class CreateClassDto {
  @ApiProperty({
    description: 'Class name',
    example: 'Basketball Basics'
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Sport type',
    enum: SportType,
    example: SportType.BASKETBALL
  })
  @IsEnum(SportType)
  sportType: SportType;

  @ApiProperty({
    description: 'Class description',
    example: 'Learn the basics of basketball'
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Maximum number of participants',
    example: 20,
    minimum: 1,
    maximum: 30
  })
  @IsInt()
  @Min(1)
  @Max(30)
  maxParticipants: number;

  @ApiProperty({
    description: 'Class start time (HH:MM format)',
    example: '09:00'
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be in HH:MM format (24-hour)'
  })
  startTime: string;

  @ApiProperty({
    description: 'Class end time (HH:MM format)',
    example: '10:00'
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'endTime must be in HH:MM format (24-hour)'
  })
  endTime: string;

  @ApiProperty({
    description: 'Days of the week when the class takes place',
    example: ['Monday', 'Wednesday'],
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  weekDays: string[];

  @IsEnum(ClassType)
  @IsNotEmpty()
  type: ClassType;
} 