import { json, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import styles from "./styles/app.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const meta: MetaFunction = () => {
  const description =
    "The Classic game of Higher and Lower, with a twist. Play with your friends and see who can guess the views of the creators of the most popular videos on YouTube.";
  const title = "The Views Game";
  const url = "https://views-game.vercel.app";
  return {
    charset: "utf-8",
    viewport: "width=device-width,initial-scale=1",
    title,
    canonical: url,
    description,
    "theme-color": "#1b1e25",
    "og:title": title,
    "og:url": url,
    "og:description": description,
    "og:image": "",
    "og:type": "website",

    "twitter:card": "summary_large_image",
    "twitter:creator": "@timsitorus",
  };
};
export default function App() {
  const data = useLoaderData();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-800">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
