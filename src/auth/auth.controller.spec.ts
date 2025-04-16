import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User, UserRole } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ConflictException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
            register: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return access token', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };

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

      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);
      jest.spyOn(authService, 'login').mockResolvedValue({
        access_token: 'access-token',
        token_type: 'Bearer',
      });

      const result = await controller.login(loginDto);
      expect(result).toEqual({
        access_token: 'access-token',
        token_type: 'Bearer',
      });
    });

    it('should login a user and return JWT token and user data', async () => {
      const userEmail = 'user@example.com';
      const loginDto: LoginDto = {
        email: userEmail,
        password: 'password',
      };

      const mockUser: User = {
        id: 1,
        email: userEmail,
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

      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);
      jest.spyOn(authService, 'login').mockResolvedValue({
        access_token: 'access-token',
        token_type: 'Bearer',
      });

      const result = await controller.login(loginDto);
      expect(result).toEqual({
        access_token: 'access-token',
        token_type: 'Bearer',
      });
    });
  });

  describe('register', () => {
    it('should create and return user', async () => {
      const registerDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.USER,
      };

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

      jest.spyOn(usersService, 'create').mockResolvedValue(mockUser);

      const result = await controller.register(registerDto);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _password, ...expectedResult } = mockUser;
      expect(result).toEqual(expectedResult);
    });

    it('should pass through ConflictException', async () => {
      const registerDto: CreateUserDto = {
        email: 'existing@example.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.USER,
      };

      jest
        .spyOn(usersService, 'create')
        .mockRejectedValue(
          new ConflictException('User with this email already exists'),
        );

      await expect(controller.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
