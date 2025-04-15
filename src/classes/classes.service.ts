import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { Enrollment } from './entities/enrollment.entity';
import { EnrollDto } from './dto/enroll.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
  ) {}

  async findAll(): Promise<Class[]> {
    return this.classRepository.find();
  }

  async findBySports(sportTypes: string[]): Promise<Class[]> {
    return this.classRepository
      .createQueryBuilder('class')
      .where('class.sportType IN (:...sportTypes)', { sportTypes })
      .getMany();
  }

  async findOne(id: number): Promise<Class> {
    const classEntity = await this.classRepository.findOne({
      where: { id },
    });

    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }

    return classEntity;
  }

  async enroll(classId: number, userId: number) {
    const classEntity = await this.findOne(classId);

    // Check if class is full
    const currentEnrollments = await this.getEnrollmentCount(classId);
    if (currentEnrollments >= classEntity.maxParticipants) {
      throw new BadRequestException('Class is full');
    }

    // Check if user is already enrolled
    const isEnrolled = await this.isUserEnrolled(classId, userId);
    if (isEnrolled) {
      throw new BadRequestException('User is already enrolled in this class');
    }

    // Create enrollment
    return this.createEnrollment(classId, userId);
  }

  private async getEnrollmentCount(classId: number): Promise<number> {
    return this.enrollmentRepository.count({
      where: { classId },
    });
  }

  private async isUserEnrolled(classId: number, userId: number): Promise<boolean> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { classId, userId },
    });
    return !!enrollment;
  }

  private async createEnrollment(classId: number, userId: number) {
    const enrollment = this.enrollmentRepository.create({
      classId,
      userId,
    });
    return this.enrollmentRepository.save(enrollment);
  }

  async create(createClassDto: CreateClassDto): Promise<Class> {
    const classEntity = this.classRepository.create({
      ...createClassDto,
      startTime: createClassDto.startTime,
      endTime: createClassDto.endTime,
    });

    return this.classRepository.save(classEntity);
  }

  async update(id: number, updateClassDto: UpdateClassDto): Promise<Class> {
    const existingClass = await this.findOne(id);
    const updatedClass = this.classRepository.merge(existingClass, updateClassDto);
    return this.classRepository.save(updatedClass);
  }

  async remove(id: number): Promise<void> {
    const existingClass = await this.findOne(id);
    await this.classRepository.remove(existingClass);
  }
} 