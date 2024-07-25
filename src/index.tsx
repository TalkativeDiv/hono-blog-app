import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { csrf } from "hono/csrf";
import { useRef } from "hono/jsx";
import { jsxRenderer } from "hono/jsx-renderer";
import { Fragment } from "hono/jsx/jsx-runtime";
import markdownit from "markdown-it";
import api from "./api";
import type { Env, Variables } from "./bindings";
import { getAllPosts, getPosts, getSinglePost } from "./db/actions/posts";
import { authMiddleWare } from "./middleware";
const app = new Hono<{ Bindings: Env; Variables: Variables }>();

const getReadingTime = (text: string) =>
  Math.ceil(text.trim().split(/\s+/).length / 225);

app.get(
  "*",
  jsxRenderer(({ children }) => {
    return (
      <html>
        <head>
          <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
            crossorigin="anonymous"
          />
          <script
            src="https://unpkg.com/htmx.org@2.0.1"
            integrity="sha384-QWGpdj554B4ETpJJC9z+ZHJcA/i59TyjxEPXiiUgN2WmTyV5OEZWCD6gQhgkdpB/"
            crossorigin="anonymous"
          ></script>
          <script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
            crossorigin="anonymous"
          ></script>

          <script
            src="
https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/dist/markdown-it.min.js
"
          ></script>

          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
          />
          <script src="//unpkg.com/alpinejs" defer></script>

          <title>Blog App</title>
        </head>
        <body>
          <noscript>
            Javascript is needed for this app! Please enable it!!!
          </noscript>
          {children}
        </body>
      </html>
    );
  })
);
app.use(csrf());
app.use("*", authMiddleWare);

app.route("/api", api);
app.get("/", (c) => {
  const user = c.get("user");
  if (user) {
    return c.redirect("/posts");
  }

  return c.render(
    <div
      class="d-flex justify-content-center align-items-center flex-column text-center"
      style={{ minWidth: "100vw", minHeight: "100vh" }}
    >
      <h1>👋 Hello! </h1>
      <p>
        You need to be authenticated to create or edit posts. <br /> That being
        said you can just look around for now. <br /> Go to{" "}
        <a
          href="/explore"
          class="link-dark link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
        >
          all posts
        </a>
        ,{" "}
        <a
          href="/login"
          class="link-dark link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
        >
          Login
        </a>{" "}
        or&nbsp;
        <a
          href="/signup"
          class="link-dark link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
        >
          Sign Up
        </a>
        ?
      </p>
    </div>
  );
});

