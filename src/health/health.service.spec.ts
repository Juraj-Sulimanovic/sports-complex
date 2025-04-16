import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';
import { DataSource } from 'typeorm';

describe('HealthService', () => {
  let service: HealthService;
  // DataSource is provided but not used in these tests
  // let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: DataSource,
          useValue: {
            query: jest.fn().mockResolvedValue([{ 1: '1' }]),
          },
        },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
    // dataSource = module.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('check', () => {
    it('should return health status', async () => {
      const result = await service.check();
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('uptime');
      expect(result).toHaveProperty('databaseStatus');
      expect(result.status).toBe('ok');
      expect(result.databaseStatus).toBe('up');
    });
  });
});
