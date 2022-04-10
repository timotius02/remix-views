import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { useState } from "react";
import Navbar from "~/components/Navbar";
import { service, createPlaylist } from "~/utils/db.server";
import ReCAPTCHA from "react-google-recaptcha";

async function validateHuman(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET;
  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
    {
      method: "POST",
    }
  );
  const data = await response.json();
  return data.success;
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const token = formData.get("token") as string;
  const human = await validateHuman(token);
  if (!human) {
    return json({ message: "Bot detected. Unauthorized" }, { status: 401 });
  }

  const playlistUrl = formData.get("playlistUrl") as string;
  if (!playlistUrl || !playlistUrl.includes("youtube.com/playlist?list=")) {
    return json(
      { message: "Please Provide a valid Playlist URL" },
      { status: 400 }
    );
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
  return json(
    { message: "Invalid Playlist URL. Remember Playlist URL must be Public." },
    { status: 400 }
  );
};

export const loader: LoaderFunction = async () => {
  return {
    RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
  };
};

export default function NewPlaylist() {
  const data = useLoaderData();
  const [input, setInput] = useState("");
  const error = useActionData();
  const [token, setToken] = useState("");
  const transition = useTransition();

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
          <label htmlFor="playlistUrl">Playlist URL</label>
          <input
            className="flex-1 border-b-2 border-gray-400 p-2"
            type="text"
            id="playlistUrl"
            name="playlistUrl"
            placeholder="https://www.youtube.com/playlist?list=..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            required
          />
          {error && <span className="text-red-500">{error.message}</span>}
          <ReCAPTCHA
            style={{ display: "inline-block", width: 304 }}
            className="self-center"
            sitekey={data.RECAPTCHA_SITE_KEY}
            onChange={(val) => setToken(val as string)}
          />
          <input type="hidden" name="token" value={token} />
          <button
            className="px-4 py-2 rounded-lg bg-red-500 text-white disabled:opacity-50"
            disabled={input === "" || transition.state !== "idle"}
          >
            {transition.state === "idle" ? "Submit" : transition.state}
          </button>
        </Form>
      </div>
    </>
  );
}
