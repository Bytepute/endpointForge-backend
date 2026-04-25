import { Injectable, Logger } from '@nestjs/common';
import express, { Express, RequestHandler } from 'express';
import { Server } from 'http';
import { ServerRegistry } from './server-registry';
import { InjectDrizzle } from '../../db/db.decorator';
import type { DrizzleDatabase } from '../../db/db.type';
import { eq } from 'drizzle-orm';
import { projects, routeGroups } from '../../db/schema';
import { resolveResponseBody } from '../../faker/response-resolver';

@Injectable()
export class MockServerService {
  private readonly logger = new Logger(MockServerService.name);

  constructor(
    @InjectDrizzle() private readonly db: DrizzleDatabase,
    private readonly registry: ServerRegistry,
  ) {}

  private addRoute(
    app: Express,
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    path: string,
    handler: RequestHandler,
  ) {
    switch (method) {
      case 'get':
        return app.get(path, handler);
      case 'post':
        return app.post(path, handler);
      case 'put':
        return app.put(path, handler);
      case 'patch':
        return app.patch(path, handler);
      case 'delete':
        return app.delete(path, handler);
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }

  private async loadRoutes(app: Express, projectId: number) {
    // 1. Load all groups with endpoints
    const groups = await this.db.query.routeGroups.findMany({
      where: eq(routeGroups.projectId, projectId),
      with: {
        endpoints: true,
      },
    });

    // Map your enum method (uppercase) to Express method (lowercase)
    const methodMap = {
      GET: 'get',
      POST: 'post',
      PUT: 'put',
      PATCH: 'patch',
      DELETE: 'delete',
    } as const;

    for (const group of groups) {
      for (const endpoint of group.endpoints) {
        const method = methodMap[endpoint.method];
        if (!method) {
          console.error(`Unsupported HTTP method: ${endpoint.method}`);
          continue;
        }

        const groupPrefix = group.prefix.startsWith('/')
          ? group.prefix
          : `/${group.prefix}`;

        const endpointPath = endpoint.path.startsWith('/')
          ? endpoint.path
          : `/${endpoint.path}`;

        const fullPath = `${groupPrefix}${endpointPath}`;

        const status = endpoint.statusCode ?? 200;
        const body = resolveResponseBody(endpoint.responseBody);
        const delay = endpoint.delay ?? 0;

        this.addRoute(app, method, fullPath, async (req, res) => {
          if (delay > 0) {
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
          res.status(status).json(body);
        });

        console.log(`Mounted route: [${endpoint.method}] ${fullPath}`);
      }
    }
  }

  async startServer(projectId: number) {
    if (this.registry.get(projectId)) {
      return { message: 'Server already running' };
    }

    const project = await this.db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!project) throw new Error('Project not found');

    const port = project.port || 3000;

    const app = express();
    app.use(express.json());

    // Load routes dynamically
    await this.loadRoutes(app, projectId);

    const server = await new Promise<Server>((resolve) => {
      const s = app.listen(port, () => resolve(s));
    });

    this.registry.set(projectId, { app, server, port });

    return { message: `Mock server started on port ${port}` };
  }

  async stopServer(projectId: number) {
    const record = this.registry.get(projectId);

    if (!record) {
      return {
        projectId,
        status: 'not_running',
      };
    }

    await new Promise<void>((resolve) => {
      record.server.close(() => resolve());
    });

    this.registry.remove(projectId);

    this.logger.log(`Mock server for project ${projectId} stopped`);

    return {
      projectId,
      status: 'stopped',
    };
  }
}
