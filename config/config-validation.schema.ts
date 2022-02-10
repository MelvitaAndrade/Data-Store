import * as Joi from '@hapi/joi';
import { DatabaseConnectionMode } from '../src/constants/database-connection.constants';

/**
 * Config schema with set of validations
 */
export const ConfigValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  SERVER_PORT: Joi.number().default(3002),

  HOST_URL: Joi.string().uri().required(),

  ALLOWED_ORIGIN: Joi.string().default(/.+\.gs\.cimpress\.io$/gm),

  // Auth config
  AUTH0_APP_NAME: Joi.string().default('Data Store'),
  AUTH0_CLIENT_ID: Joi.string().required().length(32),
  AUTH0_DOMAIN: Joi.string().uri().default('https://cimpress.auth0.com'),
  AUTH0_AUDIENCE: Joi.string().uri().default('https://api.cimpress.io/'),
  AUTH0_REDIRECT_URL: Joi.string()
    .uri()
    .default((schema) => `${schema.HOST_URL}/oauth2-redirect.html`),
  AUTHORIZATION_URL: Joi.string()
    .uri()
    .default((schema) => `${schema.AUTH0_DOMAIN}authorize`),
  TOKEN_URL: Joi.string()
    .uri()
    .default((schema) => `${schema.AUTH0_DOMAIN}oauth/token`),

  DATABASE_NAME: Joi.string().default('data-store'),

  // Mongo connection config
  MONGO_CONNECTION_METHOD: Joi.string()
    .valid(
      DatabaseConnectionMode.DEFAULT,
      DatabaseConnectionMode.IAM,
      DatabaseConnectionMode.SCRAM,
    )
    .required(),
  MONGODB_HOST_URL: Joi.string().required(),
  MONGODB_URI: Joi.string().default(
    (schema) => `${schema.MONGODB_HOST_URL}/${schema.DATABASE_NAME}`,
  ),
  MONGO_USERNAME: Joi.string().when('MONGO_CONNECTION_METHOD', {
    is: DatabaseConnectionMode.SCRAM,
    then: Joi.string().required(),
  }),
  MONGO_PASSWORD: Joi.string().when('MONGO_CONNECTION_METHOD', {
    is: DatabaseConnectionMode.SCRAM,
    then: Joi.string().required(),
  }),

  //Token expiry time in milliseconds
  // Milliseconds * seconds per minute * minutes per hour * number of hours
  TOKEN_EXPIRY_TIME: Joi.number().default(1000 * 60 * 60 * 5),

  // New Relic
  NEW_RELIC_ENABLED: Joi.boolean().required(),
  NEW_RELIC_NO_CONFIG_FILE: Joi.when('NEW_RELIC_ENABLED', {
    is: true,
    then: Joi.boolean().required(),
    otherwise: Joi.boolean().default(true),
  }),
  NEW_RELIC_APP_NAME: Joi.string().when('NEW_RELIC_NO_CONFIG_FILE', {
    is: true,
    then: Joi.when('NEW_RELIC_ENABLED', {
      is: true,
      then: Joi.string().required(),
    }),
  }),
  NEW_RELIC_LICENSE_KEY: Joi.when('NEW_RELIC_NO_CONFIG_FILE', {
    is: true,
    then: Joi.when('NEW_RELIC_ENABLED', {
      is: true,
      then: Joi.string().required(),
    }),
  }),
  NEW_RELIC_DISTRIBUTED_TRACING_ENABLED: Joi.when('NEW_RELIC_NO_CONFIG_FILE', {
    is: true,
    then: Joi.when('NEW_RELIC_ENABLED', {
      is: true,
      then: Joi.boolean().required(),
    }),
  }),
  NEW_RELIC_TRANSACTION_TRACER_ATTRIBUTES_ENABLED: Joi.when(
    'NEW_RELIC_NO_CONFIG_FILE',
    {
      is: true,
      then: Joi.when('NEW_RELIC_ENABLED', {
        is: true,
        then: Joi.boolean().required(),
      }),
    },
  ),
  NEW_RELIC_ERROR_COLLECTOR_IGNORE_ERROR_CODES: Joi.when(
    'NEW_RELIC_NO_CONFIG_FILE',
    {
      is: true,
      then: Joi.when('NEW_RELIC_ENABLED', {
        is: true,
        then: Joi.string(),
      }),
    },
  ),
});
