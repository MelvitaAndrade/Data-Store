import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

/**
 * Live check controller acts like a ping to the service
 */
@Controller('live')
@ApiTags('Health')
export class LiveController {
  /**
   * Verification point whether service is alive or not
   */
  @Get('')
  async live(): Promise<string> {
    return 'ok';
  }
}
