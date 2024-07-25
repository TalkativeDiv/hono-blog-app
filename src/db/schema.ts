import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { generateId } from "lucia";

export const posts = sqliteTable("posts", {
  // on insert this is set automatically in an incremental manner
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),

  // the author of the blog post
  authorId: text("author_id")
    .notNull()
    .references(() => users.id),

  // title of the blog post
  title: text("title", { length: 256 }).notNull(),

  // content of the blog post
  content: text("content").notNull(),

  // similarly, the timestamp is set on insert, however it just simply just the current time
  timestamp: text("timestamp")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
export type InsertPost = typeof posts.$inferInsert;
export type SelectPost = typeof posts.$inferSelect;

export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => generateId(15)),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: integer("expires_at").notNull(),
});
export type InsertSession = typeof sessions.$inferInsert;
export type SelectSession = typeof sessions.$inferSelect;
