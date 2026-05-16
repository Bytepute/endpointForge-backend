import { Controller, Param, Post } from '@nestjs/common';
import { MockServerService } from './mock-server.service';
import { Throttle } from '@nestjs/throttler';
import { mockServerThrottleLimit } from 'src/constants/throttle-limit/mock-server-throttle-limit';
import type { CurrentUserData } from '../auth/interfaces/current-user.interface';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
@Controller('mock')
export class MockServerController {
  constructor(private readonly mockServerService: MockServerService) {}

  @Post('start/:projectId')
  @Throttle({ default: mockServerThrottleLimit.start })
  start(
    @Param('projectId') projectId: number,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.mockServerService.startServer(projectId, user.userId);
  }

  @Post('stop/:projectId')
  @Throttle({ default: mockServerThrottleLimit.stop })
  stop(
    @Param('projectId') projectId: number,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.mockServerService.stopServer(projectId, user.userId);
  }
}
