import { Test, TestingModule } from '@nestjs/testing';
import { LiveController } from './live.controller';

jest.unmock('./live.controller');

describe('Live Controller', () => {
  let controller: LiveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LiveController],
    }).compile();
    controller = module.get<LiveController>(LiveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Live check', () => {
    it('should return ok', () => {
      expect(controller.live()).resolves.toBe('ok');
    });
  });
});
