import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from '../classes/entities/class.entity';
import { User } from '../users/entities/user.entity';
import {
  Enrollment,
  EnrollmentStatus,
} from '../classes/entities/enrollment.entity';
import { classesSeed } from './classes.seed';
// import { enrollmentsSeed } from './enrollments.seed';
import { usersSeed } from './users.seed';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DataSource } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CreateClassDto } from 'src/classes/dto/create-class.dto';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
  ) {}

  async seed() {
    await this.seedClasses();
    await this.seedUsers();
    await this.seedEnrollments();
  }

  async seedClasses() {
    const classes = classesSeed.map((classData) =>
      this.classRepository.create(classData),
    );
    await this.classRepository.save(classes);
    this.logger.log('Classes seeded successfully');
  }

  async seedUsers() {
    const users = usersSeed.map((userData) =>
      this.userRepository.create(userData),
    );
    await this.userRepository.save(users);
    this.logger.log('Users seeded successfully');
  }

  async seedEnrollments() {
    const enrollments = [
      { classId: 1, userId: 1 },
      { classId: 2, userId: 2 },
      { classId: 3, userId: 3 },
      { classId: 1, userId: 2 },
      { classId: 2, userId: 1 }
    ];

    // Get all classes and users first
    const classes = await this.classRepository.find();
    const users = await this.userRepository.find();

    // Create enrollments with proper class and user objects
    const enrollmentsToSave = enrollments.map((enrollment) => {
      const classEntity = classes.find((c) => c.id === enrollment.classId);
      const userEntity = users.find((u) => u.id === enrollment.userId);

      if (!classEntity || !userEntity) {
        throw new Error(
          `Class or User not found for enrollment: ${JSON.stringify(enrollment)}`,
        );
      }

      return this.enrollmentRepository.create({
        class: classEntity,
        user: userEntity,
        status: EnrollmentStatus.CONFIRMED,
      });
    });

    await this.enrollmentRepository.save(enrollmentsToSave);
    this.logger.log('Enrollments seeded successfully');
  }
}
