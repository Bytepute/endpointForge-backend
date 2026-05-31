import { Controller, Param, Post } from '@nestjs/common';
import { MockRuntimeService } from './mock-runtime.service';
import { Throttle } from '@nestjs/throttler';
import { mockServerThrottleLimit } from 'src/constants/throttle-limit/mock-server-throttle-limit';
import type { CurrentUserData } from '../auth/interfaces/current-user.interface';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('mock')
export class MockRuntimeController {
  constructor(private readonly mockServerService: MockRuntimeService) {}

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
