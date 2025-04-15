import { Controller, Get, Param, ParseIntPipe, Post, Body, Query, BadRequestException, UseGuards, Delete, Patch } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ClassesService } from './classes.service';
import { Class } from './entities/class.entity';
import { EnrollDto } from './dto/enroll.dto';
import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

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

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new class (Admin only)',
    description: 'Creates a new sports class with the provided details. Requires admin authentication.'
  })
  @ApiResponse({
    status: 201,
    description: 'The class has been successfully created.',
    type: Class
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data. Please check the request body.'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Valid JWT token required.'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Admin role required.'
  })
  async create(@Body() createClassDto: CreateClassDto): Promise<Class> {
    return this.classesService.create(createClassDto);
  }

  @Post(':id/enroll')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a class (Admin only)',
    description: 'Updates an existing sports class with the provided details. Requires admin authentication.'
  })
  @ApiParam({
    name: 'id',
    description: 'Numeric ID of the class to update',
    example: 1,
    type: Number,
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'The class has been successfully updated.',
    type: Class
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data. Please check the request body.'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Valid JWT token required.'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Admin role required.'
  })
  @ApiResponse({
    status: 404,
    description: 'Class not found. The provided ID does not match any existing class.'
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClassDto: UpdateClassDto,
  ): Promise<Class> {
    return this.classesService.update(id, updateClassDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a class (Admin only)',
    description: 'Deletes an existing sports class. Requires admin authentication.'
  })
  @ApiParam({
    name: 'id',
    description: 'Numeric ID of the class to delete',
    example: 1,
    type: Number,
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'The class has been successfully deleted.'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Valid JWT token required.'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Admin role required.'
  })
  @ApiResponse({
    status: 404,
    description: 'Class not found. The provided ID does not match any existing class.'
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.classesService.remove(id);
  }
} 
