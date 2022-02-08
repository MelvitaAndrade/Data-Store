import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { DatabaseConnectionMode } from '../constants/database-connection.constants';

/**
 * Service responsible for fetching connection configuration to database
 */
@Injectable()
export class DatabaseConnectorService implements MongooseOptionsFactory {
  /**
   * Dependency injection for config service
   * @param configService
   */
  constructor(private configService: ConfigService) {}

  /**
   * Chooses relevant connection method based on config provided
   * Supported methods are IAM ROLE, USER NAME PASSWORD, NO CREDENTIALS CONNECTION/DEFAULT method
   * @returns MongooseModuleOptions
   */
  createMongooseOptions(): MongooseModuleOptions {
    const mongoUri = this.configService.get('MONGODB_URI');
    const connectionMethod = this.configService.get('MONGO_CONNECTION_METHOD');
    switch (connectionMethod) {
      case DatabaseConnectionMode.DEFAULT:
        return this.defaultOptions(mongoUri);
      case DatabaseConnectionMode.IAM:
        return this.iamRoleOptions(mongoUri);
      case DatabaseConnectionMode.SCRAM:
        return this.scramOptions(mongoUri);
    }
  }

  /**
   * Gets the mongo database connection configuration option for iam role method
   * @param mongoUri MongoDB URI
   * @returns MongooseModuleOptions
   */
  private iamRoleOptions(mongoUri: string): MongooseModuleOptions {
    return {
      uri: mongoUri,
      authMechanism: 'MONGODB-AWS',
      authSource: '$external',
    };
  }

  /**
   * Gets the mongo database connection configuration option for username password method
   * @param mongoUri MongoDB URI
   * @returns MongooseModuleOptions
   */
  private scramOptions(mongoUri: string): MongooseModuleOptions {
    return {
      uri: `mongodb+srv://${this.configService.get(
        'MONGO_USERNAME',
      )}:${this.configService.get('MONGO_PASSWORD')}@${mongoUri}`,
    };
  }

  /**
   * Gets the mongo database connection configuration option for default method
   * @param mongoUri MongoDB Uri
   * @returns MongooseModuleOptions
   */
  private defaultOptions(mongoUri: string): MongooseModuleOptions {
    return { uri: `mongodb://${mongoUri}` };
  }
}
