import { Injectable } from '@nestjs/common';
import { RuntimeRepository } from './repositories/runtime.repository';

@Injectable()
export class RuntimeResolverService {
  constructor(private readonly repository: RuntimeRepository) {}

  async resolve(params: {
    username: string;
    projectSlug: string;
    routeGroupSlug: string;
    endpointPath: string;
    method: string;
  }) {
    return this.repository.findEndpoint(params);
  }
}
