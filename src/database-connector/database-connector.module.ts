import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConnectorService } from './database-connector.service';

@Module({
  imports: [ConfigModule],
  providers: [DatabaseConnectorService],
  exports: [DatabaseConnectorService],
})
export class DatabaseConnectorModule {}
