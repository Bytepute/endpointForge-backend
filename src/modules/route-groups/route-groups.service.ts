import { Injectable } from '@nestjs/common';
import { InjectDrizzle } from '../../db/db.decorator';
import type { DrizzleDatabase } from '../../db/db.type';
import { routeGroups } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { plainToInstance } from 'class-transformer';

import { RouteGroupResponseDto } from './dto/route-group-response.dto';
import { CreateRouteGroupRequestDto } from './dto/create-route-group-request.dto';
import { UpdateRouteGroupRequestDto } from './dto/update-route-group-request.dto';
import { AccessService } from '../access/access.service';

type RouteGroupRow = typeof routeGroups.$inferSelect;

@Injectable()
export class RouteGroupsService {
  constructor(
    @InjectDrizzle() private readonly db: DrizzleDatabase,
    private readonly accessService: AccessService,
  ) {}

  private toDto(row: RouteGroupRow): RouteGroupResponseDto {
    return plainToInstance(RouteGroupResponseDto, row, {
      excludeExtraneousValues: true,
    });
  }

  async create(
    data: CreateRouteGroupRequestDto,
    userId: number,
  ): Promise<RouteGroupResponseDto> {
    await this.accessService.assertProjectAccess(data.projectId, userId);

    const [routeGroup] = await this.db
      .insert(routeGroups)
      .values(data)
      .returning();

    return this.toDto(routeGroup);
  }

  async findAll(
    projectId: number,
    userId: number,
  ): Promise<RouteGroupResponseDto[]> {
    await this.accessService.assertProjectAccess(projectId, userId);

    const rows = await this.db.query.routeGroups.findMany({
      where: eq(routeGroups.projectId, projectId),
    });

    return rows.map((row) => this.toDto(row));
  }

  async findById(id: number, userId: number): Promise<RouteGroupResponseDto> {
    const routeGroup = await this.accessService.assertRouteGroupAccess(
      id,
      userId,
    );

    return this.toDto(routeGroup);
  }

  async update(
    id: number,
    data: UpdateRouteGroupRequestDto,
    userId: number,
  ): Promise<RouteGroupResponseDto> {
    await this.accessService.assertRouteGroupAccess(id, userId);
    const [updatedRouteGroup] = await this.db
      .update(routeGroups)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(routeGroups.id, id))
      .returning();

    return this.toDto(updatedRouteGroup);
  }

  async remove(id: number, userId: number): Promise<RouteGroupResponseDto> {
    await this.accessService.assertRouteGroupAccess(id, userId);
    const [deletedRouteGroup] = await this.db
      .delete(routeGroups)
      .where(eq(routeGroups.id, id))
      .returning();

    return this.toDto(deletedRouteGroup);
  }
}
