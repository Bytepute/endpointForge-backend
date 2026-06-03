import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HostnameParserService } from './hostname-parser.service';
import { RuntimeResolverService } from './runtime-resolver.service';
import { ResponseBuilderService } from './response-builder.service';
import { RouteMatcherService } from './route-matcher.service';
import { MockRuntimeMiddleware } from './middlewares/mock-runtime.middleware';
import { RuntimeRepository } from './repositories/runtime.repository';
import { MockRuntimeController } from './mock-runtime.controller';
import { MockRuntimeService } from './mock-runtime.service';
import { DbModule } from '../../db/db.module';

@Module({
  imports: [DbModule],
  providers: [
    MockRuntimeMiddleware,
    HostnameParserService,
    RouteMatcherService,
    RuntimeResolverService,
    ResponseBuilderService,
    RuntimeRepository,
    MockRuntimeService,
  ],
  controllers: [MockRuntimeController],
})
export class MockRuntimeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MockRuntimeMiddleware)
      .exclude(
        'docs/(.*)',
        'auth/(.*)',
        'users/(.*)',
        'projects/(.*)',
        'route-groups/(.*)',
        'endpoints/(.*)',
        'mock/(.*)',
      )
      .forRoutes('*');
  }
}
