import { Module } from '@nestjs/common';
import { RouteGroupsController } from './route-groups.controller';
import { RouteGroupsService } from './route-groups.service';

@Module({
  controllers: [RouteGroupsController],
  providers: [RouteGroupsService]
})
export class RouteGroupsModule {}
