import { App } from "@tinyhttp/app";
import sirv from "sirv";
import { Server } from "socket.io";
import { registerSocketIOGraphQLServer } from "@n1ru4l/socket-io-graphql-server";
import { InMemoryLiveQueryStore } from "@n1ru4l/in-memory-live-query-store";
import { applyLiveQueryPatchDeflator } from "@n1ru4l/graphql-live-query-patch";
import { schema } from "./schema";
import { PrismaClient } from "@prisma/client";
import type { ApplicationContext } from "./ApplicationContext";

const liveQueryStore = new InMemoryLiveQueryStore();
const prisma = new PrismaClient();

// Register Middleware for automatic model invalidation
prisma.$use(async (params, next) => {
  const resultPromise = next(params);

  if (params.action === "update" && params.model) {
    resultPromise.then((res) => {
      if (res?.id) {
        liveQueryStore.invalidate(`${params.model}:${res.id}`);
      }
    });
  }

  return resultPromise;
});

const app = new App();

app.use(sirv("build"));

const PORT = 4000;

const server = app.listen(PORT, () => {
  console.log(`Listening on 0.0.0.0:${PORT}`);
});

const socketServer = new Server(server);

registerSocketIOGraphQLServer({
  socketServer,
  getParameter: () => ({
    execute: (...args) =>
      applyLiveQueryPatchDeflator(liveQueryStore.execute(...args)),
    graphQLExecutionParameter: {
      schema,
      contextValue: {
        liveQueryStore,
        prisma,
      } as ApplicationContext,
    },
  }),
});

process.once("SIGINT", () => {
  server.close();
});
