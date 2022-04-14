import { nanoid } from "nanoid";
import { db, service } from "~/utils/db.server";

export default async function createPlaylist(id: string) {
  const results = await service.playlists.list({
    part: ["snippet"],
    id: [id],
    maxResults: 1,
  });

  const ytPlaylist = results.data.items![0].snippet!;
  const videosResults = await service.playlistItems.list({
    part: ["snippet"],
    playlistId: id,
    maxResults: 50,
  });

  const videoIds = (videosResults?.data?.items?.map(
    (item) => item?.snippet?.resourceId?.videoId
  ) as string[]) ?? [""];

  const videos = await service.videos.list({
    part: ["snippet", "statistics"],
    id: videoIds,
  });

  const playlist = await db.playlist.create({
    data: {
      id: nanoid(),
      name: ytPlaylist.title!,
      youtubeId: id,
      createdAt: new Date(),
      thumbnail: ytPlaylist.thumbnails!.standard
        ? ytPlaylist.thumbnails!.standard.url!
        : ytPlaylist.thumbnails!.high!.url!,
      type: "PLAYLIST",
      videos: {
        create: videos!.data!.items!.map((video) => {
          const thumbnails = video!.snippet!.thumbnails;
          return {
            youtubeId: video.id!,
            title: video!.snippet!.title!,
            viewCount: video!.statistics!.viewCount!,
            thumbnail: thumbnails!.standard
              ? thumbnails!.standard.url!
              : thumbnails!.high!.url!,
          };
        }),
      },
    },
  });

  return playlist;
}
