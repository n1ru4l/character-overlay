import {
  Client as UrqlClient,
  dedupExchange,
  cacheExchange,
  subscriptionExchange,
} from "urql";
import { createClient as createWSClient } from "graphql-ws";

export const createUrqlClient = () => {
  const ws = createWSClient({
    url: "ws://localhost:3000/graphql",
  });

  return new UrqlClient({
    url: "/graphql",
    exchanges: [
      dedupExchange,
      cacheExchange,
      subscriptionExchange({
        enableAllOperations: true,
        forwardSubscription: (operation) => ({
          subscribe: (observerLike) => ({
            unsubscribe: ws.subscribe(operation as any, {
              ...observerLike,
            }),
          }),
        }),
      }),
    ],
  });
};
