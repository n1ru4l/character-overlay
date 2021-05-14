import {
  Client as UrqlClient,
  dedupExchange,
  cacheExchange,
  subscriptionExchange,
  ExecutionResult,
} from "urql";
import { io } from "socket.io-client";
import { createSocketIOGraphQLClient } from "@n1ru4l/socket-io-graphql-client";
import { createApplyLiveQueryPatch } from "@n1ru4l/graphql-live-query-patch";
import { applyAsyncIterableIteratorToSink } from "@n1ru4l/push-pull-async-iterable-iterator";

const APP_VERSION =
  window?.document.querySelector(`[data-version]`)?.getAttribute("content") ??
  null;

export const createUrqlClient = () => {
  const socket = io();
  const networkInterface = createSocketIOGraphQLClient<ExecutionResult>(socket);

  const client = new UrqlClient({
    url: "/graphql",
    exchanges: [
      dedupExchange,
      cacheExchange,
      subscriptionExchange({
        enableAllOperations: true,
        forwardSubscription: ({ query: operation, variables }) => ({
          subscribe: (sink) => ({
            unsubscribe: applyAsyncIterableIteratorToSink(
              createApplyLiveQueryPatch()(
                networkInterface.execute({
                  operation,
                  variables,
                })
              ),
              sink
            ),
          }),
        }),
      }),
    ],
  });

  socket.on("connect", () => {
    socket.emit("handshake", { version: APP_VERSION });
  });
  socket.on("handshake", (payload: unknown) => {
    // @ts-ignore
    if (payload?.success !== true) {
      // There is a new version of the frontend available that we want to use.
      window.location.reload();
    }
  });

  return client;
};
