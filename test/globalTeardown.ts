import { closeInMongodConnection } from './utils/mongo-utils';

module.exports = async (): Promise<void> => {
  await closeInMongodConnection();
};
