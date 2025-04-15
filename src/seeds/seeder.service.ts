import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from '../classes/entities/class.entity';
import { Enrollment } from '../classes/entities/enrollment.entity';
import { User } from '../users/entities/user.entity';
import { classesSeed } from './classes.seed';
import { enrollmentsSeed } from './enrollments.seed';
import { usersSeed } from './users.seed';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed() {
    await this.seedUsers();
    const classes = await this.seedClasses();
    await this.seedEnrollments(classes);
  }

  private async seedUsers() {
    const existingUsers = await this.userRepository.count();
    if (existingUsers === 0) {
      await this.userRepository.save(usersSeed);
      console.log('Users seeded successfully');
    } else {
      console.log('Users already exist, skipping seeding');
    }
  }

  private async seedClasses() {
    const existingClasses = await this.classRepository.count();
    if (existingClasses === 0) {
      const classes = await this.classRepository.save(classesSeed);
      console.log('Classes seeded successfully');
      return classes;
    } else {
      console.log('Classes already exist, skipping seeding');
      return await this.classRepository.find();
    }
  }

  private async seedEnrollments(classes: Class[]) {
    const existingEnrollments = await this.enrollmentRepository.count();
    if (existingEnrollments === 0) {
      // Map the enrollments to use the actual class IDs
      const enrollmentsWithIds = enrollmentsSeed.map(enrollment => {
        const classIndex = enrollment.classId - 1; // Convert 1-based index to 0-based
        return {
          ...enrollment,
          classId: classes[classIndex].id,
        };
      });
      await this.enrollmentRepository.save(enrollmentsWithIds);
      console.log('Enrollments seeded successfully');
    } else {
      console.log('Enrollments already exist, skipping seeding');
    }
  }
} 