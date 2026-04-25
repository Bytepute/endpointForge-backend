import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDrizzle } from '../../db/db.decorator';
import type { DrizzleDatabase } from '../../db/db.type';
import { endpoints } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { plainToInstance } from 'class-transformer';

import { CreateEndpointRequestDto } from './dto/create-endpoint-request.dto';
import { UpdateEndpointRequestDto } from './dto/update-endpoint-request.dto';
import { EndpointResponseDto } from './dto/endpoint-response.dto';

type EndpointRow = typeof endpoints.$inferSelect;

@Injectable()
export class EndpointsService {
  constructor(@InjectDrizzle() private readonly db: DrizzleDatabase) {}

  private toDto(row: EndpointRow): EndpointResponseDto {
    return plainToInstance(EndpointResponseDto, row, {
      excludeExtraneousValues: true,
    });
  }

  async create(data: CreateEndpointRequestDto): Promise<EndpointResponseDto> {
    const result = await this.db.insert(endpoints).values(data).returning();
    return this.toDto(result[0]);
  }

  async findAll(routeGroupId: number): Promise<EndpointResponseDto[]> {
    const rows = await this.db
      .select()
      .from(endpoints)
      .where(eq(endpoints.routeGroupId, routeGroupId));

    return rows.map((r) => this.toDto(r));
  }

  async findById(id: number): Promise<EndpointResponseDto> {
    const rows = await this.db
      .select()
      .from(endpoints)
      .where(eq(endpoints.id, id));

    if (!rows.length) throw new NotFoundException('Endpoint not found');
    return this.toDto(rows[0]);
  }

  async update(
    id: number,
    dto: UpdateEndpointRequestDto,
  ): Promise<EndpointResponseDto> {
    const rows = await this.db
      .update(endpoints)
      .set({ ...dto, updatedAt: new Date() })
      .where(eq(endpoints.id, id))
      .returning();

    if (!rows.length) throw new NotFoundException('Endpoint not found');
    return this.toDto(rows[0]);
  }

  async remove(id: number): Promise<EndpointResponseDto> {
    const rows = await this.db
      .delete(endpoints)
      .where(eq(endpoints.id, id))
      .returning();

    if (!rows.length) throw new NotFoundException('Endpoint not found');
    return this.toDto(rows[0]);
  }
}
