import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { DbModule } from '../../db/db.module';
import { AccessModule } from '../access/access.module';

@Module({
  imports: [DbModule, AccessModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
