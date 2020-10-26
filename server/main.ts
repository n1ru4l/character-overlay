import http from "http";
import { subscribe } from "graphql";
import { createServer } from "graphql-ws";
import { InMemoryLiveQueryStore } from "@n1ru4l/in-memory-live-query-store";
import { schema } from "./schema";
import { rootState } from "./state";

const liveQueryStore = new InMemoryLiveQueryStore();

const server = http.createServer((_, res) => {
  res.writeHead(404);
  res.end();
});

createServer(
  {
    schema,
    context: {
      liveQueryStore,
      state: rootState,
    },
    execute: liveQueryStore.execute,
    subscribe,
  },
  {
    server,
    path: "/graphql",
  }
);

process.once("SIGINT", () => {
  server.close();
});

server.listen(3000, () => {
  console.log("Listening on 0.0.0.0:3000");
});
