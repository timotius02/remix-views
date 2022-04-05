import { ActionFunction, json, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { service, createPlaylist } from "~/utils/db.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const playlistUrl = formData.get("playlistUrl") as string;
  if (!playlistUrl) {
    return json({
      status: 400,
      body: "Please provide a playlist url",
    });
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
  return redirect("/");
};

export default function NewPlaylist() {
  return (
    <div>
      <Form method="post">
        <label>
          Playlist Url <input name="playlistUrl" type="text" />
        </label>
        <button type="submit">Search</button>
      </Form>
    </div>
  );
}
