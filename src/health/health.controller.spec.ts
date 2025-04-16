import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  let controller: HealthController;
  let healthService: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: {
            check: jest.fn().mockResolvedValue({
              status: 'ok',
              timestamp: '2024-04-16T18:24:27.000Z',
              uptime: 1234,
              databaseStatus: 'up',
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    healthService = module.get<HealthService>(HealthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('check', () => {
    it('should return health status', async () => {
      const result = await controller.check();
      expect(result).toEqual({
        status: 'ok',
        timestamp: '2024-04-16T18:24:27.000Z',
        uptime: 1234,
        databaseStatus: 'up',
      });
      expect(healthService.check).toHaveBeenCalled();
    });
  });
});
