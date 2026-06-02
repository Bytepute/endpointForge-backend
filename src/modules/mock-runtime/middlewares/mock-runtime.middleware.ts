import { Injectable, NestMiddleware } from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';

import { HostnameParserService } from '../hostname-parser.service';
import { RuntimeResolverService } from '../runtime-resolver.service';
import { ResponseBuilderService } from '../response-builder.service';
import { RouteMatcherService } from '../route-matcher.service';

@Injectable()
export class MockRuntimeMiddleware implements NestMiddleware {
  constructor(
    private readonly hostnameParser: HostnameParserService,
    private readonly routeMatcher: RouteMatcherService,
    private readonly runtimeResolver: RuntimeResolverService,
    private readonly responseBuilder: ResponseBuilderService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { username } = this.hostnameParser.parse(req.hostname);
    if (!username) {
      return next();
    }

    const parsedRoute = this.routeMatcher.parse(req.originalUrl);
    if (!parsedRoute) {
      return next();
    }

    const result = await this.runtimeResolver.resolve({
      username,
      projectSlug: parsedRoute.projectSlug,
      routeGroupSlug: parsedRoute.routeGroupSlug,
      endpointPath: parsedRoute.endpointPath,
      method: req.method,
    });

    if (!result.ok) {
      if (result.reason === 'PROJECT_DISABLED') {
        return res.status(403).json({
          message: 'Project runtime is disabled',
        });
      }

      return res.status(404).json({
        message: 'Mock endpoint not found',
      });
    }

    return this.responseBuilder.send(res, result.endpoint);
  }
}
