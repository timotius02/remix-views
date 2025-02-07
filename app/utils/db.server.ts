import { PrismaClient } from "@prisma/client";
import { google } from "googleapis";

let db: PrismaClient;

declare global {
  // eslint-disable-next-line no-var
  var  __db: PrismaClient | undefined;
}

if (process.env.NODE_ENV == 'production') {
  db = new PrismaClient();
  db.$connect();
} else {
  if (!global.__db) {
      global.__db = new PrismaClient();
      global.__db.$connect();
  }
  db = global.__db;
}


const service = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

import createPlaylist from "./createPlaylist.server";

export { db, service, createPlaylist };
