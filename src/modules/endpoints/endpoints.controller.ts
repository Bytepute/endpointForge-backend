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

@Controller('endpoints')
export class EndpointsController {
  constructor(private readonly service: EndpointsService) {}

  @Post()
  @Throttle({ default: generalThrottleLimit.post })
  create(@Body() dto: CreateEndpointRequestDto): Promise<EndpointResponseDto> {
    return this.service.create(dto);
  }

  @Get('route-group/:routeGroupId')
  @Throttle({ default: generalThrottleLimit.get })
  findAll(
    @Param('routeGroupId', ParseIntPipe) routeGroupId: number,
  ): Promise<EndpointResponseDto[]> {
    return this.service.findAll(routeGroupId);
  }

  @Get(':id')
  @Throttle({ default: generalThrottleLimit.get })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Patch(':id')
  @Throttle({ default: generalThrottleLimit.patch })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEndpointRequestDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Throttle({ default: generalThrottleLimit.delete })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
