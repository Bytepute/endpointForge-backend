import { PartialType } from '@nestjs/swagger';
import { CreateEndpointRequestDto } from './create-endpoint-request.dto';

export class UpdateEndpointRequestDto extends PartialType(
  CreateEndpointRequestDto,
) {}
