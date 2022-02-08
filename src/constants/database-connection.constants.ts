/**
 * Enum for supported mongo database connection types which includes Default, Scram & IAM
 */
export enum DatabaseConnectionMode {
  /**
   * Default way of accessing mongodb cluster
   * Connects without user name or password
   */
  DEFAULT = 'DEFAULT',
  /**
   * Used when IAM role policy is attached
   * Policy should have access to IAM cluster
   * @external https://docs.mongodb.com/drivers/node/fundamentals/authentication/mechanisms/#mongodb-aws
   */
  IAM = 'IAM',

  /**
   * When trying to form a connection using user name and password
   */
  SCRAM = 'SCRAM',
}
