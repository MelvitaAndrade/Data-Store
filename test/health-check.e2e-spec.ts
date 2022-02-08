import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { HealthController } from '../src/health/health.controller';
import { HealthCheckService, TerminusModule } from '@nestjs/terminus';
import { HealthCheckExecutor } from '@nestjs/terminus/dist/health-check/health-check-executor.service';
import { AuthModule } from '../src/auth/auth.module';
import { InterfaceConstants } from '../src/constants/interface.constants';
import { exceptionFilterImports, initializeApp } from './utils/app-utils';

describe('Health Check', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, TerminusModule],
      controllers: [HealthController],
      providers: [
        HealthCheckService,
        HealthCheckExecutor,
        ...exceptionFilterImports,
      ],
      exports: [InterfaceConstants.EXCEPTION_FILTER],
    }).compile();

    app = module.createNestApplication();
    initializeApp(app);
    await app.init();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(401)
      .expect(res =>
        expect(res.body).toHaveProperty('message', 'Unauthorized'),
      );
  });

  afterAll(async () => {
    await app.close();
  });
});
