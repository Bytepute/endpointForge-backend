import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { eq, and } from 'drizzle-orm';

import { InjectDrizzle } from '../../db/db.decorator';
import type { DrizzleDatabase } from '../../db/db.type';
import { projects } from '../../db/schema';

@Injectable()
export class MockRuntimeService {
  constructor(@InjectDrizzle() private readonly db: DrizzleDatabase) {}

  async startServer(projectId: number, userId: number) {
    // update only if the project belongs to this user
    const updated = await this.db
      .update(projects)
      .set({ isRuntimeEnabled: true })
      .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
      .returning({
        id: projects.id,
        isRuntimeEnabled: projects.isRuntimeEnabled,
      });

    if (updated.length === 0) {
      const exists = await this.db.query.projects.findFirst({
        where: eq(projects.id, projectId),
        columns: { id: true, userId: true },
      });

      if (!exists) throw new NotFoundException('Project not found');
      throw new ForbiddenException('You do not own this project');
    }

    return {
      projectId: updated[0].id,
      isRuntimeEnabled: updated[0].isRuntimeEnabled,
      status: 'started',
    };
  }

  async stopServer(projectId: number, userId: number) {
    const updated = await this.db
      .update(projects)
      .set({ isRuntimeEnabled: false })
      .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
      .returning({
        id: projects.id,
        isRuntimeEnabled: projects.isRuntimeEnabled,
      });

    if (updated.length === 0) {
      const exists = await this.db.query.projects.findFirst({
        where: eq(projects.id, projectId),
        columns: { id: true, userId: true },
      });

      if (!exists) throw new NotFoundException('Project not found');
      throw new ForbiddenException('You do not own this project');
    }

    return {
      projectId: updated[0].id,
      isRuntimeEnabled: updated[0].isRuntimeEnabled,
      status: 'stopped',
    };
  }
}
