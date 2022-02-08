import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { TerminusModule } from '@nestjs/terminus';
import { ConfigValidationSchema } from '../config/config-validation.schema';
import { AuthModule } from './auth/auth.module';
import { InterfaceConstants } from './constants/interface.constants';
import { DatabaseConnectorModule } from './database-connector/database-connector.module';
import { DatabaseConnectorService } from './database-connector/database-connector.service';
import { GenericExceptionFilter } from './filters/exception-filter/exception-filter';
import { HealthController } from './health/health.controller';
import { LiveController } from './live/live.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      envFilePath: ['./config/.env'],
      isGlobal: true,
      validationSchema: ConfigValidationSchema,
      validationOptions: {
        abortEarly: true,
      },
    }),
    DatabaseConnectorModule,
    MongooseModule.forRootAsync({
      imports: [DatabaseConnectorModule, ConfigModule],
      useClass: DatabaseConnectorService,
    }),
    TerminusModule,
    AuthModule,
  ],
  controllers: [LiveController, HealthController],
  providers: [
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
  ],
})
export class AppModule {}
