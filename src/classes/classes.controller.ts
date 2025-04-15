import { Controller, Get, Param, ParseIntPipe, Post, Body, Query, BadRequestException } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { ClassesService } from './classes.service';
import { Class } from './entities/class.entity';
import { EnrollDto } from './dto/enroll.dto';

@ApiTags('classes')
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all classes',
    description: 'Retrieves a list of all sports classes, optionally filtered by sport type.'
  })
  @ApiQuery({
    name: 'sports',
    required: false,
    description: 'Comma-separated list of sports to filter by (e.g., Basketball,Football)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'The list of classes has been successfully retrieved.',
    type: [Class]
  })
  async findAll(@Query('sports') sports?: string): Promise<Class[]> {
    if (sports) {
      const sportTypes = sports.split(',').map(s => s.trim());
      return this.classesService.findBySports(sportTypes);
    }
    return this.classesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get class details by ID',
    description: 'Retrieves detailed information about a specific sports class including schedule, description, and other relevant details.'
  })
  @ApiParam({
    name: 'id',
    description: 'Numeric ID of the class',
    example: 1,
    type: Number,
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'The class details have been successfully retrieved.',
    type: Class
  })
  @ApiResponse({
    status: 404,
    description: 'Class not found. The provided ID does not match any existing class.'
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID format. The provided ID must be a positive integer.'
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Class> {
    return this.classesService.findOne(id);
  }

  @Post(':id/enroll')
  @ApiOperation({
    summary: 'Enroll a user in a class',
    description: 'Enrolls a user in a specific sports class, checking for availability and capacity.'
  })
  @ApiParam({
    name: 'id',
    description: 'Numeric ID of the class to enroll in',
    example: 1,
    type: Number,
    required: true
  })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully enrolled in the class.'
  })
  @ApiResponse({
    status: 404,
    description: 'Class not found. The provided ID does not match any existing class.'
  })
  @ApiResponse({
    status: 400,
    description: 'The class is full or the user is already enrolled.'
  })
  async enroll(
    @Param('id', ParseIntPipe) id: number,
    @Body() enrollDto: EnrollDto,
  ) {
    return this.classesService.enroll(id, enrollDto.userId);
  }
} 
