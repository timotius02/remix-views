import { Playlist, PLAYLIST_TYPE } from "@prisma/client";
import { HeadersFunction, json, LoaderFunction } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import useWindowSize from "~/utils/useWindowSize";
import img from "../../../public/search.png";

export const headers: HeadersFunction = () => {
  return {
    "Cache-Control":
      process.env.NODE_ENV === "production"
        ? "max-age=60, stale-while-revalidate=72000"
        : "",
  };
};

type LoaderData = {
  channels: Playlist[];
  playlists: Playlist[];
};

export const loader: LoaderFunction = async () => {
  const channelsPromise = db.playlist.findMany({
    orderBy: [
      {
        plays: "desc",
      },
    ],
    where: {
      type: PLAYLIST_TYPE.CHANNEL,
    },
    take: 10,
  });
  const playlistsPromise = db.playlist.findMany({
    orderBy: [
      {
        plays: "desc",
      },
    ],
    where: {
      type: PLAYLIST_TYPE.PLAYLIST,
    },
    take: 10,
  });

  const [channels, playlists] = await Promise.all([
    channelsPromise,
    playlistsPromise,
  ]);

  return json({ channels, playlists });
};

export default function Index() {
  const data = useLoaderData<LoaderData>();
  const windowSize = useWindowSize();

  const channels =
    windowSize.width > 1024 ? data.channels : data.channels.slice(0, 6);

  const playlists =
    windowSize.width > 1024 ? data.playlists : data.playlists.slice(0, 6);
  return (
    <>
      <header>
        <div className="text-center w-full mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 z-20">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Do you know your youtubers?</span>
            <span className="block text-red-500">Let&#x27;s find out.</span>
          </h2>
          <div className="mt-12 inline-flex flex-col md:flex-row rounded-md shadow gap-4 md:gap-6 w-3/4 max-w-xl">
            <Form
              method="get"
              action="/search"
              className="flex gap-4 py-4 px-6 bg-white rounded-lg w-full"
            >
              <input
                className="flex-1 outline-0"
                type="text"
                placeholder="Search"
                name="term"
              />
              <button type="submit" className="w-6 h-6">
                <img src={img} alt="search icon" />
              </button>
            </Form>
          </div>
        </div>
      </header>

      <section className="w-5/6 mx-auto mt-8">
        <div className="flex justify-between items-baseline">
          <h1 className="font-semibold text-3xl mb-8 text-white">
            Popular Creators
          </h1>
          <Link
            to={`/search?type=Channels`}
            className="text-white text-2xl hover:underline"
          >
            Browse all creators
          </Link>
        </div>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {channels.map((playlist) => (
            <li key={playlist.id}>
              <Link to={`/playlist/${playlist.id}`} prefetch="intent">
                <div className="overflow-hidden shadow-lg rounded-lg hover:scale-105 relative group">
                  <img
                    alt={`${playlist.name} Channel Image`}
                    src={playlist.thumbnail}
                    className="max-h-40 w-full object-cover group-hover:brightness-50"
                  />
                  <div className="opacity-0 hover:opacity-100 absolute inset-0 z-10 text-white font-extrabold flex justify-center items-center p-4">
                    <div className="font-bold text-xl text-center">
                      {playlist.name}
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section className="w-5/6 mx-auto my-8">
        <div className="flex justify-between items-baseline">
          <h1 className="font-semibold text-3xl mb-8 text-white">
            Popular Playlists
          </h1>
          <Link
            to={`/search?type=Playlists`}
            className="text-white text-2xl hover:underline"
          >
            Browse All Playlists
          </Link>
        </div>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {playlists.map((playlist) => (
            <li key={playlist.id}>
              <Link to={`/playlist/${playlist.id}`} prefetch="intent">
                <div className="overflow-hidden shadow-lg rounded-lg hover:scale-105 relative group">
                  <img
                    alt={`${playlist.name} Channel Image`}
                    src={playlist.thumbnail}
                    className="max-h-40 w-full object-cover group-hover:brightness-50"
                  />
                  <div className="opacity-0 hover:opacity-100 absolute inset-0 z-10 text-white font-extrabold flex justify-center items-center p-4">
                    <div className="font-bold text-xl text-center">
                      {playlist.name}
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
