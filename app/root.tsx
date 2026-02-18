import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";
import type { LinksFunction } from "react-router";
import stylesheet from "~/styles/app.css?url";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Mono:ital,wght@0,200..700;1,200..700&family=Bebas+Neue&display=swap",
  },
  { rel: "stylesheet", href: stylesheet },
];

export { loader } from "~/lib/root-loader.server";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Clay Coffman - Product leader, entrepreneur, and lifelong learner"
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

interface FlashMessage {
  type: string;
  text: string;
}

export default function App() {
  const data = useLoaderData() as {
    flashMessage: FlashMessage | null;
  };
  const flashMessage = data?.flashMessage;

  return (
    <>
      {flashMessage && (
        <div className="mx-auto mt-3 max-w-3xl px-4">
          <div
            className={`rounded-md border px-4 py-3 text-body-sm ${
              flashMessage.type === "error"
                ? "border-red-300 bg-red-50 text-red-800"
                : flashMessage.type === "success"
                  ? "border-green-300 bg-green-50 text-green-800"
                  : "border-blue-300 bg-blue-50 text-blue-800"
            }`}
          >
            {flashMessage.text}
          </div>
        </div>
      )}
      <Outlet />
    </>
  );
}
