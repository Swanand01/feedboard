import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import styles from "./tailwind.css?url";
import { authenticator } from "./services/auth.server";
import Header from "./components/ui/header";
import Error from "./components/error";
import RouteError from "./components/route-error";
import { Toaster } from "./components/ui/toaster";
import { Breadcrumbs } from "./components/ui/breadcrumbs";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);
  const title = String(process.env.INSTANCE_TITLE);
  return { user, title };
}

export function Document({ children }: { children: React.ReactNode }) {
  const { user, title } = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
        className={
          "bg-background flex min-h-screen flex-col gap-8 font-sans antialiased w-full"
        }
      >
        <Header
          user={user}
          title={title}
          className="px-8 py-4 sm:px-16 md:px-32 lg:px-64"
        />
        <main className="px-8 sm:px-16 md:px-32 lg:px-64">
          <Breadcrumbs />
          {children}
        </main>
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <html lang="en">
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        {isRouteErrorResponse(error) ? <RouteError error={error} /> : <Error />}
        <Scripts />
      </body>
    </html>
  );
}
