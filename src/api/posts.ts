import { zValidator } from "@hono/zod-validator";
import { drizzle } from "drizzle-orm/d1";
import { Context, Hono } from "hono";
import { z } from "zod";

import { Env, Variables } from "../bindings";
import {
  deletePost,
  getAllPosts,
  getPosts,
  getSinglePost,
  insertPost,
  updatePost,
} from "../db/actions/posts";
import { SelectPost } from "../db/schema";

const postsRouter = new Hono<{ Bindings: Env; Variables: Variables }>();

postsRouter.post(
  "/",
  zValidator(
    "json",
    z.object({
      title: z.string().min(5).max(255),
      content: z.string().min(10).max(255),
    })
  ),
  async (c) => {
    const db = drizzle(c.env.DB);
    const user = c.get("user");
    const { title, content } = c.req.valid("json");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const results = await insertPost(db, { title, content, authorId: user.id });

    return c.json(results);
  }
);

postsRouter.get("/all", async (c) => {
  const db = drizzle(c.env.DB);

  const results: SelectPost[] = await getAllPosts(db);

  return c.json(results);
});

postsRouter.get("/", async (c: Context) => {
  const db = drizzle(c.env.DB);
  const user = c.get("user");
  if (!user) {
    return c.redirect("/posts/all");
  }
  const results: SelectPost[] = await getPosts(db, user.id);

  return c.json(results);
});
postsRouter.get("/:id", async (c: Context) => {
  const db = drizzle(c.env.DB);
  const id = c.req.param("id");

  const results: SelectPost[] = await getSinglePost(db, Number(id));

  return c.json(results);
});

postsRouter.patch("/edit/:id", async (c) => {
  const { content, title } = await c.req.parseBody();
  const db = drizzle(c.env.DB);
  const user = c.get("user");
  const id = c.req.param("id");
  const post = await getSinglePost(db, Number(id));
  if (!user || post[0].authorId !== user.id) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const results = await updatePost(
    db,
    Number(id),
    title as string,
    content as string
  );
  return c.json(results);
});

postsRouter.delete("/delete/:id", async (c) => {
  const db = drizzle(c.env.DB);
  const user = c.get("user");
  const id = c.req.param("id");
  const post = await getSinglePost(db, Number(id));
  if (!user || post[0].authorId !== user.id) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const results = await deletePost(db, Number(id));
  return c.json(results);
});

export default postsRouter;
