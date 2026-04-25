import { Module } from '@nestjs/common';
import { MockServerService } from './mock-server.service';
import { MockServerController } from './mock-server.controller';
import { ServerRegistry } from './server-registry';
import { DbModule } from '../../db/db.module';

@Module({
  imports: [DbModule],
  providers: [MockServerService, ServerRegistry],
  controllers: [MockServerController],
  exports: [MockServerService],
})
export class MockServerModule {}
