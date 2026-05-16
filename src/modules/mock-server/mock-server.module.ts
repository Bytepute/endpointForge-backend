import { Module } from '@nestjs/common';
import { MockServerService } from './mock-server.service';
import { MockServerController } from './mock-server.controller';
import { ServerRegistry } from './server-registry';
import { DbModule } from '../../db/db.module';
import { AccessModule } from '../access/access.module';

@Module({
  imports: [DbModule, AccessModule],
  providers: [MockServerService, ServerRegistry],
  controllers: [MockServerController],
  exports: [MockServerService, ServerRegistry],
})
export class MockServerModule {}
