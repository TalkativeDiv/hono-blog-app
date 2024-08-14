import { Fragment } from "hono/jsx/jsx-runtime";

export default function PostForm({
  title,
  content,
  action,
}: {
  title?: string;
  content?: string;
  action: "Edit" | "Create";
}) {
  return (
    <Fragment>
      {" "}
      <h1 className="mb-4">{action}&nbsp;Post</h1>
      <div className="mb-3">
        <label for="title" className="form-label">
          Title
        </label>
        <input
          type="text"
          label="Title"
          name="title"
          id="content"
          placeholder="My Awesome Post!!!"
          className="form-control"
          value={title}
          required
        />
      </div>
      <div className="mb-3">
        <label for="content" className="form-label">
          Content
        </label>
        <textarea
          label="content"
          id="content"
          name="content"
          className="form-control"
          placeholder="Write something (In markdown!!!)"
          required
        >
          {content}
        </textarea>
      </div>
      <br />
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </Fragment>
  );
}
