import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';

/**
 * Class for validating auth token
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Initializes the object for auth validation
   */
  constructor(config: ConfigService) {
    const domain = config.get('AUTH0_DOMAIN');
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${domain}.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: config.get('AUTH0_AUDIENCE'),
      issuer: domain,
      algorithms: ['RS256'],
    });
  }

  /**
   * Validates & returns the payload
   * @param payload
   * @returns payload
   */
  validate(payload: unknown): unknown {
    return payload;
  }
}
