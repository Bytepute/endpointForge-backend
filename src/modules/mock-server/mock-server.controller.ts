import { Controller, Param, Post, Body } from '@nestjs/common';
import { MockServerService } from './mock-server.service';
import { Throttle } from '@nestjs/throttler';
import { mockServerThrottleLimit } from 'src/constants/throttle-limit/mock-server-throttle-limit';

@Controller('mock')
export class MockServerController {
  constructor(private readonly mockServerService: MockServerService) {}

  @Post('start/:projectId')
  @Throttle({ default: mockServerThrottleLimit.start })
  start(@Param('projectId') projectId: number) {
    return this.mockServerService.startServer(projectId);
  }

  @Post('stop/:projectId')
  @Throttle({ default: mockServerThrottleLimit.stop })
  stop(@Param('projectId') projectId: number) {
    return this.mockServerService.stopServer(projectId);
  }
}
