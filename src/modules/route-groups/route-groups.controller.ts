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
import { Throttle } from '@nestjs/throttler';
import { generalThrottleLimit } from 'src/constants/throttle-limit/general-throttle-limit';

@Controller('route-groups')
export class RouteGroupsController {
  constructor(private readonly service: RouteGroupsService) {}

  @Post()
  @Throttle({ default: generalThrottleLimit.post })
  create(
    @Body() dto: CreateRouteGroupRequestDto,
  ): Promise<RouteGroupResponseDto> {
    return this.service.create(dto);
  }

  @Get('project/:projectId')
  @Throttle({ default: generalThrottleLimit.get })
  findAll(
    @Param('projectId', ParseIntPipe) projectId: number,
  ): Promise<RouteGroupResponseDto[]> {
    return this.service.findAll(projectId);
  }

  @Get(':id')
  @Throttle({ default: generalThrottleLimit.get })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Patch(':id')
  @Throttle({ default: generalThrottleLimit.patch })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRouteGroupRequestDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Throttle({ default: generalThrottleLimit.delete })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
