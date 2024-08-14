import { Hono } from "hono";
import { getAllPosts, getPosts, getSinglePost } from "../db/actions/posts";
import { drizzle } from "drizzle-orm/d1";
import { Env, Variables } from "../bindings";
import { Fragment } from "hono/jsx/jsx-runtime";
import { Nav } from "../components/nav";
import markdownIt from "markdown-it";
import PostForm from "../components/post-form";

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

const getReadingTime = (text: string) =>
  Math.ceil(text.trim().split(/\s+/).length / 225);
app.get("/", async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.redirect("/");
  }

  const db = drizzle(c.env.DB);
  const results = await getPosts(db, user.id);

  return c.render(
    <Fragment>
      <Nav user={user} />
      <div className="d-flex justify-content-center align-items-center">
        <div className="container m-4">
          <div className="row ustify-content-center">
            <div className="col-4">
              <form
                hx-post="/api/posts"
                hx-swap="afterend"
                className="card p-4"
                onsubmit="setTimeout(() => window.location.reload(), 1000)"
              >
                <div id="alert"></div>
                <PostForm action="Create" />
              </form>
            </div>
            <div id="posts-list" className="col-8">
              <div id="posts-list" className="container w-full ">
                <h2>Your Posts</h2>
                {results.length == 0 ? (
                  <p>
                    No Posts Yet, though you can create one using the form next
                    to this!
                  </p>
                ) : (
                  results.map((post) => (
                    <div key={post.id} className="card p-3 my-3">
                      <div className="d-flex gap-2 justify-content-between">
                        <div className="d-flex gap-2 flex-column">
                          <h5 id={`${post.id}_title`}>
                            <a href={`/posts/${post.id}`}>{post.title}</a>
                          </h5>
                          <p>{new Date(post.timestamp).toLocaleDateString()}</p>
                        </div>
                        <div className="d-flex flex-column gap-2">
                          <form
                            hx-delete={`/api/posts/delete/${post.id}`}
                            hx-swap="none"
                            onsubmit="setTimeout(() => window.location.reload(), 1000)"
                          >
                            <button
                              type="submit"
                              className="btn btn-danger btn-sm"
                            >
                              <i className="bi bi-trash2-fill" />
                            </button>
                          </form>
                          <a
                            role="button"
                            href={`/posts/edit/${post.id}`}
                            className="btn btn-info btn-sm"
                          >
                            <i className="bi bi-pen-fill" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
});

app.get("/edit/:id", async (c) => {
  const db = drizzle(c.env.DB);
  const results = await getSinglePost(db, Number(c.req.param("id")));
  if (results.length === 0) {
    return c.render(
      <div className="text-center">
        <h1>Not Found!</h1>
        <a href="/">Go Home?</a>
      </div>
    );
  }
  const user = c.get("user");
  if (!user || results[0].authorId !== user.id) {
    return c.redirect("/");
  }
  const { title, content } = results[0];
  return c.render(
    <Fragment>
      <Nav user={user} />
      <div className="m-4">
        <div className="m-auto">
          <form
            hx-patch={`/api/posts/edit/${results[0].id}`}
            hx-swap="none"
            onsubmit="setTimeout(() => window.location.reload(), 1000)"
          >
            <PostForm action="Edit" title={title} content={content} />
          </form>
        </div>
      </div>
    </Fragment>
  );
});

app.get("/:id", async (c) => {
  const id = c.req.param("id");
  const user = c.get("user");
  const db = drizzle(c.env.DB);
  const explorePosts = await getAllPosts(db);
  // safe because ids are ALWAYS a number.
  if (id == "explore") {
    return c.render(
      <Fragment>
        <Nav user={user} />

        <div>
          <div className="container">
            <div className="row justify-content-center">
              {explorePosts.map((post) => (
                <div className="card p-4 row col-3 m-2">
                  <h5 class="card-title">{post.title}</h5>
                  <p class="card-text">
                    {new Date(post.timestamp).toLocaleDateString()}
                  </p>
                  <a className="btn btn-secondary" href={`/posts/${post.id}`}>
                    Visit
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
  const results = await getSinglePost(db, Number(id));

  const post = results[0];
  if (results.length === 0) {
    return c.render(
      <div className="text-center">
        <h1>Not Found!</h1>
        <a href="/">Go Home?</a>
      </div>
    );
  }
  return c.render(
    <Fragment>
      <Nav user={user} />

      <article className="mt-4 ">
        <div className="text-center">
          <p className="text-secondary">
            {getReadingTime(post.content)} minute read
          </p>
          <h2>{post.title}</h2>
          <h6>{post.timestamp}</h6>
        </div>
        <hr />
        <div
          style="max-width:50%;word-wrap: break-word;"
          className="mx-auto text-left"
          dangerouslySetInnerHTML={{
            __html: markdownIt({ html: true, typographer: true }).render(
              post.content
            ),
          }}
        ></div>
      </article>
      <script></script>
    </Fragment>
  );
});

export default app;
