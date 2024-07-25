import { Hono } from "hono";

import auth from "./auth";
import posts from "./posts";

const api = new Hono();
api.route("/posts", posts);
api.route("/auth", auth);

export default api;
