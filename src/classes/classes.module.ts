import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';
import { Class } from './entities/class.entity';
import { Enrollment } from './entities/enrollment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Class, Enrollment])],
  controllers: [ClassesController],
  providers: [ClassesService],
  exports: [ClassesService],
})
export class ClassesModule {}
