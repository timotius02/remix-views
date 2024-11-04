import { json, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";

export const loader: LoaderFunction = async ({ params, request }) => {
  const url = new URL(request.url);
  return json({ host: url.protocol + "//" + url.host, id: params.id });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const gameUrl = `${data.host}/playlist/${data.id}`;
  const [copied, setCopied] = useState("Copy");

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="bg-white w-11/12 max-w-2xl p-6 md:p-10 rounded-lg flex flex-col">
        <h1 className="text-3xl sm:text-4xl text-center font-extrabold mb-10">
          Success!
        </h1>
        <p className="text-lg sm:text-xl text-center mb-6">
          Share the link below to share your custom game.
        </p>

        <h3 className="text-lg mb-2">Game URL</h3>
        <div className="flex gap-4 mb-10">
          <input
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none"
            value={gameUrl}
            readOnly
          />
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => {
              navigator.clipboard.writeText(gameUrl);
              setCopied("Copied!");
            }}
          >
            {copied}
          </button>
        </div>

        <Link
          to={`/playlist/${data.id}`}
          className="flex-1 rounded bg-red-500 hover:bg-red-700 text-white text-xl font-bold text-center py-4"
        >
          Start playing!
        </Link>
      </div>
    </div>
  );
}
