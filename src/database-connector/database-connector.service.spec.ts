import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseConnectionMode } from '../constants/database-connection.constants';
import { DatabaseConnectorService } from './database-connector.service';

jest.unmock('./database-connector.service');

describe('Database Connector Service', () => {
  let service: DatabaseConnectorService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseConnectorService, ConfigService],
    }).compile();

    service = module.get<DatabaseConnectorService>(DatabaseConnectorService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create mongoose options for DEFAULT', () => {
    jest
      .spyOn(configService, 'get')
      .mockImplementationOnce(() => '0.0.0.0/data-store')
      .mockImplementationOnce(() => DatabaseConnectionMode.DEFAULT);

    expect(service.createMongooseOptions()).toEqual({
      uri: `mongodb://0.0.0.0/data-store`,
    });
  });

  it('should create mongoose options for SCRAM', () => {
    jest
      .spyOn(configService, 'get')
      .mockImplementationOnce(() => '0.0.0.0/data-store')
      .mockImplementationOnce(() => DatabaseConnectionMode.SCRAM)
      .mockImplementationOnce(() => 'test')
      .mockImplementationOnce(() => 'test');
    expect(service.createMongooseOptions()).toEqual({
      uri: `mongodb+srv://test:test@0.0.0.0/data-store`,
    });
  });

  it('should create mongoose options for IAM', () => {
    jest
      .spyOn(configService, 'get')
      .mockImplementationOnce(() => 'mongodb+srv://0.0.0.0/gangstudio')
      .mockImplementationOnce(() => DatabaseConnectionMode.IAM);

    expect(service.createMongooseOptions()).toEqual({
      uri: 'mongodb+srv://0.0.0.0/gangstudio',
      authMechanism: 'MONGODB-AWS',
      authSource: '$external',
    });
  });
});
