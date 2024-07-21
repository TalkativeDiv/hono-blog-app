import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { posts } from "./db/schema";
import type { Env } from "./bindings";

const app = new Hono<{ Bindings: Env }>();

app.get("/posts", async (c) => {
  const db = drizzle(c.env.DB);
  const result = await db.select().from(posts).all();
  return c.json(result);
}).post("/posts", async (c) => {
  const db = drizzle(c.env.DB);
  const { title, content } = await c.req.json();
  const result = await db.insert(posts).values({ title, content }).returning();
  return c.json(result);
});

export default app;
