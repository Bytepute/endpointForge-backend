import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
  text,
  uniqueIndex,
  boolean,
  unique,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const httpMethodEnum = pgEnum('http_method', [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
]);

// User
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  userName: varchar('user_name', { length: 15 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  tokenVersion: integer('token_version').default(0).notNull(),
});

// Projects Table
export const projects = pgTable(
  'projects',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 100 }).notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    isRuntimeEnabled: boolean('is_runtime_enabled').notNull().default(true),
  },
  (table) => [
    unique('projects_user_name_unique').on(table.userId, table.name),
    unique('projects_user_slug_unique').on(table.userId, table.slug),
  ],
);

// Route Groups Table
export const routeGroups = pgTable(
  'route_groups',
  {
    id: serial('id').primaryKey(),

    projectId: integer('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),

    name: varchar('name', { length: 255 }),

    slug: varchar('slug', { length: 100 }).notNull(),

    description: text('description'),

    createdAt: timestamp('created_at').defaultNow(),

    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    unique('route_groups_project_name_unique').on(table.projectId, table.name),
    unique('route_groups_project_slug_unique').on(table.projectId, table.slug),
  ],
);
// Endpoints Table
export const endpoints = pgTable(
  'endpoints',
  {
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
  },
  (table) => ({
    routeMethodPathUnique: uniqueIndex('endpoints_route_method_path_unique').on(
      table.routeGroupId,
      table.method,
      table.path,
    ),
  }),
);
// Relationships (for easy JOINs later

export const userRelations = relations(users, ({ many }) => ({
  projects: many(projects),
}));

export const projectRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
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
