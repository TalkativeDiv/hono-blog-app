import { Session, User } from "lucia";

export type Env = {
  DB: D1Database;
};

export type Variables = {
  user: User | null;
  session: Session | null;
}