app.get("/posts", async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.redirect("/");
  }

  const db = drizzle(c.env.DB);
  const results = await getPosts(db, user.id);

  return c.render(
    <Fragment>
      <nav
        class="navbar navbar-expand-md navbar-dark bg-dark"
        aria-label="Fourth navbar example"
      >
        <div class="container-fluid">
          <a class="navbar-brand" href="/">
            Blogging App
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarsExample04"
            aria-controls="navbarsExample04"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon" />
          </button>

          <div class="collapse navbar-collapse" id="navbarsExample04">
            <ul class="navbar-nav me-auto mb-2 mb-md-0">
              <li class="nav-item">
                <a class="nav-link" href="/explore">
                  Explore
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/posts">
                  Your Posts
                </a>
              </li>
              <li className="nav-item">
                <form method="POST" action="/api/auth/logout">
                  <button class="btn btn-secondary">Log Out</button>
                </form>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div class="container m-4">
        <div className="row">
          <div class="col-4">
            <form
              hx-post="/api/posts"
              hx-swap="none"
              class="card p-4"
              onsubmit="setTimeout(() => window.location.reload(), 1000)"
            >
              <h1 class="text-2xl mb-4">Create Post</h1>

              <div class="mb-3">
                <label for="title" class="form-label">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  placeholder="My Awesome Post!!!"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="content" class="form-label">
                  Content
                </label>
                <textarea
                  label="tontent"
                  id="content"
                  name="content"
                  class="form-control"
                  placeholder="Write something (In markdown!!!)... NOTE: to line break to <br />"
                  required
                />
              </div>

              <br />
              <button type="submit" class="btn btn-primary">
                Submit
              </button>
            </form>
          </div>
          <div id="posts-list" class="col-8">
            <div id="posts-list" class="container w-full ">
              <h2>Your Posts</h2>
              {results.length == 0 ? (
                <p>
                  No Posts Yet, though you can create one using the form next to
                  this!
                </p>
              ) : (
                results.map((post) => (
                  <div key={post.id} class="card p-2 my-3">
                    <div className="d-flex gap-2">
                      <h5 id={`${post.id}_title`}>{post.title}</h5>
                      <form
                        hx-delete={`/api/posts/delete/${post.id}`}
                        hx-swap="none"
                        onsubmit="setTimeout(() => window.location.reload(), 1000)"
                      >
                        <button type="submit" className="btn btn-danger btn-sm">
                          <i class="bi bi-trash2-fill" />
                        </button>
                      </form>
                      <a
                        role="button"
                        href={`/posts/edit/${post.id}`}
                        className="btn btn-info btn-sm"
                      >
                        <i class="bi bi-pen-fill" />
                      </a>
                    </div>
                    <p>{post.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* {results.map((post) => (
        <div class="card p-4 row col-3 m-2">
          <h2>{post.title}</h2>
          <a href={`/posts/${post.id}`}>Visit</a>
        </div>
      ))} */}
    </Fragment>
  );
});

app.get("/posts/edit/:id", async (c) => {
  const db = drizzle(c.env.DB);
  const results = await getSinglePost(db, Number(c.req.param("id")));
  if (results.length === 0) {
    return c.render(
      <div class="text-center">
        <h1>Not Found!</h1>
        <a href="/">Go Home?</a>
      </div>
    );
  }
  const user = c.get("user");
  if (!user || results[0].authorId !== user.id) {
    return c.redirect("/");
  }

  return c.render(
    <Fragment>
      <nav
        class="navbar navbar-expand-md navbar-dark bg-dark"
        aria-label="Fourth navbar example"
      >
        <div class="container-fluid">
          <a class="navbar-brand" href="/">
            Blogging App
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarsExample04"
            aria-controls="navbarsExample04"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon" />
          </button>

          <div class="collapse navbar-collapse" id="navbarsExample04">
            <ul class="navbar-nav me-auto mb-2 mb-md-0">
              <li class="nav-item">
                <a class="nav-link" href="/explore">
                  Explore
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/posts">
                  Your Posts
                </a>
              </li>
              <li className="nav-item">
                <form method="POST" action="/api/auth/logout">
                  <button class="btn btn-secondary">Log Out</button>
                </form>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div class="m-4">
        <div class="m-auto">
          <form
            hx-patch={`/api/posts/edit/${results[0].id}`}
            hx-swap="none"
            class="card p-4"
            onsubmit="setTimeout(() => window.location.reload(), 1000)"
          >
            <h1 class="text-2xl mb-4">Edit Post</h1>

            <div class="mb-3">
              <label for="title" class="form-label">
                Title
              </label>
              <input
                type="text"
                label="Title"
                name="title"
                id="content"
                class="form-control"
                value={results[0].title}
                required
              />
            </div>
            <div class="mb-3">
              <label for="content" class="form-label">
                Content
              </label>
              <textarea
                label="Content"
                id="content"
                name="content"
                class="form-control"
                placeholder="Write something (In markdown!!!)... NOTE: to line break to <br />"
                required
              >
                {results[0].content}
              </textarea>
            </div>

            <br />
            <button type="submit" class="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* {results.map((post) => (
        <div class="card p-4 row col-3 m-2">
          <h2>{post.title}</h2>
          <a href={`/posts/${post.id}`}>Visit</a>
        </div>
      ))} */}
    </Fragment>
  );
});

