-- CreateEnum
CREATE TYPE "PLAYLIST_TYPE" AS ENUM ('PLAYLIST', 'CHANNEL');

-- CreateTable
CREATE TABLE "Video" (
    "id" SERIAL NOT NULL,
    "youtubeId" TEXT NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "viewCount" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Playlist" (
    "id" TEXT NOT NULL,
    "youtubeId" TEXT,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "type" "PLAYLIST_TYPE" NOT NULL,
    "plays" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Video_playlistId_idx" ON "Video"("playlistId");

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
