import { DatabaseConnectionMode } from '../src/constants/database-connection.constants';
import { startMongoServer, connectionUri } from './utils/mongo-utils';

module.exports = async (): Promise<void> => {
  /**
   * Environment variables are being set here to establish connection to mongo server
   * Disable new relic
   */
  process.env = Object.assign(process.env, {
    NEW_RELIC_ENABLED: false,
    NEW_RELIC_NO_CONFIG_FILE: true,
    MONGO_CONNECTION_METHOD: DatabaseConnectionMode.DEFAULT,
    MONGODB_URI: connectionUri,
    HOST_URL: 'http://localhost:3002',
    MONGODB_HOST_URL: '0.0.0.0',
    AUTH0_CLIENT_ID: '1234567890ABCDEFGHIJKLMNOPQRSTUV',
  });

  await startMongoServer();
};
