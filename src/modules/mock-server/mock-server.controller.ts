import { Controller, Param, Post, Body } from '@nestjs/common';
import { MockServerService } from './mock-server.service';

@Controller('mock')
export class MockServerController {
  constructor(private readonly mockServerService: MockServerService) {}

  @Post('start/:projectId')
  start(@Param('projectId') projectId: number) {
    return this.mockServerService.startServer(projectId);
  }

  @Post('stop/:projectId')
  stop(@Param('projectId') projectId: number) {
    return this.mockServerService.stopServer(projectId);
  }
}
