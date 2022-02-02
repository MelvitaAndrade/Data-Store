import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Test, TestingModule } from '@nestjs/testing';
import { InterfaceConstants } from '../../constants/interface.constants';
import { GenericExceptionFilter } from './exception-filter';

jest.unmock('./exception-filter');

describe('Exception Filter', () => {
  function getArgumentsHost(body: unknown): ArgumentsHost {
    return {
      switchToHttp: (): HttpArgumentsHost => ({
        getResponse: (): any => ({
          status: () => ({
            json: (): unknown => body,
          }),
        }),
        getRequest: jest.fn(),
        getNext: jest.fn(),
      }),
      getArgByIndex: jest.fn(),
      getArgs: jest.fn(),
      getType: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
    };
  }

  let service: GenericExceptionFilter;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: InterfaceConstants.HTTP_REF,
          useValue: {
            httpAdapter: {
              reply: jest.fn,
            },
          },
        },
        {
          provide: InterfaceConstants.LOGGER,
          useValue: { error: jest.fn },
        },
        GenericExceptionFilter,
      ],
    }).compile();
    service = module.get<GenericExceptionFilter>(GenericExceptionFilter);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Handle Http exception should be called', () => {
    const spy = jest.spyOn(service, 'handleHttpException');
    service.catch(
      new HttpException('Http exception', HttpStatus.BAD_REQUEST),
      getArgumentsHost('Demo Tag'),
    );
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('Unhandled Http exception should be called', () => {
    const spy = jest.spyOn(service, 'handleUnhandledException');
    service.catch(new Error('Server Error'), getArgumentsHost({}));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('Unhandled Http exception should assign name only where name is writable property', () => {
    const objectData = {};
    service.catch(objectData as unknown as Error, getArgumentsHost({}));
    expect(objectData['name']).toEqual('500 INTERNAL_SERVER_ERROR');
  });

  it('Unhandled Http exception should not assign name when name is not writable property', () => {
    const obj = {};
    Object.defineProperties(Object.getPrototypeOf(obj), {
      name: {
        value: 'Error',
        writable: false,
      },
    });

    service.catch(obj as unknown as Error, getArgumentsHost({}));
    expect(obj['name']).toEqual('Error');
  });
});
