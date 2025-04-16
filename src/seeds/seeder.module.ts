import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { Class } from '../classes/entities/class.entity';
import { Enrollment } from '../classes/entities/enrollment.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Class, Enrollment, User])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
