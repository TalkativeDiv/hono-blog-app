import { Hono } from "hono";
import { csrf } from "hono/csrf";
import jsxRenderer from "./components/jsx-renderer";
import api from "./api";
import type { Env, Variables } from "./bindings";
import { authMiddleWare } from "./middleware";
import postsViews from "./routes/posts";
import { Nav } from "./components/nav";
import { Fragment } from "hono/jsx/jsx-runtime";
const app = new Hono<{ Bindings: Env; Variables: Variables }>();

app.use(csrf());
app.use("*", authMiddleWare);
app.get("*", jsxRenderer);
app.route("/api", api);
app.route("/posts", postsViews);

app.get("/", (c) => {
  const user = c.get("user");
  if (user) {
    return c.redirect("/posts");
  }

  return c.render(
    <Fragment>
      <Nav />
      <main>
        <div class="px-4 py-5 my-5 text-center">
          <h1 class="display-5 fw-bold text-body-emphasis">
            Blogging for the rest of us.
          </h1>
          <div class="col-lg-6 mx-auto">
            <p class="lead mb-4">
              Quickly blog about anything you want at any time, no need to worry
              about uptime or maintenance. 100% Free and open source software
              that easily can be hosted for free. You can host it in &lt;5
              minutes.
            </p>
            <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
              <a
                href="/signup"
                role="button"
                class="btn btn-primary btn-lg px-4 gap-3"
              >
                Sign up
              </a>
              <a
                href="/posts/explore"
                role="button"
                class="btn btn-outline-secondary btn-lg px-4"
              >
                Explore
              </a>
            </div>
          </div>
        </div>
      </main>
    </Fragment>
  );
});

// Auth
app.get("/login", (c) => {
  return c.render(
    <Fragment>
      <Nav />

      <div className="d-flex align-items-center justify-content-center  py-4">
        <form method="POST" action="/api/auth/login">
          <h3 className="mb-3 fw-normal">Login</h3>

          <div className="d-flex flex-column gap-2">
            <div className="form-floating">
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="name@example.com"
                aria-describedby="emailHelp"
                name="email"
              />
              <label for="email">Email address</label>
            </div>
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="********"
              />
              <label for="password">Password</label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary mt-3">
            Submit
          </button>
          <div className="d-flex gap-2 mt-2">
            Don't have an account?
            <a href="/signup">Sign up</a>
          </div>
        </form>
      </div>
    </Fragment>
  );
});

app.get("/signup", (c) => {
  return c.render(
    <Fragment>
      <Nav />

      <div className="d-flex align-items-center justify-content-center  py-4">
        <form method="POST" action="/api/auth/signup">
          <h3 className="mb-3 fw-normal">Sign up</h3>

          <div className="d-flex flex-column gap-2">
            <div className="form-floating">
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="name@example.com"
                aria-describedby="emailHelp"
                name="email"
              />
              <label for="email">Email address</label>
            </div>
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="********"
              />
              <label for="password">Password</label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary mt-3">
            Submit
          </button>
          <div className="d-flex gap-2 mt-2">
            Already have an account?
            <a href="/login">Log in</a>
          </div>
        </form>
      </div>
    </Fragment>
  );
});

export default app;
