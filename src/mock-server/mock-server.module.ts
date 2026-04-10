import { Module } from '@nestjs/common';
import { MockServerService } from './mock-server.service';

@Module({
  providers: [MockServerService]
})
export class MockServerModule {}
