import newrelic from 'newrelic';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  Inject,
} from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import { InterfaceConstants } from '../../constants/interface.constants';
import { ApiErrorResponse } from '../../dto/api-error-response.dto';

/**
 * ExceptionFilter that catches all exceptions occurring within application
 */
@Catch()
export class GenericExceptionFilter
  extends BaseExceptionFilter
  implements ExceptionFilter
{
  /**
   * Provides dependency for Http server required by base exception filter
   * @param appRef - Http adapter host as needed by base exception filter
   * @param logger - Built in Logger from Nest
   */
  constructor(
    @Inject(InterfaceConstants.HTTP_REF) appRef: HttpAdapterHost,
    @Inject(InterfaceConstants.LOGGER) private logger: Logger,
  ) {
    super(appRef.httpAdapter);
  }

  /**
   * Catches the exception thrown
   * @param exception
   * @param host
   */
  catch(exception: Error, host: ArgumentsHost): void {
    if (exception instanceof HttpException) {
      this.handleHttpException(exception);
    } else {
      this.handleUnhandledException(exception);
    }
    super.catch(exception, host);
  }

  /**
   * Throws out error to new relic & constructs response body for unhandled exceptions
   * @param exception
   * @returns ApiResponse
   */
  handleUnhandledException(exception: Error): void {
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const propertyDescriptor = Object.getOwnPropertyDescriptor(
      Object.getPrototypeOf(exception),
      'name',
    );
    if (!propertyDescriptor || propertyDescriptor.writable) {
      exception.name = this.getErrorName(status);
    }
    this.logger.error(exception, exception.stack);
    newrelic.noticeError(exception);
  }

  /**
   * Throws out error to new relic & constructs response body for HTTP exceptions
   * @param exception
   * @returns ApiResponse
   */
  handleHttpException(exception: HttpException): void {
    const response = exception.getResponse() as ApiErrorResponse;
    this.logger.error(response, exception.stack);
    const responseBody = {
      message: response.error,
      error: response.message,
    };
    newrelic.noticeError({
      name: this.getErrorName(exception.getStatus()),
      message: JSON.stringify(responseBody),
      stack: exception.stack,
    });
  }

  /**
   * Constructs error name
   * @param status
   * @returns string
   */
  private getErrorName(status: number): string {
    return `${status} ${HttpStatus[status]}`;
  }
}
