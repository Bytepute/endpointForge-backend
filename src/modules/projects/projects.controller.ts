import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectRequestDto } from './dto/create-project-request.dto';
import { UpdateProjectRequestDto } from './dto/update-project-request.dto';
import { ProjectResponseDto } from './dto/project-response.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserData } from '../auth/interfaces/current-user.interface';
import { Auth } from '../auth/decorators/auth.decorator';
import { Throttle } from '@nestjs/throttler';
import { generalThrottleLimit } from 'src/constants/throttle-limit/general-throttle-limit';

@Auth()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Throttle({ default: generalThrottleLimit.post })
  create(
    @Body() createProjectDto: CreateProjectRequestDto,
    @CurrentUser() user: CurrentUserData,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.create(createProjectDto, user.userId);
  }

  @Get()
  @Throttle({ default: generalThrottleLimit.get })
  findAll(@CurrentUser() user: CurrentUserData): Promise<ProjectResponseDto[]> {
    return this.projectsService.findAll(user.userId);
  }

  @Get(':id')
  @Throttle({ default: generalThrottleLimit.get })
  findById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserData,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.findById(id, user.userId);
  }

  @Patch(':id')
  @Throttle({ default: generalThrottleLimit.patch })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectRequestDto,
    @CurrentUser() user: CurrentUserData,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.update(id, updateProjectDto, user.userId);
  }

  @Delete(':id')
  @Throttle({ default: generalThrottleLimit.delete })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserData,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.remove(id, user.userId);
  }
}
