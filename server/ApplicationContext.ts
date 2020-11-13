import type { PrismaClient } from "@prisma/client";
import type { InMemoryLiveQueryStore } from "@n1ru4l/in-memory-live-query-store";

export type ApplicationContext = {
  prisma: PrismaClient;
  liveQueryStore: InMemoryLiveQueryStore;
};
