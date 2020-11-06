import {
  Client as UrqlClient,
  dedupExchange,
  cacheExchange,
  subscriptionExchange,
  ExecutionResult,
} from "urql";
import { io } from "socket.io-client";
import { createSocketIOGraphQLClient } from "@n1ru4l/socket-io-graphql-client";

export const createUrqlClient = () => {
  const socket = io();
  const networkInterface = createSocketIOGraphQLClient<ExecutionResult>(socket);

  return new UrqlClient({
    url: "/graphql",
    exchanges: [
      dedupExchange,
      cacheExchange,
      subscriptionExchange({
        enableAllOperations: true,
        forwardSubscription: ({ query: operation, variables }) => ({
          subscribe: (observerLike) => ({
            unsubscribe: networkInterface.execute(
              {
                operation,
                variables,
              },
              observerLike
            ),
          }),
        }),
      }),
    ],
  });
};
