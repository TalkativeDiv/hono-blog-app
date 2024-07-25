import { eq } from "drizzle-orm";
import { DrizzleD1Database } from "drizzle-orm/d1";
import { InsertUser, SelectUser, users } from "../schema";

export async function getUser(
  db: DrizzleD1Database,
  email: string
): Promise<SelectUser | null> {
  const result = await db.select().from(users).where(eq(users.email, email));

  return !result || result.length === 0 ? null : result[0];
}

export async function insertUser(
  db: DrizzleD1Database,
  data: InsertUser
): Promise<SelectUser | null> {
  const result = await db.insert(users).values(data).returning();
  return !result || result.length === 0 ? null : result[0];
}
