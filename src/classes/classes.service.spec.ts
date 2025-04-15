import { Test, TestingModule } from '@nestjs/testing';
import { ClassesService } from './classes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Class, SportType, ClassType } from './entities/class.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateClassDto } from './dto/create-class.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Enrollment } from './entities/enrollment.entity';

describe('ClassesService', () => {
  let service: ClassesService;
  let classRepository: Repository<Class>;
  let enrollmentRepository: Repository<Enrollment>;

  const mockClassRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    merge: jest.fn(),
  };

  const mockEnrollmentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    count: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClassesService,
        {
          provide: getRepositoryToken(Class),
          useValue: mockClassRepository,
        },
        {
          provide: getRepositoryToken(Enrollment),
          useValue: mockEnrollmentRepository,
        },
      ],
    }).compile();

    service = module.get<ClassesService>(ClassesService);
    classRepository = module.get<Repository<Class>>(getRepositoryToken(Class));
    enrollmentRepository = module.get<Repository<Enrollment>>(getRepositoryToken(Enrollment));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a class', async () => {
      const createClassDto: CreateClassDto = {
        name: 'Test Class',
        description: 'Test Description',
        sportType: SportType.BASKETBALL,
        type: ClassType.GROUP,
        maxParticipants: 20,
        startTime: new Date(),
        endTime: new Date(),
        weekDays: ['Monday', 'Wednesday'],
      };

      const mockClass = {
        id: 1,
        ...createClassDto,
      };

      mockClassRepository.create.mockReturnValue(mockClass);
      mockClassRepository.save.mockResolvedValue(mockClass);

      const result = await service.create(createClassDto);

      expect(result).toEqual(mockClass);
      expect(mockClassRepository.create).toHaveBeenCalledWith({
        ...createClassDto,
        startTime: createClassDto.startTime.toLocaleTimeString('en-US', { hour12: false }),
        endTime: createClassDto.endTime.toLocaleTimeString('en-US', { hour12: false }),
      });
      expect(mockClassRepository.save).toHaveBeenCalledWith(mockClass);
    });
  });

  describe('findAll', () => {
    it('should return an array of classes', async () => {
      const mockClasses = [
        {
          id: 1,
          name: 'Test Class 1',
          type: ClassType.GROUP,
          sportType: SportType.BASKETBALL,
        },
        {
          id: 2,
          name: 'Test Class 2',
          type: ClassType.PRIVATE,
          sportType: SportType.TENNIS,
        },
      ];

      mockClassRepository.find.mockResolvedValue(mockClasses);

      const result = await service.findAll();

      expect(result).toEqual(mockClasses);
      expect(mockClassRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a class when it exists', async () => {
      const mockClass = {
        id: 1,
        name: 'Test Class',
        type: ClassType.GROUP,
        sportType: SportType.BASKETBALL,
      };

      mockClassRepository.findOne.mockResolvedValue(mockClass);

      const result = await service.findOne(1);

      expect(result).toEqual(mockClass);
      expect(mockClassRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException when class does not exist', async () => {
      mockClassRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(mockClassRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });
  });

  describe('enroll', () => {
    it('should enroll a user in a class', async () => {
      const mockClass = {
        id: 1,
        name: 'Test Class',
        type: ClassType.GROUP,
        sportType: SportType.BASKETBALL,
        maxParticipants: 20,
      };

      mockClassRepository.findOne.mockResolvedValue(mockClass);
      mockEnrollmentRepository.count.mockResolvedValue(0);
      mockEnrollmentRepository.findOne.mockResolvedValue(null);
      mockEnrollmentRepository.create.mockReturnValue({ classId: 1, userId: 1 });
      mockEnrollmentRepository.save.mockResolvedValue({ classId: 1, userId: 1 });

      const result = await service.enroll(1, 1);

      expect(result).toEqual({ classId: 1, userId: 1 });
      expect(mockClassRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockEnrollmentRepository.count).toHaveBeenCalledWith({
        where: { classId: 1 },
      });
      expect(mockEnrollmentRepository.findOne).toHaveBeenCalledWith({
        where: { classId: 1, userId: 1 },
      });
      expect(mockEnrollmentRepository.create).toHaveBeenCalledWith({
        classId: 1,
        userId: 1,
      });
      expect(mockEnrollmentRepository.save).toHaveBeenCalledWith({
        classId: 1,
        userId: 1,
      });
    });

    it('should throw BadRequestException when class is full', async () => {
      const mockClass = {
        id: 1,
        name: 'Test Class',
        type: ClassType.GROUP,
        sportType: SportType.BASKETBALL,
        maxParticipants: 1,
      };

      mockClassRepository.findOne.mockResolvedValue(mockClass);
      mockEnrollmentRepository.count.mockResolvedValue(1);

      await expect(service.enroll(1, 1)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when user is already enrolled', async () => {
      const mockClass = {
        id: 1,
        name: 'Test Class',
        type: ClassType.GROUP,
        sportType: SportType.BASKETBALL,
        maxParticipants: 20,
      };

      mockClassRepository.findOne.mockResolvedValue(mockClass);
      mockEnrollmentRepository.count.mockResolvedValue(0);
      mockEnrollmentRepository.findOne.mockResolvedValue({ classId: 1, userId: 1 });

      await expect(service.enroll(1, 1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update a class', async () => {
      const mockClass = {
        id: 1,
        name: 'Test Class',
        type: ClassType.GROUP,
        sportType: SportType.BASKETBALL,
      };

      const updateClassDto = {
        name: 'Updated Class',
      };

      mockClassRepository.findOne.mockResolvedValue(mockClass);
      mockClassRepository.merge.mockReturnValue({
        ...mockClass,
        ...updateClassDto,
      });
      mockClassRepository.save.mockResolvedValue({
        ...mockClass,
        ...updateClassDto,
      });

      const result = await service.update(1, updateClassDto);

      expect(result).toEqual({
        ...mockClass,
        ...updateClassDto,
      });
      expect(mockClassRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockClassRepository.merge).toHaveBeenCalledWith(mockClass, updateClassDto);
      expect(mockClassRepository.save).toHaveBeenCalledWith({
        ...mockClass,
        ...updateClassDto,
      });
    });
  });

  describe('remove', () => {
    it('should remove a class', async () => {
      const mockClass = {
        id: 1,
        name: 'Test Class',
        type: ClassType.GROUP,
        sportType: SportType.BASKETBALL,
      };

      mockClassRepository.findOne.mockResolvedValue(mockClass);
      mockClassRepository.remove.mockResolvedValue(mockClass);

      await service.remove(1);

      expect(mockClassRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockClassRepository.remove).toHaveBeenCalledWith(mockClass);
    });
  });
}); 