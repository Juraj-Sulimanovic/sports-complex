import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let usersService: UsersService;

  const createMockUser = (overrides: Partial<User> = {}): User => ({
    id: 1,
    email: 'test@example.com',
    password: 'hashed-password',
    firstName: 'Test',
    lastName: 'User',
    isActive: true,
    role: UserRole.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
    enrollments: [],
    validatePassword: jest.fn().mockReturnValue(true),
    setPassword: jest.fn(),
    ...overrides,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('access-token'),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      const mockUser: User = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed-password',
        firstName: 'Test',
        lastName: 'User',
        isActive: true,
        role: UserRole.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        enrollments: [],
        validatePassword: jest.fn().mockResolvedValue(true),
        setPassword: jest.fn(),
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser);

      const result = await service.validateUser('test@example.com', 'password');

      expect(result).not.toBeNull();
      if (result) {
        expect(result.id).toBe(1);
        expect(result.email).toBe('test@example.com');
        expect(result.firstName).toBe('Test');
        expect(result.lastName).toBe('User');
        expect(result.isActive).toBe(true);
        expect(result.role).toBe(UserRole.USER);
      }
    });

    it('should return null if user not found', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      const mockUser: User = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed-password',
        firstName: 'Test',
        lastName: 'User',
        isActive: true,
        role: UserRole.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        enrollments: [],
        validatePassword: jest.fn().mockResolvedValue(false),
        setPassword: jest.fn(),
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser);

      const result = await service.validateUser(
        'test@example.com',
        'wrong-password',
      );
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token', async () => {
      const mockUser: User = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed-password',
        firstName: 'Test',
        lastName: 'User',
        isActive: true,
        role: UserRole.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        enrollments: [],
        validatePassword: jest.fn(),
        setPassword: jest.fn(),
      };

      jest.spyOn(jwtService, 'sign').mockReturnValue('access-token');

      const result = await service.login(mockUser);
      expect(result).toEqual({
        access_token: 'access-token',
        token_type: 'Bearer',
      });
    });
  });

  describe('register', () => {
    it('should create and return user', async () => {
      const mockUser: User = createMockUser();

      jest.spyOn(usersService, 'create').mockResolvedValue(mockUser);

      const result = await service.register('test@example.com', 'password');

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.email).toBe('test@example.com');
      expect(result.firstName).toBe('Test');
      expect(result.lastName).toBe('User');
      expect(result.isActive).toBe(true);
      expect(result.role).toBe(UserRole.USER);
    });

    it('should throw UnauthorizedException if user already exists', async () => {
      jest
        .spyOn(usersService, 'create')
        .mockRejectedValue(new UnauthorizedException('User already exists'));

      await expect(
        service.register('test@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
