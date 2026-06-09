import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDrizzle } from '../../db/db.decorator';
import type { DrizzleDatabase } from '../../db/db.type';
import { endpoints, projects, routeGroups, users } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { plainToInstance } from 'class-transformer';

import { CreateEndpointRequestDto } from './dto/create-endpoint-request.dto';
import { UpdateEndpointRequestDto } from './dto/update-endpoint-request.dto';
import { EndpointResponseDto } from './dto/endpoint-response.dto';
import { AccessService } from '../access/access.service';
import { ConfigService } from '@nestjs/config';

interface EndpointWithUrlContext {
  endpoint: typeof endpoints.$inferSelect;
  userName: string;
  projectSlug: string;
  routeGroupSlug: string;
}

@Injectable()
export class EndpointsService {
  constructor(
    @InjectDrizzle() private readonly db: DrizzleDatabase,
    private readonly accessService: AccessService,
    private readonly configService: ConfigService,
  ) {}

  private mapToDto(row: EndpointWithUrlContext): EndpointResponseDto {
    const protocol = this.configService.get<string>('APP_PROTOCOL', 'http');
    const rootDomain = this.configService.get<string>('APP_ROOT_DOMAIN');

    if (!rootDomain) {
      throw new Error('APP_ROOT_DOMAIN is not defined in environment');
    }

    // Ensure path doesn't have leading slash for the builder
    const cleanPath = row.endpoint.path.replace(/^\/+/, '');

    const endpointFullUrl = `${protocol}://${row.userName}.${rootDomain}/${row.projectSlug}/${row.routeGroupSlug}/${cleanPath}`;

    return plainToInstance(
      EndpointResponseDto,
      {
        ...row.endpoint,
        endpointFullUrl,
      },
      { excludeExtraneousValues: true },
    );
  }

  private async fetchWithContext(
    endpointId: number,
  ): Promise<EndpointWithUrlContext> {
    const [result] = await this.db
      .select({
        endpoint: endpoints,
        userName: users.userName,
        projectSlug: projects.slug,
        routeGroupSlug: routeGroups.slug,
      })
      .from(endpoints)
      .innerJoin(routeGroups, eq(endpoints.routeGroupId, routeGroups.id))
      .innerJoin(projects, eq(routeGroups.projectId, projects.id))
      .innerJoin(users, eq(projects.userId, users.id))
      .where(eq(endpoints.id, endpointId))
      .limit(1);

    if (!result) throw new NotFoundException('Endpoint not found');
    return result;
  }

  async create(
    data: CreateEndpointRequestDto,
    userId: number,
  ): Promise<EndpointResponseDto> {
    await this.accessService.assertRouteGroupAccess(data.routeGroupId, userId);
    const [inserted] = await this.db.insert(endpoints).values(data).returning();
    const context = await this.fetchWithContext(inserted.id);
    return this.mapToDto(context);
  }

  async findAll(
    routeGroupId: number,
    userId: number,
  ): Promise<EndpointResponseDto[]> {
    await this.accessService.assertRouteGroupAccess(routeGroupId, userId);
    const rows = await this.db
      .select({
        endpoint: endpoints,
        userName: users.userName,
        projectSlug: projects.slug,
        routeGroupSlug: routeGroups.slug,
      })
      .from(endpoints)
      .innerJoin(routeGroups, eq(endpoints.routeGroupId, routeGroups.id))
      .innerJoin(projects, eq(routeGroups.projectId, projects.id))
      .innerJoin(users, eq(projects.userId, users.id))
      .where(eq(endpoints.routeGroupId, routeGroupId));

    return rows.map((row) => this.mapToDto(row));
  }

  async findById(id: number, userId: number): Promise<EndpointResponseDto> {
    await this.accessService.assertEndpointAccess(id, userId);
    const context = await this.fetchWithContext(id);
    return this.mapToDto(context);
  }

  async update(
    id: number,
    dto: UpdateEndpointRequestDto,
    userId: number,
  ): Promise<EndpointResponseDto> {
    await this.accessService.assertEndpointAccess(id, userId);
    await this.db
      .update(endpoints)
      .set({ ...dto, updatedAt: new Date() })
      .where(eq(endpoints.id, id));

    const context = await this.fetchWithContext(id);
    return this.mapToDto(context);
  }

  async remove(id: number, userId: number): Promise<EndpointResponseDto> {
    await this.accessService.assertEndpointAccess(id, userId);
    const context = await this.fetchWithContext(id);
    await this.db.delete(endpoints).where(eq(endpoints.id, id));
    return this.mapToDto(context);
  }
}
