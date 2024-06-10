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
import clsx from "clsx";
import {
  PreventFlashOnWrongTheme,
  ThemeProvider,
  useTheme,
} from "remix-themes";
import { themeSessionResolver } from "./services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);
  const title = String(process.env.INSTANCE_TITLE);
  const { getTheme } = await themeSessionResolver(request);
  return { user, title, theme: getTheme() };
}

export default function AppWithProviders() {
  const { theme } = useLoaderData<typeof loader>();
  return (
    <ThemeProvider specifiedTheme={theme} themeAction="/set-theme">
      <App />
    </ThemeProvider>
  );
}

function App() {
  const { user, title, theme } = useLoaderData<typeof loader>();
  const [themeState] = useTheme();

  return (
    <html lang="en" className={clsx(themeState)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(theme)} />
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
          className="px-8 py-4 sm:px-16 md:px-32 lg:px-64 xl:px-80 2xl:px-96"
        />
        <main className="px-8 sm:px-16 md:px-32 lg:px-64 xl:px-80 2xl:px-96">
          <Breadcrumbs />
          <Outlet />
        </main>
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
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
