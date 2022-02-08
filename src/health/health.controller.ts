import {
  HealthCheck,
  HealthCheckService,
  HealthCheckResult,
  MongooseHealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOAuth2 } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

/**
 * Class for verifying health of connecting services - downstream services
 */
@Controller('health')
@ApiTags('Health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private mongooseHealth: MongooseHealthIndicator,
  ) {}

  /**
   * Verifies all downstream services are alive or not like database
   */
  @Get('')
  @UseGuards(AuthGuard('jwt'))
  @ApiOAuth2([])
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    return this.health.check([
      (): Promise<HealthIndicatorResult> =>
        this.mongooseHealth.pingCheck('database'),
    ]);
  }
}
