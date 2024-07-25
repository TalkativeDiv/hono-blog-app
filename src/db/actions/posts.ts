import { eq } from "drizzle-orm";
import { DrizzleD1Database } from "drizzle-orm/d1";
import { InsertPost, SelectPost, posts } from "../schema";

export async function getAllPosts(
  db: DrizzleD1Database
): Promise<SelectPost[]> {
  return await db.select().from(posts);
}

export async function getPosts(
  db: DrizzleD1Database,
  userId: string
): Promise<SelectPost[]> {
  return await db.select().from(posts).where(eq(posts.authorId, userId));
}

export async function getSinglePost(
  db: DrizzleD1Database,
  postId: number
): Promise<SelectPost[]> {
  return await db.select().from(posts).where(eq(posts.id, postId));
}

export async function deletePost(
  db: DrizzleD1Database,
  postId: number
): Promise<SelectPost[]> {
  return await db.delete(posts).where(eq(posts.id, postId)).returning();
}

export async function updatePost(
  db: DrizzleD1Database,
  postId: number,
  title: string,
  content: string
): Promise<SelectPost[]> {
  return await db
    .update(posts)
    .set({ title, content })
    .where(eq(posts.id, postId))
    .returning();
}

export async function insertPost(
  db: DrizzleD1Database,
  data: InsertPost
): Promise<SelectPost[]> {
  return await db.insert(posts).values(data).returning();
}
