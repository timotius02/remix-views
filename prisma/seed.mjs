import { PrismaClient, PLAYLIST_TYPE } from "@prisma/client";
import { google } from "googleapis";
import { nanoid } from "nanoid";
import { channels } from "./channels.mjs";
import 'dotenv/config';

const prisma = new PrismaClient();

const service = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

async function getChannel(name) {
  console.log(`Getting videos from ${name}`);
  const searchResult = await service.search.list({
    part: ["snippet"],
    q: name,
    maxResults: 1,
    type: "channel",
  });

  const channelId = searchResult.data.items[0].snippet.channelId;
  const channelTitle = searchResult.data.items[0].snippet.channelTitle;
  const playlistId = `UU${channelId.substring(2)}`;

  const videosResults = await service.playlistItems.list({
    part: ["snippet"],
    playlistId,
    maxResults: 50,
  });

  const videoIds = videosResults.data.items
    .map((item) => item.snippet.resourceId.videoId)
    .join(",");

  const videos = await service.videos.list({
    part: ["snippet,statistics"],
    id: videoIds,
  });

  let playlistThumbnails = searchResult.data.items[0].snippet.thumbnails;
  await prisma.playlist.create({
    data: {
      id: nanoid(),
      name: channelTitle,
      youtubeId: playlistId,
      createdAt: new Date(),
      thumbnail: playlistThumbnails.standard
        ? playlistThumbnails.standard.url
        : playlistThumbnails.high.url,
      type: PLAYLIST_TYPE.CHANNEL,
      videos: {
        create: videos.data.items.map((video) => {
          const thumbnails = video.snippet.thumbnails;
          return {
            youtubeId: video.id,
            title: video.snippet.title,
            viewCount: video.statistics.viewCount,
            thumbnail: thumbnails.standard
              ? thumbnails.standard.url
              : thumbnails.high.url,
          };
        }),
      },
    },
  });
}

async function main() {
  for (let channel of channels) {
    await getChannel(channel);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
