const { PrismaClient, PLAYLIST_TYPE } = require("@prisma/client");
const { google } = require("googleapis");
const { nanoid } = require("nanoid");
const prisma = new PrismaClient();

require("dotenv").config();

const service = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

async function getChannel(name) {
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
  const playlist = await prisma.playlist.create({
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
            id: video.id,
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
  const channels = [
    "LilyPichu",
    "Michael Reeves",
    "Linus Tech Tips",
    "Valkyrae",
    "OfflineTV",
    "Mizkif",
    "Disguised Toast",
    "Pokimane",
    "Ludwig",
    "Mr. Beast",
    "Dream",
    "Jacksepticeye",
    "Blackpink",
    "Justin Bieber",
    "Dude Perfect",
    "Ed Sheeran",
    "Ariana Grande",
    "Taylor Swift",
    "Smosh",

    "The Weeknd",
    "Sodapoppin",
    "Northernlion",
    "Atrioc",
    "Stanz",
    "qtcinderella",
    "Trash Taste",
    "Gigguk",
    "CDawgVA",
    "The Anime Man",
    "Technoblade",
    "TommyInnit",
    "Mark Rober",
    "Dhar Mann",
    "Daily Dose of Internet",
  ];

  let channelPromises = [];
  for (let channel of channels) {
    channelPromises.push(getChannel(channel));
  }

  await Promise.all(channelPromises);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
