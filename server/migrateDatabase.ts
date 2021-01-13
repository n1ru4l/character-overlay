import type { Database } from "better-sqlite3";

export const migrateDatabase = (db: Database) => () => {
  const loadUserVersion = (): number =>
    db.prepare(`PRAGMA "user_version";`).get().user_version;
  const version = loadUserVersion();
  switch (version) {
    case 0: {
      db.exec(/* SQL */ `
CREATE TABLE IF NOT EXISTS "character" (
    "id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "maximum_health" INTEGER NOT NULL DEFAULT 30,
    "current_health" INTEGER NOT NULL DEFAULT 30,
    "has_mana" BOOLEAN NOT NULL DEFAULT false,
    "maximum_mana" INTEGER NOT NULL DEFAULT 30,
    "current_mana" INTEGER NOT NULL DEFAULT 30,
    "edit_hash" TEXT NOT NULL,
    "has_fate_points" BOOLEAN NOT NULL DEFAULT false,
    "maximum_fate_points" INTEGER NOT NULL DEFAULT 2,
    "current_fate_points" INTEGER NOT NULL DEFAULT 2,
    PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "character.edit_hash_unique" ON "character"("edit_hash");
     `);
    }
  }
};
