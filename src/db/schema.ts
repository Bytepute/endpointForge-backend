import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
  text,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

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
  description: text('description'),
  port: integer('port').unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Route Groups Table
export const routeGroups = pgTable('route_groups', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),

  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  prefix: text('prefix').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Endpoints Table
export const endpoints = pgTable('endpoints', {
  id: serial('id').primaryKey(),

  routeGroupId: integer('route_group_id')
    .notNull()
    .references(() => routeGroups.id, { onDelete: 'cascade' }),

  method: httpMethodEnum('method').notNull(),
  path: varchar('path', { length: 255 }).notNull(),

  statusCode: integer('status_code').default(200).notNull(),
  delay: integer('delay').default(0).notNull(), // milliseconds

  responseBody: jsonb('response_body').notNull().default({}),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
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

export const endpointsRelations = relations(endpoints, ({ one }) => ({
  routeGroup: one(routeGroups, {
    fields: [endpoints.routeGroupId],
    references: [routeGroups.id],
  }),
}));
