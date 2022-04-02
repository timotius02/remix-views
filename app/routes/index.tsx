import { Playlist } from "@prisma/client";
import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

export const meta: MetaFunction = () => {
  return {
    title: `The VIEWS Game`,
    description:
      "Do you think you can guess the views of your favorite creators?",
  };
};

type LoaderData = { playlists: Playlist[] };

export const loader: LoaderFunction = async () => {
  const playlists = await db.playlist.findMany();

  return json({ playlists });
};

export default function Index() {
  const data = useLoaderData<LoaderData>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>VIEWS Game</h1>
      <ul>
        {data.playlists.map((playlist) => (
          <li>
            <Link to={`/playlist/${playlist.id}`}>{playlist.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
