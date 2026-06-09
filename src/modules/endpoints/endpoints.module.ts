import { Module } from '@nestjs/common';
import { EndpointsController } from './endpoints.controller';
import { EndpointsService } from './endpoints.service';
import { DbModule } from '../../db/db.module';
import { AccessModule } from '../access/access.module';

@Module({
  imports: [DbModule, AccessModule],
  controllers: [EndpointsController],
  providers: [EndpointsService],
  exports: [EndpointsService],
})
export class EndpointsModule {}
