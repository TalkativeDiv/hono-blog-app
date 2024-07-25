# Hono Blog API

> A Basic API for a blog app (like Medium, Dev.to, Hashnode, etc.) built with Hono, Bun and Cloudflare Workers.

## Features

- ⚡ Get and Post Articles Blazingly fast using Hono, Drizzle, and D1.
- 🎨 Beautiful Reliable UI using Bootstrap.
- 🔒 Secure and simple authentication with Lucia
- 💾 Serverlessly Hosted on Cloudflare Workers.

## Deployment

1. Clone the repository:

```bash
$ git clone https://github.com/TalkativeDiv/hono-blog-api.git
```

2. Go into the directory:

```bash
$ cd hono-blog-api
```

3. Install the dependencies:

```bash
$ bun install
```

4. Install the Wrangler CLI (if you haven't already):

```bash
$ bun add @cloudflare/wrangler -g
```

5. Initialize a D1 Database

```bash
$ wrangler d1 create <database-name>
```

6. Add the Database ID and other things in `wrangler.toml`

7. Run Database Migrations:

```bash
$ bun db:generate
$ bunx wrangler d1 execute <database-name> --remote --file=./drizzle/migrations/<migration-file>
```

8. Publish the Worker:

```bash
$ bun deploy
```
