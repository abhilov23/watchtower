/*
  Warnings:

  - Added the required column `userId` to the `Website` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Website" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "timeAdded" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Website_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Website" ("id", "timeAdded", "url") SELECT "id", "timeAdded", "url" FROM "Website";
DROP TABLE "Website";
ALTER TABLE "new_Website" RENAME TO "Website";
CREATE TABLE "new_websiteTick" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "response_time_ts" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "websiteTick_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "websiteTick_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_websiteTick" ("id", "regionId", "response_time_ts", "status", "websiteId") SELECT "id", "regionId", "response_time_ts", "status", "websiteId" FROM "websiteTick";
DROP TABLE "websiteTick";
ALTER TABLE "new_websiteTick" RENAME TO "websiteTick";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
