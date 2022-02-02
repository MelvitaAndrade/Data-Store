import { MongoMemoryReplSet } from 'mongodb-memory-server';

/**
 * Database name to which connection is to be established
 */
const dbName = 'data-store';

/**
 * Replica set name which is supposed to spawned up
 */
const replicaSetName = 'testset-data-store';

/**
 * Port on mongo database is to be connected
 */
const port = 27019;

/**
 * Connection string
 */
export const connectionUri = `127.0.0.1:${port}/${dbName}?replicaSet=${replicaSetName}`;

/**
 * Instance for mongo memory replica set
 */
let replSet: MongoMemoryReplSet;

/**
 * Starts the mongo database which holds data in-memory
 * Starts Mongo Replica server since transactions are getting executed
 * Populates initial data to the database
 */
export async function startMongoServer(): Promise<void> {
  replSet = new MongoMemoryReplSet({
    instanceOpts: [
      {
        storageEngine: 'wiredTiger',
        port,
      },
    ],
    replSet: {
      dbName,
      name: replicaSetName,
    },
  });
  await replSet.start();
}

/**
 * Stops running Mongo Replica Server
 */
export async function closeInMongodConnection(): Promise<void> {
  if (replSet) {
    await replSet.stop();
  }
}
