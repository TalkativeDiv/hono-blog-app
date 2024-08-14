import { html } from "hono/html";
import { Fragment } from "hono/jsx/jsx-runtime";
import { User } from "lucia";

export function Nav({ user }: { user?: User | null | undefined }) {
  return (
    // <nav
    //   className="navbar navbar-expand-md navbar-dark bg-dark"
    //   aria-label="Fourth navbar example"
    // >
    //   <div className="container-fluid">
    //     <a className="navbar-brand" href="/">
    //       Blogging App
    //     </a>
    //     <button
    //       className="navbar-toggler"
    //       type="button"
    //       data-bs-toggle="collapse"
    //       data-bs-target="#navbarsExample04"
    //       aria-controls="navbarsExample04"
    //       aria-expanded="false"
    //       aria-label="Toggle navigation"
    //     >
    //       <span className="navbar-toggler-icon" />
    //     </button>

    //     <div className="collapse navbar-collapse" id="navbarsExample04">
    //       <ul className="navbar-nav me-auto mb-2 mb-md-0">
    //         <li className="nav-item">
    //           <a className="nav-link" href="/posts/explore">
    //             Explore
    //           </a>
    //         </li>
    //         {user && (
    //           <Fragment>
    //             <li className="nav-item">
    //               <a className="nav-link" href="/posts">
    //                 Your Posts
    //               </a>
    //             </li>
    //             <li className="nav-item">
    //               <form method="POST" action="/api/auth/logout">
    //                 <button className="btn btn-secondary">Log Out</button>
    //               </form>
    //             </li>
    //           </Fragment>
    //         )}
    //       </ul>
    //     </div>
    //   </div>
    // </nav>
    <div class="container">
      <header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
        <div class="col-md-3 mb-2 mb-md-0">
          <a
            href="/"
            class="d-inline-flex link-body-emphasis text-decoration-none fs-3"
          >
            Blog App
          </a>
        </div>

        <ul class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
          {user && (
            <li>
              <a href="/" class="nav-link px-2">
                Profile
              </a>
            </li>
          )}
          <li>
            <a href="/posts/explore" class="nav-link px-2">
              Explore
            </a>
          </li>
        </ul>

        <div class="col-md-3 text-end d-flex gap-2">
          {user ? (
            <form method="POST" action="/api/auth/logout">
              <button className="btn btn-primary">Log Out</button>
            </form>
          ) : (
            <Fragment>
              <a href="/login" type="button" class="btn btn-outline-primary">
                Log in
              </a>
              <a href="/signup" type="button" class="btn btn-primary">
                Sign up
              </a>
            </Fragment>
          )}
          <button type="button" id="bd-theme" class="btn btn-secondary">
            <i class="bi bi-brightness-alt-high-fill" />
          </button>
        </div>
      </header>
      {html`
        <script>
          let dark = false;
          document.addEventListener("DOMContentLoaded", (event) => {
            const htmlElement = document.documentElement;
            const switchElement = document.getElementById("bd-theme");

            // Set the default theme to dark if no setting is found in local storage
            const currentTheme = localStorage.getItem("bsTheme") || "dark";
            htmlElement.setAttribute("data-bs-theme", currentTheme);
            dark = currentTheme === "dark";
            switchElement.addEventListener("click", function () {
              if (dark) {
                htmlElement.setAttribute("data-bs-theme", "dark");
                localStorage.setItem("bsTheme", "dark");
                dark = !dark;
              } else {
                htmlElement.setAttribute("data-bs-theme", "light");
                localStorage.setItem("bsTheme", "light");
                dark = !dark;
              }
            });
          });
        </script>
      `}
    </div>
  );
}
