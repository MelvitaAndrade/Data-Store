import { closeInMongodConnection } from './utils/mongo-utils';

/**
 * Steps to be followed before exiting from the e2e test cases
 */
module.exports = async (): Promise<void> => {
  await closeInMongodConnection();
};
