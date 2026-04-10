import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectsModule } from './modules/projects/projects.module';
import { MockServerModule } from './mock-server/mock-server.module';
import { EndpointsModule } from './modules/endpoints/endpoints.module';
import { RouteGroupsModule } from './modules/route-groups/route-groups.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [
    DbModule,
    ProjectsModule,
    EndpointsModule,
    RouteGroupsModule,
    MockServerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
