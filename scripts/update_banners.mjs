
import { PrismaClient, PLAYLIST_TYPE } from "@prisma/client";
import { google } from "googleapis";
import 'dotenv/config';

const prisma = new PrismaClient();

const service = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

async function main() {
  try {
    const channels = await prisma.playlist.findMany({
      where: {
        type: PLAYLIST_TYPE.CHANNEL,
      },
      select: {
        id: true,
        youtubeId: true,
        name: true,
        thumbnail: true
      }
    });

    const failedThumbnails = [];

    for (let channel of channels) {
      try {
        const response = await fetch(channel.thumbnail);
        if (!response.ok) {
          throw new Error(`Failed to fetch thumbnail: ${response.statusText}`);
        }
      } catch (error) {
        console.log(`Thumbnail check failed for channel: ${channel.name}`);
        failedThumbnails.push(channel);
      }

    }

    if (failedThumbnails.length > 0) {
      console.log('Updating failed thumbnails using YouTube API...');
      for (const channel of failedThumbnails) {
        try {
          // Replace with your logic to call the YouTube API and fetch updated details
          const results = await service.channels.list({
            part: ["snippet"],
            id: `UC${channel.youtubeId.substring(2)}`,
          })

          const thumbnails = results.data.items[0].snippet.thumbnails;

          // Update the channel's thumbnail in the database
          await prisma.playlist.update({
            where: { id: channel.id },
            data: {
              thumbnail: thumbnails.standard
              ? thumbnails.standard.url
              : thumbnails.high.url,
            }
          });

          console.log(`Updated thumbnail for channel: ${channel.name}`);
        } catch (error) {
          console.error(`Failed to update thumbnail for channel: ${channel.name}`, error);
        }
      }
    } else {
      console.log('No failed thumbnails found.');
    }


  } catch (error) {
    console.error('Error updating banner:', error);
  } finally {
    await prisma.$disconnect();
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

