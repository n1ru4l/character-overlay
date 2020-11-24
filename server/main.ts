import { App } from "@tinyhttp/app";
import multer from "multer";
import path from "path";
import sirv from "sirv";
import { Server } from "socket.io";
import { registerSocketIOGraphQLServer } from "@n1ru4l/socket-io-graphql-server";
import { InMemoryLiveQueryStore } from "@n1ru4l/in-memory-live-query-store";
import { createApplyLiveQueryPatchGenerator } from "@n1ru4l/graphql-live-query-patch";
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

const uploadDirectory = process.env.UPLOAD_DIRECTORY ?? process.cwd();
const app = new App();

const uploads = multer({ dest: path.join(uploadDirectory, "uploads") });

app
  .use(
    "/uploads",
    sirv(uploadDirectory, {
      dev: true,
    })
  )
  .post("/upload", async (req, res) => {
    const cb = uploads.single("avatar");
    cb(req as any, res as any, (err: unknown) => {
      if (err instanceof multer.MulterError) {
        res.writeHead(500);
        res.end("A Multer error occurred when uploading.");
      } else if (err) {
        res.writeHead(500);
        res.end("An unknown error occurred when uploading.");
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end("/uploads/" + (req as any).file.filename);
      }
    });
  })
  .use(sirv("build"));

const PORT = 4000;

const server = app.listen(PORT, () => {
  console.log(`Listening on 0.0.0.0:${PORT}`);
});

const socketServer = new Server(server);

registerSocketIOGraphQLServer({
  socketServer,
  getParameter: () => ({
    execute: (...args) =>
      createApplyLiveQueryPatchGenerator()(liveQueryStore.execute(...args)),
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
