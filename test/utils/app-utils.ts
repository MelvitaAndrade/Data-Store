import {
  ClassSerializerInterceptor,
  INestApplication,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { HttpAdapterHost, Reflector } from '@nestjs/core';
import { InterfaceConstants } from '../../src/constants/interface.constants';
import { GenericExceptionFilter } from '../../src/filters/exception-filter/exception-filter';

/**
 * Imports needed for generic exception filter
 */
export const exceptionFilterImports = [
  {
    provide: InterfaceConstants.LOGGER,
    useClass: Logger,
  },
  {
    provide: InterfaceConstants.HTTP_REF,
    useClass: HttpAdapterHost,
  },
  {
    provide: InterfaceConstants.EXCEPTION_FILTER,
    useClass: GenericExceptionFilter,
  },
];

/**
 * Initializes the Nest App with interceptors, pipes, containers, etc.
 * @param app
 */
export function initializeApp(app: INestApplication): void {
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );
  app.useGlobalFilters(app.get(InterfaceConstants.EXCEPTION_FILTER));
}
