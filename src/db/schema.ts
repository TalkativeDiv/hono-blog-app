import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const posts = sqliteTable("posts", {
  // on insert this is set automatically in an incremental manner
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),

  // title of the blog post
  title: text("title", { length: 256 }).notNull(),

  // content of the blog post
  content: text("content", { length: 256 }).notNull(),

  // similarly, the timestamp is set on insert, however it just simply just the current time
  timestamp: text("timestamp")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
export type InsertPost = typeof posts.$inferInsert;
export type SelectPost = typeof posts.$inferSelect;
