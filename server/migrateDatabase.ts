import type { Database } from "better-sqlite3";

export const migrateDatabase = (db: Database) => () => {
  const loadUserVersion = (): number =>
    db.prepare(`PRAGMA "user_version"`).get().user_version;
  const version = loadUserVersion();
  switch (version) {
    case 0: {
      db.exec(/* SQL */ `
CREATE TABLE IF NOT EXISTS "Character" (
    "id" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "maximumHealth" INTEGER NOT NULL DEFAULT 30,
    "currentHealth" INTEGER NOT NULL DEFAULT 30,
    "hasMana" BOOLEAN NOT NULL DEFAULT false,
    "maximumMana" INTEGER NOT NULL DEFAULT 30,
    "currentMana" INTEGER NOT NULL DEFAULT 30,
    "editHash" TEXT NOT NULL,
    "hasFatePoints" BOOLEAN NOT NULL DEFAULT false,
    "maximumFatePoints" INTEGER NOT NULL DEFAULT 2,
    "currentFatePoints" INTEGER NOT NULL DEFAULT 2,
    PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "character.editHash_unique" ON "Character"("editHash");
     `);
    }
  }
};
