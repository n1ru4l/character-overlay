import { App } from "@tinyhttp/app";
import multer from "multer";
import fs from "fs";
import path from "path";
import { Server, Socket } from "socket.io";
import serveStatic from "serve-static";
import { registerSocketIOGraphQLServer } from "@n1ru4l/socket-io-graphql-server";
import { InMemoryLiveQueryStore } from "@n1ru4l/in-memory-live-query-store";
import { createApplyLiveQueryPatchGenerator } from "@n1ru4l/graphql-live-query-patch";
import Database from "better-sqlite3";
import { schema } from "./schema";
import type { ApplicationContext } from "./ApplicationContext";
import { migrateDatabase } from "./migrateDatabase";

const liveQueryStore = new InMemoryLiveQueryStore();

const version = process.env.APP_VERSION ?? "__latest__";
const db = new Database(
  process.env.DATABASE_URL ?? path.join(process.cwd(), ".data", "database.db")
);
migrateDatabase(db)();

const uploadDirectory = path.join(
  process.env.STORAGE_DIRECTORY ?? process.cwd(),
  "uploads"
);
const publicDirectory = path.join(process.cwd(), "dist");

const app = new App();

const uploadHandler = multer({ dest: uploadDirectory });
const uploadsServeHandler = serveStatic(uploadDirectory, {
  maxAge: "10y",
});
const staticServeHandler = serveStatic(publicDirectory, {
  maxAge: "10y",
});

const indexHtmlContent = fs
  .readFileSync(path.join(publicDirectory, "index.html"), "utf-8")
  .replace(/__latest__/g, version);

app
  .use("/uploads", (req, res, next) => uploadsServeHandler(req, res, next!))
  .post("/upload", async (req, res) => {
    const cb = uploadHandler.single("avatar");
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
  .get("/", (_, res) => res.send(indexHtmlContent))
  .use((req, res, next) => staticServeHandler(req, res, next!));

const PORT = 4000;

const server = app.listen(PORT, () => {
  console.log(`Listening on 0.0.0.0:${PORT}`);
});

const socketServer = new Server(server);

const graphQLServerLayer = registerSocketIOGraphQLServer({
  socketServer,
  getParameter: () => ({
    execute: (...args) =>
      createApplyLiveQueryPatchGenerator()(liveQueryStore.execute(...args)),
    graphQLExecutionParameter: {
      schema,
      contextValue: {
        liveQueryStore,
        db,
      } as ApplicationContext,
    },
  }),
  isLazy: true,
});

// In order to keep clients in sync with the backend we do a handshake for determining
// whether the client needs a reload (in order to get the updated frontend) or not.
socketServer.on("connection", (socket: Socket) => {
  socket.on("handshake", (payload: unknown) => {
    if (typeof payload === "object" && payload !== null) {
      const clientFrontendVersion = (payload as any).version ?? "unknown";
      let success = false;
      if (clientFrontendVersion === version) {
        graphQLServerLayer.registerSocket(socket);
        success = true;
      }
      socket.emit("handshake", { success });
    }
  });
});

process.once("SIGINT", () => {
  socketServer.close(() => {
    server.close();
  });
});
