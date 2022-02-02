import packageJson from '../package.json';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import newrelic from 'newrelic';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Sets up swagger with layout service basic details
 * Sets the title, description, version
 * @param configService
 * @returns build
 */
const getSwaggerObject = (
  configService: ConfigService,
): Omit<OpenAPIObject, 'components' | 'paths'> => {
  const swaggerBuilder = new DocumentBuilder()
    .setTitle(packageJson.displayName)
    .setDescription(packageJson.description)
    .setVersion(packageJson.version)
    .addTag('Health')
    .addOAuth2({
      type: 'oauth2',
      in: 'header',
      flows: {
        implicit: {
          authorizationUrl: configService.get('AUTHORIZATION_URL'),
          tokenUrl: configService.get('TOKEN_URL'),
          scopes: { openid: '' },
        },
      },
    });

  return swaggerBuilder.build();
};

/**
 * Sets up configuration for swagger
 * @param configService
 * @returns config
 */
const getSwaggerConfig = (configService: ConfigService): unknown => {
  return {
    oauth2RedirectUrl: configService.get('AUTH0_REDIRECT_URL'),
    oauth: {
      clientId: configService.get('AUTH0_CLIENT_ID'),
      appName: configService.get('AUTH0_APP_NAME'),
      scopeSeparator: ' ',
      additionalQueryStringParams: {
        audience: configService.get('AUTH0_AUDIENCE'),
      },
    },
    operationsSorter: 'method',
    displayRequestDuration: true,
  };
};

/**
 * Sets up the swagger page for Layout Service
 * @param app
 */
export const setupSwagger = (app: INestApplication): void => {
  const configService = app.get(ConfigService);
  const swaggerObject = getSwaggerObject(configService);
  const swaggerConfig = getSwaggerConfig(configService);

  const document = SwaggerModule.createDocument(app, swaggerObject, {
    extraModels: [],
  });
  SwaggerModule.setup('', app, document, {
    swaggerOptions: swaggerConfig,
  });
  /** Ignore swagger related files in the transaction */
  newrelic.addIgnoringRule(new RegExp(`\/$`));
  newrelic.addIgnoringRule('.css');
  newrelic.addIgnoringRule('.html');
  newrelic.addIgnoringRule('.png');
  newrelic.addIgnoringRule('.js');
};
