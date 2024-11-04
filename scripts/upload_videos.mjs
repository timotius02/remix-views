
import { PrismaClient} from "@prisma/client";
import 'dotenv/config';
import videos from '../prisma/video.json' with { type: "json" };

const prisma = new PrismaClient();

async function uploadVideo(data) {
  return await prisma.video.create({
    data
  });
}

async function main() {
  for (let video of videos) {
    await uploadVideo(video);
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

