import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { IsNotEmpty, IsEnum, IsInt, Min, Max, IsString } from 'class-validator';
import { Enrollment } from './enrollment.entity';

export enum SportType {
  BASEBALL = 'baseball',
  BASKETBALL = 'basketball',
  FOOTBALL = 'football',
  TENNIS = 'TENNIS',
  SWIMMING = 'SWIMMING',
}

export enum ClassType {
  GROUP = 'GROUP',
  PRIVATE = 'PRIVATE',
  SEMI_PRIVATE = 'SEMI_PRIVATE',
}

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column({
    type: 'enum',
    enum: SportType,
    default: SportType.BASKETBALL,
  })
  @IsEnum(SportType)
  sportType: SportType;

  @Column()
  @IsNotEmpty()
  @IsString()
  description: string;

  @Column({ type: 'int' })
  @IsInt()
  @Min(1)
  @Max(30)
  maxParticipants: number;

  @Column({ type: 'time' })
  @IsNotEmpty()
  startTime: string;

  @Column({ type: 'time' })
  @IsNotEmpty()
  endTime: string;

  @Column('text', { array: true })
  weekDays: string[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.class)
  enrollments: Enrollment[];

  @Column({
    type: 'enum',
    enum: ClassType,
    default: ClassType.GROUP,
  })
  type: ClassType;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
