import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Body,
  Query,
  UseGuards,
  Delete,
  Put,
  Req,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ClassesService } from './classes.service';
import { Class } from './entities/class.entity';
import { EnrollDto } from './dto/enroll.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Classes')
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get all classes',
    description:
      'Retrieves a list of all sports classes, optionally filtered by sport type and day.',
  })
  @ApiQuery({
    name: 'sports',
    required: false,
    description:
      'Comma-separated list of sports to filter by (e.g., Basketball,Football)',
    type: String,
  })
  @ApiQuery({
    name: 'day',
    required: false,
    description: 'Filter classes by day of the week (e.g., Monday, Tuesday)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'The list of classes has been successfully retrieved.',
    type: [Class],
  })
  findAll(@Query('sports') sports?: string, @Query('day') day?: string) {
    return this.classesService.findAll(sports?.split(','), day, undefined);
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Get class details by ID',
    description:
      'Retrieves detailed information about a specific sports class including schedule, description, and other relevant details.',
  })
  @ApiParam({
    name: 'id',
    description: 'Numeric ID of the class',
    example: 1,
    type: Number,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The class details have been successfully retrieved.',
    type: Class,
  })
  @ApiResponse({
    status: 404,
    description:
      'Class not found. The provided ID does not match any existing class.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid ID format. The provided ID must be a positive integer.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.classesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  @ApiOperation({
    summary: 'Create a new class',
    description: 'Creates a new sports class. Requires admin role.',
  })
  @ApiBearerAuth('bearer')
  @ApiResponse({
    status: 201,
    description: 'The class has been successfully created.',
    type: Class,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data. Please check the request body.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Valid JWT token required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Admin role required.',
  })
  create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.create(createClassDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/enroll')
  @ApiOperation({
    summary: 'Enroll in a class',
    description:
      'Enrolls a user in a sports class. Requires authentication. Authenticated user will be enrolled if no userId is provided in the body.',
  })
  @ApiBearerAuth('bearer')
  @ApiParam({
    name: 'id',
    description: 'Numeric ID of the class',
    example: 1,
    type: Number,
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully enrolled in the class.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Class not found. The provided ID does not match any existing class.',
  })
  @ApiResponse({
    status: 400,
    description: 'The class is full or the user is already enrolled.',
  })
  enroll(
    @Param('id', ParseIntPipe) id: number,
    @Body() enrollDto: EnrollDto,
    @Req() req: { user: { userId: number; email: string; role: string } },
  ) {
    console.log('Enrolling user:', req.user);
    console.log('Enroll DTO:', enrollDto);
    return this.classesService.enroll(id, enrollDto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put(':id')
  @ApiOperation({
    summary: 'Update a class',
    description: 'Updates an existing sports class. Requires admin role.',
  })
  @ApiBearerAuth('bearer')
  @ApiParam({
    name: 'id',
    description: 'Numeric ID of the class',
    example: 1,
    type: Number,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The class has been successfully updated.',
    type: Class,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data. Please check the request body.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Valid JWT token required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Admin role required.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Class not found. The provided ID does not match any existing class.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClassDto: UpdateClassDto,
  ) {
    return this.classesService.update(id, updateClassDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a class',
    description: 'Deletes an existing sports class. Requires admin role.',
  })
  @ApiBearerAuth('bearer')
  @ApiParam({
    name: 'id',
    description: 'Numeric ID of the class',
    example: 1,
    type: Number,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The class has been successfully deleted.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Valid JWT token required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Admin role required.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Class not found. The provided ID does not match any existing class.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.classesService.remove(id);
  }
}
