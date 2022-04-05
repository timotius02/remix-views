import { PLAYLIST_TYPE } from "@prisma/client";
import { youtube_v3 } from "googleapis";
import { nanoid } from "nanoid";
import { db, service } from "~/utils/db.server";

type createaPlaylistInput = {
  playlistId: string;
  playlistName: string;
  playlistThumbnails: youtube_v3.Schema$ThumbnailDetails;
  playlistType: PLAYLIST_TYPE;
  maxResults?: number;
};
export default async function createPlaylist({
  playlistId,
  playlistName,
  playlistThumbnails,
  playlistType,
  maxResults = 50,
}: createaPlaylistInput) {
  const videosResults = await service.playlistItems.list({
    part: ["snippet"],
    playlistId,
    maxResults,
  });

  const videoIds = (videosResults?.data?.items?.map(
    (item) => item?.snippet?.resourceId?.videoId
  ) as string[]) ?? [""];

  const videos = await service.videos.list({
    part: ["snippet", "contentDetails", "statistics"],
    id: videoIds,
  });

  const playlist = await db.playlist.create({
    data: {
      id: nanoid(),
      name: playlistName,
      youtubeId: playlistId,
      createdAt: new Date(),
      thumbnail: playlistThumbnails.standard
        ? playlistThumbnails.standard.url!
        : playlistThumbnails.high!.url!,
      type: playlistType,
      videos: {
        create: videos!.data!.items!.map((video) => {
          const thumbnails = video!.snippet!.thumbnails;
          return {
            id: video.id!,
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
