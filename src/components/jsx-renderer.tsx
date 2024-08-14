import { jsxRenderer } from "hono/jsx-renderer";

export default jsxRenderer(({ children }) => {
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
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.css"
        />
       
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
        {/* @ts-ignore */}
       
      </body>
    </html>
  );
});
