import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class, SportType, ClassType } from './entities/class.entity';
import { Enrollment } from './entities/enrollment.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { EnrollDto } from './dto/enroll.dto';
import { EnrollmentStatus } from './entities/enrollment.entity';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
  ) {}

  async findAll(sports?: string[], day?: string, type?: ClassType) {
    const query = this.classRepository
      .createQueryBuilder('class')
      .leftJoinAndSelect('class.enrollments', 'enrollments');

    if (sports?.length) {
      // Convert to lowercase for case-insensitive comparison
      const normalizedSports = sports
        .map((sport) =>
          Object.values(SportType).find(
            (s) => s.toLowerCase() === sport.toLowerCase(),
          ),
        )
        .filter(Boolean);

      if (normalizedSports.length > 0) {
        query.where('class.sportType IN (:...sports)', {
          sports: normalizedSports,
        });
      }
    }

    if (day) {
      query.andWhere(':day = ANY(class.weekDays)', { day });
    }

    if (type) {
      query.andWhere('class.type = :type', { type });
    }

    return query.getMany();
  }

  async findOne(id: number) {
    const classEntity = await this.classRepository.findOne({
      where: { id },
      relations: ['enrollments'],
    });

    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }

    return classEntity;
  }

  async create(createClassDto: CreateClassDto) {
    const classEntity = this.classRepository.create(createClassDto);
    return this.classRepository.save(classEntity);
  }

  async update(id: number, updateClassDto: UpdateClassDto) {
    const classEntity = await this.findOne(id);
    this.classRepository.merge(classEntity, updateClassDto);
    return this.classRepository.save(classEntity);
  }

  async remove(id: number) {
    const classEntity = await this.findOne(id);
    await this.classRepository.remove(classEntity);
  }

  async enroll(
    id: number,
    enrollDto: EnrollDto,
    user: { userId: number; email: string; role: string },
  ): Promise<Enrollment> {
    const classEntity = await this.classRepository.findOne({
      where: { id },
      relations: ['enrollments'],
    });

    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }

    // Check if class is full
    if (classEntity.enrollments.length >= classEntity.maxParticipants) {
      throw new BadRequestException('Class is full');
    }

    // Get the user ID either from the request body or the authenticated user
    const userId = enrollDto.userId || user.userId;

    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    // Check if user is already enrolled
    const existingEnrollment = await this.enrollmentRepository.findOne({
      where: {
        class: { id },
        user: { id: userId },
      },
    });

    if (existingEnrollment) {
      throw new BadRequestException('User is already enrolled in this class');
    }

    // Create a new enrollment
    try {
      const enrollment = this.enrollmentRepository.create({
        class: { id: id },
        user: { id: userId },
        status: enrollDto.status || EnrollmentStatus.PENDING,
      });

      return await this.enrollmentRepository.save(enrollment);
    } catch (error) {
      console.error('Error creating enrollment:', error);
      if (error.code === '23503') {
        // Foreign key violation
        throw new BadRequestException(`User with ID ${userId} does not exist`);
      }
      throw error;
    }
  }
}
