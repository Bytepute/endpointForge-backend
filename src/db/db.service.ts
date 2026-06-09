import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

@Injectable()
export class DbService {
  public db;

  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    this.db = drizzle(pool, { schema });
  }
}
