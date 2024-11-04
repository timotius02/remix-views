
import { PrismaClient } from "@prisma/client";
import fs from 'fs';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  try {
    // Replace 'tableName' with your specific table name
    const data = await prisma.video.findMany();

    // Write the data to a JSON file
    fs.writeFileSync('video.json', JSON.stringify(data, null, 2), 'utf-8');

    console.log('Data has been successfully downloaded and saved to data.json');
  } catch (error) {
    console.error('Error downloading data:', error);
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

