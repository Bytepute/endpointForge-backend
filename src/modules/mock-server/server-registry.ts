import { Server } from 'http';

import { Injectable } from '@nestjs/common';
import { Express } from 'express';

export interface ServerRecord {
  app: Express;
  server: Server;
  port: number;
}

@Injectable()
export class ServerRegistry {
  private readonly servers = new Map<number, ServerRecord>();

  get(projectId: number): ServerRecord | undefined {
    return this.servers.get(projectId);
  }

  set(projectId: number, record: ServerRecord): void {
    this.servers.set(projectId, record);
  }

  remove(projectId: number): void {
    this.servers.delete(projectId);
  }
}
