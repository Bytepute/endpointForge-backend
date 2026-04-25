import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDrizzle } from '../../db/db.decorator';
import type { DrizzleDatabase } from '../../db/db.type';
import { projects } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { plainToInstance } from 'class-transformer';
import { ProjectResponseDto } from './dto/project-response.dto';
import { CreateProjectRequestDto } from './dto/create-project-request.dto';
import { UpdateProjectRequestDto } from './dto/update-project-request.dto';

type ProjectRow = typeof projects.$inferSelect;

@Injectable()
export class ProjectsService {
  constructor(@InjectDrizzle() private readonly db: DrizzleDatabase) {}

  private mapToDto(data: ProjectRow): ProjectResponseDto {
    return plainToInstance<ProjectResponseDto, ProjectRow>(
      ProjectResponseDto,
      data,
      {
        excludeExtraneousValues: true,
      },
    );
  }

  // Changed input type to CreateProjectDto
  async create(data: CreateProjectRequestDto): Promise<ProjectResponseDto> {
    const result = await this.db.insert(projects).values(data).returning();
    return this.mapToDto(result[0]);
  }

  async findAll(): Promise<ProjectResponseDto[]> {
    const rows = await this.db.select().from(projects);
    return rows.map((row) => this.mapToDto(row));
  }

  async findById(id: number): Promise<ProjectResponseDto> {
    const result = await this.db
      .select()
      .from(projects)
      .where(eq(projects.id, id));

    if (!result.length) throw new NotFoundException('Project not found');
    return this.mapToDto(result[0]);
  }

  // Changed input type to UpdateProjectDtoany
  async update(
    id: number,
    data: UpdateProjectRequestDto,
  ): Promise<ProjectResponseDto> {
    const updated = await this.db
      .update(projects)
      .set(data)
      .where(eq(projects.id, id))
      .returning();

    if (!updated.length) throw new NotFoundException('Project not found');
    return this.mapToDto(updated[0]);
  }

  async remove(id: number): Promise<ProjectResponseDto> {
    const deleted = await this.db
      .delete(projects)
      .where(eq(projects.id, id))
      .returning();

    if (!deleted.length) throw new NotFoundException('Project not found');
    return this.mapToDto(deleted[0]);
  }
}
