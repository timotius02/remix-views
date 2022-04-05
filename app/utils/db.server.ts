import { PrismaClient } from "@prisma/client";
import { google } from "googleapis";

let db: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

if (process.env.NODE_ENV === "production") {
  db = new PrismaClient();
} else {
  if (!global.__db) {
    global.__db = new PrismaClient();
  }
  db = global.__db;
}

const service = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

import createPlaylist from "./createPlaylist.server";

export { db, service, createPlaylist };
