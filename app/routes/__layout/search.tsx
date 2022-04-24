import { Playlist, PLAYLIST_TYPE } from "@prisma/client";
import img from "../../../public/search.png";
import { json, LoaderFunction } from "@remix-run/node";
import { Form, Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { useState } from "react";
import { Prisma } from "@prisma/client";
import Pagination from "~/components/Pagination";
import DropDown, { PlaylistType } from "~/components/Dropdown";

const SEARCH_PAGE_SIZE = 25;

type SearchLoaderData = {
  playlists: Playlist[];
  page: number;
  prev: string | null;
  next: string | null;
};
export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const term = url.searchParams.get("term");
  const page = parseInt(url.searchParams.get("page") || "1");
  const type = url.searchParams.get("type") as PlaylistType;
  let where = {};

  if (type && type !== "All") {
    where = {
      type: {
        equals:
          type === "Playlists" ? PLAYLIST_TYPE.PLAYLIST : PLAYLIST_TYPE.CHANNEL,
      },
    };
  }
  if (term) {
    where = {
      name: {
        search: term,
      },
      ...where,
    };
  }

  let query: Prisma.PlaylistFindManyArgs = {
    skip: (page - 1) * SEARCH_PAGE_SIZE,
    take: SEARCH_PAGE_SIZE + 1,
    where,
  };

  const results = await db.playlist.findMany(query);

  let prev, next;
  if (page !== 1) {
    url.searchParams.set("page", (page - 1).toString());
    prev = url.pathname + url.search;
    url.searchParams.set("page", page.toString());
  }

  if (results.length > SEARCH_PAGE_SIZE) {
    url.searchParams.set("page", (page + 1).toString());
    next = url.pathname + url.search;
    results.pop();
  }

  return json({ playlists: results, page, next, prev });
};
export default function NewPlaylist() {
  const data = useLoaderData<SearchLoaderData>();
  const [searchParams] = useSearchParams();
  const term = searchParams.getAll("term");
  const [value, setValue] = useState(term[0] ?? "");

  const type = searchParams.getAll("type") as PlaylistType[];
  const [selectedType, setSelectedType] = useState<PlaylistType>(
    (type[0] as PlaylistType) ?? "All"
  );

  return (
    <>
      <Form method="get">
        <div className="bg-white p-6 rounded max-w-3xl mx-auto w-3/4 my-8 flex items-center gap-4">
          <input
            className="flex-1 outline-0"
            type="text"
            placeholder="Search"
            value={value}
            name="term"
            onInput={(e) => setValue((e.target as HTMLInputElement).value)}
          />
          <input type="hidden" name="type" value={selectedType} />
          <DropDown
            value={selectedType}
            onChange={(type) => setSelectedType(type)}
          />
          <button className="w-6 h-6">
            <img src={img} alt="search icon" />
          </button>
        </div>
      </Form>

      <section className="flex-1 container mx-auto px-12 flex flex-col justify-between">
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
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
        <Pagination page={data.page} prev={data.prev} next={data.next} />
      </section>
    </>
  );
}
