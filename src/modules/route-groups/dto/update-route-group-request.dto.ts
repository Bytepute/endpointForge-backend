import { PartialType } from '@nestjs/swagger';
import { CreateRouteGroupRequestDto } from './create-route-group-request.dto';

export class UpdateRouteGroupRequestDto extends PartialType(
  CreateRouteGroupRequestDto,
) {}
