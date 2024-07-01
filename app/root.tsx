import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
  useRouteLoaderData,
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
  Theme,
  ThemeProvider,
  useTheme,
} from "remix-themes";
import { themeSessionResolver } from "./services/session.server";
import "@fontsource-variable/figtree/wght.css";
import { getSiteOption } from "./lib/utils.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);
  const title = (await getSiteOption("title")) || "Feedboard";
  const logoURL = await getSiteOption("logo");
  const { getTheme } = await themeSessionResolver(request);
  return { user, title, logoURL, theme: getTheme() };
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
  const { user, title, logoURL, theme } = useLoaderData<typeof loader>();
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
      <body className="bg-background flex min-h-screen flex-col gap-8 antialiased w-full">
        <Header
          user={user}
          title={title}
          logoURL={logoURL}
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
  const { theme } = useRouteLoaderData("root") as { theme: Theme };

  return (
    <ThemeProvider specifiedTheme={theme} themeAction="/set-theme">
      <ErrorBoundaryWithTheme theme={theme} />
    </ThemeProvider>
  );
}

function ErrorBoundaryWithTheme({ theme }: { theme: Theme }) {
  const error = useRouteError();
  const [themeState] = useTheme();

  return (
    <html lang="en" className={clsx(themeState)}>
      <head>
        <title>Oh no!</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(theme)} />
        <Links />
      </head>
      <body className="bg-background min-h-screen gap-8 antialiased w-full">
        <main className="h-screen px-8 sm:px-16 md:px-32 lg:px-64 xl:px-80 2xl:px-96 flex flex-col items-center justify-center">
          {isRouteErrorResponse(error) ? (
            <RouteError error={error} />
          ) : (
            <Error />
          )}
          <Scripts />
        </main>
      </body>
    </html>
  );
}
