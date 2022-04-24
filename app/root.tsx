import { json, LinksFunction, MetaFunction } from "@remix-run/node";
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
import image from "../public/image.png";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: styles },
    {
      rel: "icon",
      href: "/favicon.png",
      type: "image/png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicon-16x16.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-touch-icon.png",
    },
    {
      rel: "manifest",
      href: "site.webmanifest",
    },
  ];
};

export const meta: MetaFunction = () => {
  const description =
    "The Classic game of Higher and Lower, with a twist. From your favorite content creators to iconic internet moments, play with your friends and see who can guess the which videos has more views.";
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
    "og:type": "website",
    "og:image": image,
    "og:url": url,
    "og:description": description,
    "og:site_name": "Views Game",
    "og:determiner": "the",

    "twitter:card": "summary_large_image",
    "twitter:image": image,
    "twitter:creator": "@timsitorus",
    "google-site-verification": "viLQnuq6sInomruYthIiKWM-mdPNgdAGpXBwU692kY8",
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
