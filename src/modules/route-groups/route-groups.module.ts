import { Module } from '@nestjs/common';
import { RouteGroupsController } from './route-groups.controller';
import { RouteGroupsService } from './route-groups.service';
import { DbModule } from '../../db/db.module';

@Module({
  imports: [DbModule],
  controllers: [RouteGroupsController],
  providers: [RouteGroupsService],
  exports: [RouteGroupsService],
})
export class RouteGroupsModule {}