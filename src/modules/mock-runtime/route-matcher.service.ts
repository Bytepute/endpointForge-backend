import { Injectable } from '@nestjs/common';

export interface ParsedRoute {
  projectSlug: string;
  routeGroupSlug: string;
  endpointPath: string;
}

@Injectable()
export class RouteMatcherService {
  parse(path: string): ParsedRoute | null {
    const segments = path.split('/').filter(Boolean);

    if (segments.length < 3) {
      return null;
    }

    const [projectSlug, routeGroupSlug, ...endpointParts] = segments;

    return {
      projectSlug,
      routeGroupSlug,
      endpointPath: endpointParts.join('/'),
    };
  }
}
