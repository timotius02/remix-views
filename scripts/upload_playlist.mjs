
import { PrismaClient} from "@prisma/client";
import 'dotenv/config';
import playlists from '../prisma/playlist.json' with { type: "json" };


const prisma = new PrismaClient();

async function uploadPlaylist(data) {
  return await prisma.playlist.create({
    data
  });
}

async function main() {
  for (let playlist of playlists) {
    await uploadPlaylist(playlist);
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

