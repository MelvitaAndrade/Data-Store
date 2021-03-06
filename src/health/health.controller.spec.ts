import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import {
  HealthCheckService,
  MongooseHealthIndicator,
  TerminusModule,
} from '@nestjs/terminus';
import { HealthCheckExecutor } from '@nestjs/terminus/dist/health-check/health-check-executor.service';

jest.disableAutomock();

describe('Health Controller', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule],
      providers: [
        HealthCheckService,
        HealthCheckExecutor,
        {
          provide: MongooseHealthIndicator,
          useValue: {
            pingCheck: jest
              .fn()
              .mockResolvedValue({ database: { status: 'up' } }),
          },
        },
      ],
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return status as OK', () => {
    expect(controller.check()).resolves.toEqual({
      status: 'ok',
      info: { database: { status: 'up' } },
      details: { database: { status: 'up' } },
      error: {},
    });
  });
});
