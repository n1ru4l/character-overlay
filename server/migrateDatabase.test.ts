import Database from "better-sqlite3";

import { migrateDatabase } from "./migrateDatabase";

const createDB = () => new Database(":memory:");

it("migrateDatabase can be run", () => {
  const db = createDB();
  migrateDatabase(db)();
  db.close();
});
