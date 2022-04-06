import { Playlist } from "@prisma/client";
import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Footer from "~/components/Footer";
import Navbar from "~/components/Navbar";
import { db } from "~/utils/db.server";
import useWindowSize from "~/utils/useWindowSize";

export const meta: MetaFunction = () => {
  return {
    title: `The VIEWS Game`,
    description:
      "Do you think you can guess the views of your favorite creators?",
  };
};

type LoaderData = { mostViewed: Playlist[] };

export const loader: LoaderFunction = async () => {
  const mostViewed = await db.playlist.findMany({
    orderBy: [
      {
        plays: "desc",
      },
    ],
    take: 10,
  });
  return json({ mostViewed });
};

export default function Index() {
  const data = useLoaderData<LoaderData>();
  const [windowSize, setWindowSize] = useWindowSize();

  const mostViewed =
    windowSize.width > 768 ? data.mostViewed : data.mostViewed.slice(0, 6);
  return (
    <div className="bg-gray-800 w-full">
      <Navbar />
      <div className="bg-gray-800">
        <div className="text-center w-full mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 z-20">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Do you know your youtubers?</span>
            <span className="block text-red-500">Let&#x27;s find out.</span>
          </h2>
          <div className="lg:mt-0 lg:flex-shrink-0">
            <div className="mt-12 inline-flex rounded-md shadow">
              <button
                type="button"
                className="py-4 px-6 bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
              >
                Get started
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="container mx-auto px-12">
        <h1 className="font-light text-3xl my-8 text-white">
          Popular Creators
        </h1>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {mostViewed.map((playlist) => (
            <li key={playlist.id}>
              <Link to={`/playlist/${playlist.id}`} prefetch="intent">
                <div className="overflow-hidden shadow-lg rounded-lg hover:scale-105">
                  <img
                    alt={`${playlist.name} Channel Image`}
                    src={playlist.thumbnail}
                    className="max-h-40 w-full object-cover"
                  />
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
