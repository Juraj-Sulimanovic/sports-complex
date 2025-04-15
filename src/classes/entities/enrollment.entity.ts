import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Class } from './class.entity';
import { User } from '../../users/entities/user.entity';

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Class, (class_) => class_.enrollments)
  class: Class;

  @Column()
  classId: number;

  @ManyToOne(() => User, user => user.enrollments)
  user: User;

  @Column()
  userId: number;

  @CreateDateColumn()
  enrolledAt: Date;
} 