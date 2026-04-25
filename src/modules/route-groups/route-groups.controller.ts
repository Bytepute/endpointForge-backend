// src/modules/route-groups/route-groups.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { RouteGroupsService } from './route-groups.service';
import { CreateRouteGroupRequestDto } from './dto/create-route-group-request.dto';
import { UpdateRouteGroupRequestDto } from './dto/update-route-group-request.dto';
import { RouteGroupResponseDto } from './dto/route-group-response.dto';

@Controller('route-groups')
export class RouteGroupsController {
  constructor(private readonly service: RouteGroupsService) {}

  @Post()
  create(
    @Body() dto: CreateRouteGroupRequestDto,
  ): Promise<RouteGroupResponseDto> {
    return this.service.create(dto);
  }

  @Get('project/:projectId')
  findAll(
    @Param('projectId', ParseIntPipe) projectId: number,
  ): Promise<RouteGroupResponseDto[]> {
    return this.service.findAll(projectId);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRouteGroupRequestDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
