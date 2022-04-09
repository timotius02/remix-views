import { Playlist, PLAYLIST_TYPE } from "@prisma/client";
import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import Footer from "~/components/Footer";
import Navbar from "~/components/Navbar";
import { db } from "~/utils/db.server";
import useWindowSize from "~/utils/useWindowSize";
import img from "../../public/search.png";

export const meta: MetaFunction = () => {
  return {
    title: `The VIEWS Game`,
    description:
      "Do you think you can guess the views of your favorite creators?",
  };
};

type LoaderData = {
  channels: Playlist[];
  playlists: Playlist[];
};

export const loader: LoaderFunction = async () => {
  const channels = await db.playlist.findMany({
    orderBy: [
      {
        plays: "desc",
      },
    ],
    where: {
      type: PLAYLIST_TYPE.CHANNEL,
    },
    take: 12,
  });
  const playlists = await db.playlist.findMany({
    orderBy: [
      {
        plays: "desc",
      },
    ],
    where: {
      type: PLAYLIST_TYPE.PLAYLIST,
    },
    take: 12,
  });

  return json({ channels, playlists });
};

export default function Index() {
  const data = useLoaderData<LoaderData>();
  const [windowSize, setWindowSize] = useWindowSize();

  const channels =
    windowSize.width > 768 ? data.channels : data.channels.slice(0, 6);

  const playlists =
    windowSize.width > 768 ? data.playlists : data.playlists.slice(0, 6);
  return (
    <div className="bg-gray-800 w-full">
      <Navbar />
      <div className="bg-gray-800">
        <div className="text-center w-full mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 z-20">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Do you know your youtubers?</span>
            <span className="block text-red-500">Let&#x27;s find out.</span>
          </h2>
          <div className="mt-12 inline-flex flex-col md:flex-row rounded-md shadow gap-2 md:gap-6">
            <Form method="get" action="/search">
              <div className="flex gap-4 py-3 px-6 bg-white rounded-lg">
                <input
                  className="flex-1 outline-0"
                  type="text"
                  placeholder="Search"
                  name="term"
                />
                <button type="submit" className="w-6 h-6">
                  <img src={img} alt="search icon" />
                </button>
              </div>
            </Form>
            <a
              href="/playlist/new"
              className="py-1.5 px-6 bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg leading-9"
            >
              Create Custom Playlist{" "}
              <span className="bg-red-300 rounded px-2 py-1 text-sm">BETA</span>
            </a>
          </div>
        </div>
      </div>

      <section className="container mx-auto px-12">
        <h1 className="font-light text-3xl my-8 text-white">
          Popular Creators
        </h1>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
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
      <section className="container mx-auto px-12">
        <h1 className="font-light text-3xl my-8 text-white">
          Popular Playlists
        </h1>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
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
      <Footer />
    </div>
  );
}
