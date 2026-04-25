import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDrizzle } from '../../db/db.decorator';
import type { DrizzleDatabase } from '../../db/db.type';
import { routeGroups } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { plainToInstance } from 'class-transformer';

import { RouteGroupResponseDto } from './dto/route-group-response.dto';
import { CreateRouteGroupRequestDto } from './dto/create-route-group-request.dto';
import { UpdateRouteGroupRequestDto } from './dto/update-route-group-request.dto';

type RouteGroupRow = typeof routeGroups.$inferSelect;

@Injectable()
export class RouteGroupsService {
  constructor(@InjectDrizzle() private readonly db: DrizzleDatabase) {}

  private toDto(row: RouteGroupRow): RouteGroupResponseDto {
    return plainToInstance(RouteGroupResponseDto, row, {
      excludeExtraneousValues: true,
    });
  }

  async create(
    data: CreateRouteGroupRequestDto,
  ): Promise<RouteGroupResponseDto> {
    const result = await this.db.insert(routeGroups).values(data).returning();
    return this.toDto(result[0]);
  }

  async findAll(projectId: number): Promise<RouteGroupResponseDto[]> {
    const rows = await this.db
      .select()
      .from(routeGroups)
      .where(eq(routeGroups.projectId, projectId));

    return rows.map((r) => this.toDto(r));
  }

  async findById(id: number): Promise<RouteGroupResponseDto> {
    const rows = await this.db
      .select()
      .from(routeGroups)
      .where(eq(routeGroups.id, id));

    if (!rows.length) throw new NotFoundException('Route group not found');
    return this.toDto(rows[0]);
  }

  async update(
    id: number,
    data: UpdateRouteGroupRequestDto,
  ): Promise<RouteGroupResponseDto> {
    const rows = await this.db
      .update(routeGroups)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(routeGroups.id, id))
      .returning();

    if (!rows.length) throw new NotFoundException('Route group not found');
    return this.toDto(rows[0]);
  }

  async remove(id: number): Promise<RouteGroupResponseDto> {
    const rows = await this.db
      .delete(routeGroups)
      .where(eq(routeGroups.id, id))
      .returning();

    if (!rows.length) throw new NotFoundException('Route group not found');
    return this.toDto(rows[0]);
  }
}
