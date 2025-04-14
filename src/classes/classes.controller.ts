import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClassesService } from './classes.service';
import { Class } from './entities/class.entity';

@ApiTags('classes')
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

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
} 