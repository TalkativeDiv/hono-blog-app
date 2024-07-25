import { zValidator } from "@hono/zod-validator";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { Scrypt } from "lucia";
import { z } from "zod";

import { cors } from "hono/cors";
import { Env, Variables } from "../bindings";
import { getUser, insertUser } from "../db/actions/users";
import { initializeLucia } from "../db/lucia";

const authRouter = new Hono<{ Bindings: Env; Variables: Variables }>();
authRouter.use(
  "*",
  cors({
    origin: "*",
    maxAge: 600,
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    credentials: false,
  })
);
authRouter.post(
  "/login",
  zValidator(
    "form",
    z.object({
      email: z.string().min(1).email(),
      password: z.string().min(1).max(255),
    })
  ),
  async (c) => {
    const { email, password } = await c.req.valid("form");

    const db = drizzle(c.env.DB);

    const user = await getUser(db, email);
    if (!user) {
      return c.json(
        { error: "Invalid email or password.", success: false },
        404
      );
    }

    const isValidPassword = await new Scrypt().verify(user.password, password);
    if (!isValidPassword) {
      return c.json(
        { error: "Invalid email or password.", success: false },
        404
      );
    }

    const lucia = initializeLucia(c.env.DB);

    const session = await lucia.createSession(user.id, {});
    const cookie = lucia.createSessionCookie(session.id);

    c.header("Set-Cookie", cookie.serialize(), { append: true });
    return c.redirect("/posts");
  }
);

authRouter.post(
  "/signup",
  zValidator(
    "form",
    z.object({
      email: z.string().min(1).email(),
      password: z.string().min(1).max(255),
    })
  ),
  async (c) => {
    const { email, password } = await c.req.valid("form");

    const db = drizzle(c.env.DB);

    const existingUser = await getUser(db, email);
    if (existingUser) {
      return c.json({ error: "User already exists.", success: false }, 400);
    }

    const passwordHash = await new Scrypt().hash(password);

    const user = await insertUser(db, {
      email,
      password: passwordHash,
    });
    if (!user) {
      return c.json({ error: "Failed to create user.", success: false }, 500);
    }

    const lucia = initializeLucia(c.env.DB);

    const session = await lucia.createSession(user.id, {});

    const cookie = lucia.createSessionCookie(session.id);

    c.header("Set-Cookie", cookie.serialize(), { append: true });

    return c.redirect("/posts");
  }
);

authRouter.post("/logout", async (c) => {
  const lucia = initializeLucia(c.env.DB);

  const session = c.get("session");

  if (session) {
    await lucia.invalidateSession(session.id);
  }

  c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
    append: true,
  });

  return c.redirect("/");
});

export default authRouter;
