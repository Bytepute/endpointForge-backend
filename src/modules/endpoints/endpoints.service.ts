import { Injectable } from '@nestjs/common';
import { InjectDrizzle } from '../../db/db.decorator';
import type { DrizzleDatabase } from '../../db/db.type';
import { endpoints } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { plainToInstance } from 'class-transformer';

import { CreateEndpointRequestDto } from './dto/create-endpoint-request.dto';
import { UpdateEndpointRequestDto } from './dto/update-endpoint-request.dto';
import { EndpointResponseDto } from './dto/endpoint-response.dto';
import { AccessService } from '../access/access.service';

type EndpointRow = typeof endpoints.$inferSelect;

@Injectable()
export class EndpointsService {
  constructor(
    @InjectDrizzle() private readonly db: DrizzleDatabase,
    private readonly accessService: AccessService,
  ) {}

  private toDto(row: EndpointRow): EndpointResponseDto {
    return plainToInstance(EndpointResponseDto, row, {
      excludeExtraneousValues: true,
    });
  }

  async create(
    data: CreateEndpointRequestDto,
    userId: number,
  ): Promise<EndpointResponseDto> {
    await this.accessService.assertRouteGroupAccess(data.routeGroupId, userId);
    const [endpoint] = await this.db.insert(endpoints).values(data).returning();
    return this.toDto(endpoint);
  }

  async findAll(
    routeGroupId: number,
    userId: number,
  ): Promise<EndpointResponseDto[]> {
    await this.accessService.assertRouteGroupAccess(routeGroupId, userId);
    const rows = await this.db.query.endpoints.findMany({
      where: eq(endpoints.routeGroupId, routeGroupId),
    });

    return rows.map((row) => this.toDto(row));
  }

  async findById(id: number, userId: number): Promise<EndpointResponseDto> {
    const endpoint = await this.accessService.assertEndpointAccess(id, userId);

    return this.toDto(endpoint);
  }

  async update(
    id: number,
    dto: UpdateEndpointRequestDto,
    userId: number,
  ): Promise<EndpointResponseDto> {
    const endpoint = await this.accessService.assertEndpointAccess(id, userId);

    const [updatedEndpoint] = await this.db
      .update(endpoints)
      .set({
        ...dto,
        updatedAt: new Date(),
      })
      .where(eq(endpoints.id, endpoint.id))
      .returning();
    return this.toDto(updatedEndpoint);
  }

  async remove(id: number, userId: number): Promise<EndpointResponseDto> {
    await this.accessService.assertEndpointAccess(id, userId);

    const [deletedEndpoint] = await this.db
      .delete(endpoints)
      .where(eq(endpoints.id, id))
      .returning();

    return this.toDto(deletedEndpoint);
  }
}
