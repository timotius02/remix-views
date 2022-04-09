import { Playlist } from "@prisma/client";
import img from "../../public/search.png";
import { json, LoaderFunction } from "@remix-run/node";
import { Form, Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { useState } from "react";
import Navbar from "~/components/Navbar";

type SearchLoaderData = {
  playlists: Playlist[];
};
export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const term = url.searchParams.get("term");

  if (!term) {
    return json({ playlists: [] });
  }
  const results = await db.playlist.findMany({
    where: {
      name: {
        search: term,
      },
    },
  });
  return json({ playlists: results });
};
export default function NewPlaylist() {
  const data = useLoaderData<SearchLoaderData>();
  const [searchParams] = useSearchParams();
  const term = searchParams.getAll("term");
  const [value, setValue] = useState(term[0] ?? "");

  return (
    <div className="bg-gray-800 w-full h-screen">
      <Navbar />
      <Form method="get">
        <div className="bg-white p-6 rounded max-w-3xl mx-auto w-3/4 my-8 flex gap-4">
          <input
            className="flex-1 outline-0"
            type="text"
            placeholder="What are you looking for?"
            value={value}
            name="term"
            onInput={(e) => setValue((e.target as HTMLInputElement).value)}
          />

          <button className="w-6 h-6">
            <img src={img} alt="search icon" />
          </button>
        </div>
      </Form>

      <section className="container mx-auto px-12 flex flex-col gap-4">
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {data.playlists.map((playlist) => (
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

      {/* <div>
        <a
          href="https://www.flaticon.com/free-icons/search"
          title="search icons"
        >
          Search icons created by Catalin Fertu - Flaticon
        </a>
      </div> */}
    </div>
  );
}
