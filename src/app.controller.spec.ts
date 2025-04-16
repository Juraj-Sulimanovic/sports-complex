import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('redirectToHealth', () => {
    it('should return undefined for redirect', () => {
      const result = appController.redirectToHealth();
      expect(result).toBeUndefined();
    });
  });
});
