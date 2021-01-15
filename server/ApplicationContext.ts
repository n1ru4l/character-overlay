import type { Database } from "better-sqlite3";
import type { InMemoryLiveQueryStore } from "@n1ru4l/in-memory-live-query-store";

export type ApplicationContext = {
  db: Database;
  liveQueryStore: InMemoryLiveQueryStore;
};
