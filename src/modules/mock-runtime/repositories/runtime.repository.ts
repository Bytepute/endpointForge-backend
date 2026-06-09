import { Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { InjectDrizzle } from '../../../db/db.decorator';
import type { DrizzleDatabase } from '../../../db/db.type';
import { users, projects, routeGroups, endpoints } from '../../../db/schema';

export type RuntimeResolveResult =
  | {
      ok: true;
      endpoint: {
        endpointId: number;
        statusCode: number;
        delay: number;
        responseBody: unknown;
      };
    }
  | { ok: false; reason: 'PROJECT_DISABLED' | 'NOT_FOUND' };

@Injectable()
export class RuntimeRepository {
  constructor(@InjectDrizzle() private readonly db: DrizzleDatabase) {}

  async findEndpoint(params: {
    username: string;
    projectSlug: string;
    routeGroupSlug: string;
    endpointPath: string;
    method: string;
  }): Promise<RuntimeResolveResult> {
    const rows = await this.db
      .select({
        isRuntimeEnabled: projects.isRuntimeEnabled,

        endpointId: endpoints.id,
        statusCode: endpoints.statusCode,
        delay: endpoints.delay,
        responseBody: endpoints.responseBody,
      })
      .from(users)
      .innerJoin(projects, eq(projects.userId, users.id))

      // keep these as LEFT JOIN so we can still get a row even if endpoint doesn't match
      .leftJoin(
        routeGroups,
        and(
          eq(routeGroups.projectId, projects.id),
          eq(routeGroups.slug, params.routeGroupSlug),
        ),
      )
      .leftJoin(
        endpoints,
        and(
          eq(endpoints.routeGroupId, routeGroups.id),
          eq(endpoints.path, params.endpointPath),
          eq(endpoints.method, params.method as any),
        ),
      )
      .where(
        and(
          eq(users.userName, params.username),
          eq(projects.slug, params.projectSlug),
        ),
      )
      .limit(1);

    const row = rows[0];
    // No user+project match at all
    if (!row) return { ok: false, reason: 'NOT_FOUND' };

    // Project exists but disabled => explicit error
    if (row.isRuntimeEnabled === false) {
      return { ok: false, reason: 'PROJECT_DISABLED' };
    }

    // Enabled but endpoint didn't match
    if (!row.endpointId) {
      return { ok: false, reason: 'NOT_FOUND' };
    }

    return {
      ok: true,
      endpoint: {
        endpointId: row.endpointId,
        statusCode: row.statusCode!,
        delay: row.delay!,
        responseBody: row.responseBody!,
      },
    };
  }
}
