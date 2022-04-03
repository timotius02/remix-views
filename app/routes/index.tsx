import { Playlist } from "@prisma/client";
import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Navbar from "~/components/Navbar";
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
    <div className="bg-gray-100 w-full">
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

      <section className="w-3/4 mx-auto">
        <h1 className="font-light text-3xl my-8">Popular Creators</h1>
        <ul className="flex gap-6 flex-wrap mx-auto justify-center">
          {data.playlists.slice(0, 8).map((playlist) => (
            <li key={playlist.id} className="w-1/5 shrink-0">
              <Link to={`/playlist/${playlist.id}`}>
                <div className="overflow-hidden shadow-lg rounded-lg ">
                  <a href="#" className="w-full block h-full">
                    <img
                      alt={`${playlist.name} Channel Image`}
                      src={playlist.thumbnail}
                      className="max-h-40 w-full object-cover"
                    />
                    <div className="bg-white p-4">
                      <p className="text-2xl font-bold mb-2 text-red-500">
                        {playlist.name}
                      </p>
                      {/* <p className="text-gray-400 font-light text-md">
                        The new supermac is here, 543 cv and 140 000$. This is
                        best racing computer about 7 years on...
                      </p> */}
                    </div>
                  </a>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
