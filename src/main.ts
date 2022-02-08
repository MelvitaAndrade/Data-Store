import { NestFactory, Reflector } from '@nestjs/core';
import helmet from 'helmet';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import newrelic from 'newrelic';
import { setupSwagger } from './swagger';
import { InterfaceConstants } from './constants/interface.constants';

/**
 * Instance of nest application
 */
let app: INestApplication;

/**
 * Sets up helmet based configuration
 */
function setUpHelmet(): void {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
          imgSrc: [`'self'`, 'data:'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        },
      },
    }),
  );
}

/**
 * Sets up global validation pipe
 * Sets up global whitelisting
 */
function validationSetUp(): void {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );
}

/**
 * Creates Nest application & adds relevant configuration
 * Sets up global filters, global interceptor, global validation, swagger & helmet
 */
async function initializeApp(): Promise<void> {
  app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(app.get(InterfaceConstants.EXCEPTION_FILTER));
  app.enableCors({
    origin: '*',
  });
  setUpHelmet();
  validationSetUp();
  setupSwagger(app);
}

/**
 * Starts the application with specified port
 */
async function bootstrap(): Promise<void> {
  await initializeApp();
  const configService = app.get(ConfigService);
  const port = configService.get('SERVER_PORT');
  await app.listen(port);
}

bootstrap();
