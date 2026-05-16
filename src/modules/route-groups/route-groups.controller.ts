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
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserData } from '../auth/interfaces/current-user.interface';
import { Auth } from '../auth/decorators/auth.decorator';

@Auth()
@Controller('route-groups')
export class RouteGroupsController {
  constructor(private readonly service: RouteGroupsService) {}

  @Post()
  @Throttle({ default: generalThrottleLimit.post })
  create(
    @Body() dto: CreateRouteGroupRequestDto,
    @CurrentUser() user: CurrentUserData,
  ): Promise<RouteGroupResponseDto> {
    return this.service.create(dto, user.userId);
  }

  @Get('project/:projectId')
  @Throttle({ default: generalThrottleLimit.get })
  findAll(
    @Param('projectId', ParseIntPipe) projectId: number,
    @CurrentUser() user: CurrentUserData,
  ): Promise<RouteGroupResponseDto[]> {
    return this.service.findAll(projectId, user.userId);
  }

  @Get(':id')
  @Throttle({ default: generalThrottleLimit.get })
  findById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.service.findById(id, user.userId);
  }

  @Patch(':id')
  @Throttle({ default: generalThrottleLimit.patch })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRouteGroupRequestDto,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.service.update(id, dto, user.userId);
  }

  @Delete(':id')
  @Throttle({ default: generalThrottleLimit.delete })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.service.remove(id, user.userId);
  }
}
