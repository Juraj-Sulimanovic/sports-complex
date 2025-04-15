import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
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
    default: SportType.BASKETBALL
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

  @OneToMany(() => Enrollment, enrollment => enrollment.class)
  enrollments: Enrollment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
