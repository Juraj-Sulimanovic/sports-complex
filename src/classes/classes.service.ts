import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  async findOne(id: number): Promise<Class> {
    const classEntity = await this.classRepository.findOne({
      where: { id },
    });

    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }

    return classEntity;
  }
} 