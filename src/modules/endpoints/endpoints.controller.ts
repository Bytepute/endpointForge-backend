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
import { EndpointsService } from './endpoints.service';

import { CreateEndpointRequestDto } from './dto/create-endpoint-request.dto';
import { UpdateEndpointRequestDto } from './dto/update-endpoint-request.dto';
import { EndpointResponseDto } from './dto/endpoint-response.dto';
import { Throttle } from '@nestjs/throttler';
import { generalThrottleLimit } from 'src/constants/throttle-limit/general-throttle-limit';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserData } from '../auth/interfaces/current-user.interface';
import { Auth } from '../auth/decorators/auth.decorator';

@Auth()
@Controller('endpoints')
export class EndpointsController {
  constructor(private readonly service: EndpointsService) {}

  @Post()
  @Throttle({ default: generalThrottleLimit.post })
  create(
    @Body() dto: CreateEndpointRequestDto,
    @CurrentUser() user: CurrentUserData,
  ): Promise<EndpointResponseDto> {
    return this.service.create(dto, user.userId);
  }

  @Get('route-group/:routeGroupId')
  @Throttle({ default: generalThrottleLimit.get })
  findAll(
    @Param('routeGroupId', ParseIntPipe) routeGroupId: number,
    @CurrentUser() user: CurrentUserData,
  ): Promise<EndpointResponseDto[]> {
    return this.service.findAll(routeGroupId, user.userId);
  }

  @Get(':id')
  @Throttle({ default: generalThrottleLimit.get })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.service.findById(id, user.userId);
  }

  @Patch(':id')
  @Throttle({ default: generalThrottleLimit.patch })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEndpointRequestDto,
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
