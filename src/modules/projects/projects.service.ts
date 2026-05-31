import { Injectable } from '@nestjs/common';
import { InjectDrizzle } from '../../db/db.decorator';
import type { DrizzleDatabase } from '../../db/db.type';
import { projects } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { plainToInstance } from 'class-transformer';
import { ProjectResponseDto } from './dto/project-response.dto';
import { CreateProjectRequestDto } from './dto/create-project-request.dto';
import { UpdateProjectRequestDto } from './dto/update-project-request.dto';
import { AccessService } from '../access/access.service';

type ProjectRow = typeof projects.$inferSelect;

@Injectable()
export class ProjectsService {
  constructor(
    @InjectDrizzle() private readonly db: DrizzleDatabase,
    private readonly accessService: AccessService,
  ) {}

  private mapToDto(data: ProjectRow): ProjectResponseDto {
    const dto = plainToInstance(ProjectResponseDto, data, {
      excludeExtraneousValues: true,
    });

    return dto;
  }

  async create(
    data: CreateProjectRequestDto,
    userId: number,
  ): Promise<ProjectResponseDto> {
    const [project] = await this.db
      .insert(projects)
      .values({ ...data, userId })
      .returning();
    return this.mapToDto(project);
  }

  async findAll(userId: number): Promise<ProjectResponseDto[]> {
    const rows = await this.db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId));
    return rows.map((row) => this.mapToDto(row));
  }

  async findById(id: number, userId: number): Promise<ProjectResponseDto> {
    const project = await this.accessService.assertProjectAccess(id, userId);
    return this.mapToDto(project);
  }

  async update(
    id: number,
    data: UpdateProjectRequestDto,
    userId: number,
  ): Promise<ProjectResponseDto> {
    await this.accessService.assertProjectAccess(id, userId);

    const [updatedProject] = await this.db
      .update(projects)
      .set(data)
      .where(eq(projects.id, id))
      .returning();

    return this.mapToDto(updatedProject);
  }

  async remove(id: number, userId: number): Promise<ProjectResponseDto> {
    await this.accessService.assertProjectAccess(id, userId);

    const [deletedProject] = await this.db
      .delete(projects)
      .where(eq(projects.id, id))
      .returning();

    return this.mapToDto(deletedProject);
  }
}
