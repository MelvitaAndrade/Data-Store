import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { LiveController } from '../src/live/live.controller';

describe('Live Controller', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [LiveController],
      providers: [],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('/live (GET)', () => {
    return request(app.getHttpServer())
      .get('/live')
      .expect(200)
      .expect(res => expect(res.text).toBe('ok'));
  });

  afterAll(async () => {
    await app.close();
  });
});
