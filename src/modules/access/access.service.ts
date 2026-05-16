import { Injectable, NotFoundException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';

import { InjectDrizzle } from 'src/db/db.decorator';
import type { DrizzleDatabase } from 'src/db/db.type';
import { endpoints, projects, routeGroups } from 'src/db/schema';

@Injectable()
export class AccessService {
  constructor(
    @InjectDrizzle()
    private readonly db: DrizzleDatabase,
  ) {}

  // --------------------------------------------------
  // PROJECT ACCESS
  // --------------------------------------------------

  async assertProjectAccess(projectId: number, userId: number) {
    const project = await this.db.query.projects.findFirst({
      where: and(eq(projects.id, projectId), eq(projects.userId, userId)),
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  // --------------------------------------------------
  // ROUTE GROUP ACCESS
  // --------------------------------------------------

  async assertRouteGroupAccess(routeGroupId: number, userId: number) {
    const routeGroup = await this.db.query.routeGroups.findFirst({
      where: eq(routeGroups.id, routeGroupId),
      with: {
        project: true,
      },
    });

    if (!routeGroup || routeGroup.project.userId !== userId) {
      throw new NotFoundException('Route group not found');
    }

    return routeGroup;
  }

  // --------------------------------------------------
  // ENDPOINT ACCESS
  // --------------------------------------------------

  async assertEndpointAccess(endpointId: number, userId: number) {
    const endpoint = await this.db.query.endpoints.findFirst({
      where: eq(endpoints.id, endpointId),

      with: {
        routeGroup: {
          with: {
            project: true,
          },
        },
      },
    });

    if (!endpoint || endpoint.routeGroup.project.userId !== userId) {
      throw new NotFoundException('Endpoint not found');
    }

    return endpoint;
  }
}