app.get("/posts/:id", async (c) => {
  const id = c.req.param("id");
  const user = c.get("user");
  if (!user) {
    return c.redirect("/");
  }

  const db = drizzle(c.env.DB);
  const results = await getSinglePost(db, Number(id));

  const post = results[0];
  if (results.length === 0) {
    return c.render(
      <div class="text-center">
        <h1>Not Found!</h1>
        <a href="/">Go Home?</a>
      </div>
    );
  }
  return c.render(
    <Fragment>
      <nav
        class="navbar navbar-expand-md navbar-dark bg-dark"
        aria-label="Fourth navbar example"
      >
        <div class="container-fluid">
          <a class="navbar-brand" href="/">
            Blogging App
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarsExample04"
            aria-controls="navbarsExample04"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon" />
          </button>

          <div class="collapse navbar-collapse" id="navbarsExample04">
            <ul class="navbar-nav me-auto mb-2 mb-md-0">
              <li class="nav-item">
                <a class="nav-link" href="/explore">
                  Explore
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/explore">
                  Your Posts
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <article class="mt-4 text-center">
        <p class="text-secondary">{getReadingTime(post.content)} minute read</p>
        <h2>{post.title}</h2>
        <h6>{post.timestamp}</h6>
        <hr />
        <div
          style="max-width:50%;word-wrap: break-word;"
          class="mx-auto text-left"
          dangerouslySetInnerHTML={{
            __html: markdownit({ html: true, typographer: true }).render(
              post.content
            ),
          }}
        ></div>
      </article>
      <script></script>
    </Fragment>
  );
});

app.get("/explore", async (c) => {
  const db = drizzle(c.env.DB);
  const results = await getAllPosts(db);
  const user = c.get("user");
  return c.render(
    <Fragment>
      <nav
        class="navbar navbar-expand-md navbar-dark bg-dark"
        aria-label="Fourth navbar example"
      >
        <div class="container-fluid">
          <a class="navbar-brand" href="/">
            Blogging App
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarsExample04"
            aria-controls="navbarsExample04"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon" />
          </button>

          <div class="collapse navbar-collapse" id="navbarsExample04">
            <ul class="navbar-nav me-auto mb-2 mb-md-0">
              <li class="nav-item">
                <a class="nav-link" href="/explore">
                  Explore
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/posts">
                  Your Posts
                </a>
              </li>
              {user && (
                <li className="nav-item">
                  <form method="POST" action="/api/auth/logout">
                    <button class="btn btn-secondary">Log Out</button>
                  </form>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <div className="">
        <div className="container">
          <div className="row text-center justify-content-center">
            {results.map((post) => (
              <div className="card p-4 row col-3 m-2">
                <h2>{post.title}</h2>
                <a href={`/posts/${post.id}`}>Visit</a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
});

app.get("/login", (c) => {
  return c.render(
    <div
      class="d-flex justify-content-center align-items-center bg-primary"
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        maxWidth: "100vw",
        maxHeight: "100vh",
      }}
    >
      <div className="card p-4 d-flex justify-content-center align-items-center">
        <h2>Login</h2>
        <br />
        <form method="POST" action="/api/auth/login">
          <div class="mb-3">
            <label for="email" class="form-label">
              Email address
            </label>
            <input
              type="email"
              class="form-control"
              id="email"
              placeholder="Email"
              aria-describedby="emailHelp"
              name="email"
            ></input>
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">
              Password
            </label>
            <input
              type="password"
              class="form-control"
              id="password"
              name="password"
              placeholder="Password"
            />
          </div>

          <button type="submit" class="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
});

app.get("/signup", (c) => {
  return c.render(
    <div
      class="d-flex justify-content-center align-items-center bg-primary"
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        maxWidth: "100vw",
        maxHeight: "100vh",
      }}
    >
      <div className="card p-4 d-flex justify-content-center align-items-center">
        <h2>Login</h2>
        <br />
        <form method="POST" action="/api/auth/signup">
          <div class="mb-3">
            <label for="email" class="form-label">
              Email address
            </label>
            <input
              type="email"
              class="form-control"
              id="email"
              placeholder="Email"
              aria-describedby="emailHelp"
              name="email"
            ></input>
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">
              Password
            </label>
            <input
              type="password"
              class="form-control"
              id="password"
              name="password"
              placeholder="Password"
            />
          </div>

          <button type="submit" class="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
});

export default app;
