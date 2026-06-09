// src/db/db.type.ts
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema'; // <-- Import your schema

// Now Drizzle knows exactly what tables and relations exist!
export type DrizzleDatabase = NodePgDatabase<typeof schema>;
