import {
  pgTable,
  serial,
  text,
  integer,
  varchar,
  timestamp,
  jsonb,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { pgEnum } from 'drizzle-orm/pg-core';

export const httpMethodEnum = pgEnum('http_method', [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
]);

// Projects Table
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  port: integer('port').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Route Groups Table
export const routeGroups = pgTable('route_groups', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  projectId: integer('project_id')
    .references(() => projects.id, { onDelete: 'cascade' })
    .notNull(),
});

// Endpoints Table
export const endpoints = pgTable('endpoints', {
  id: serial('id').primaryKey(),
  method: httpMethodEnum('method').notNull(), // GET, POST, etc.
  path: varchar('path', { length: 255 }).notNull(),
  statusCode: integer('status_code').default(200).notNull(),
  responseJson: jsonb('response_json').notNull(),
  delayMs: integer('delay_ms').default(0).notNull(),
  routeGroupId: integer('route_group_id')
    .references(() => routeGroups.id, { onDelete: 'cascade' })
    .notNull(),
});

// Relationships (for easy JOINs later)
export const projectRelations = relations(projects, ({ many }) => ({
  routeGroups: many(routeGroups),
}));

export const routeGroupRelations = relations(routeGroups, ({ one, many }) => ({
  project: one(projects, {
    fields: [routeGroups.projectId],
    references: [projects.id],
  }),
  endpoints: many(endpoints),
}));

export const endpointRelations = relations(endpoints, ({ one }) => ({
  routeGroup: one(routeGroups, {
    fields: [endpoints.routeGroupId],
    references: [routeGroups.id],
  }),
}));
