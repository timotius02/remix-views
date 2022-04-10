import { ActionFunction, json, redirect } from "@remix-run/node";
import { Form, useCatch } from "@remix-run/react";
import { useState } from "react";
import Navbar from "~/components/Navbar";
import { service, createPlaylist } from "~/utils/db.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const playlistUrl = formData.get("playlistUrl") as string;
  if (!playlistUrl) {
    throw new Response("Please Provide a Playlist URL", {
      status: 400,
    });
  } else if (
    !playlistUrl.startsWith("https://www.youtube.com/playlist?list=")
  ) {
    throw new Response("Invalid Playlist URL", { status: 400 });
  }

  const urlParams = new URLSearchParams(playlistUrl.split("?").pop());
  const id = urlParams.get("list");

  if (id !== null) {
    const results = await service.playlists.list({
      part: ["snippet,contentDetails"],
      id: [id],
      maxResults: 1,
    });

    const playlist = results.data.items![0].snippet!;

    const gamePlaylist = await createPlaylist({
      playlistId: id,
      playlistName: playlist.title!,
      playlistThumbnails: playlist.thumbnails!,
      playlistType: "PLAYLIST",
    });

    return redirect(`/playlist/${gamePlaylist.id}`);
  }

  throw new Response("Invalid Playlist URL", { status: 400 });
};

type NewPlaylistProps = {
  error?: string;
};
export default function NewPlaylist({ error }: NewPlaylistProps) {
  const [input, setInput] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | undefined>(error);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setErrorMessage(undefined);
  };
  return (
    <>
      <Navbar />
      <div className="bg-white mt-12 w-11/12 max-w-2xl mx-auto p-6 md:p-10 rounded-lg">
        <h1 className="text-3xl sm:text-4xl text-center font-extrabold mb-2">
          Custom Playlist
        </h1>
        <p className="text-lg sm:text-xl text-center mb-12">
          Create a custom game from any public Youtube Playlist
        </p>
        <Form className="flex flex-col gap-4 text-lg" method="post">
          {/* <div className="flex gap-4 text-lg items-center"> */}
          <label htmlFor="playlistUrl">Playlist URL</label>
          <input
            className="flex-1 border-b-2 border-gray-400 p-2"
            type="text"
            id="playlistUrl"
            name="playlistUrl"
            placeholder="https://www.youtube.com/playlist?list=..."
            value={input}
            onChange={handleInput}
            required
          />
          {errorMessage && <span className="text-red-500">{errorMessage}</span>}
          {/* </div> */}
          <button
            className="px-4 py-2 rounded-lg bg-red-500 text-white disabled:opacity-50"
            disabled={input === ""}
          >
            Submit
          </button>
        </Form>
      </div>
    </>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return <NewPlaylist error={caught.data} />;
}
