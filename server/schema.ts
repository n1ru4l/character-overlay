import { createTypesFactory, buildGraphQLSchema } from "gqtx";
import { GraphQLLiveDirective } from "@n1ru4l/graphql-live-query";
import type { InMemoryLiveQueryStore } from "@n1ru4l/in-memory-live-query-store";
import type { State } from "./state";

const t = createTypesFactory<{
  liveQueryStore: InMemoryLiveQueryStore;
  state: State;
}>();

const Health = t.objectType<State["character"]["health"]>({
  name: "Health",
  fields: () => [
    t.field("maximum", {
      type: t.NonNull(t.Int),
      resolve: (health) => health.maximum,
    }),
    t.field("current", {
      type: t.NonNull(t.Int),
      resolve: (health) => health.current,
    }),
  ],
});

const Character = t.objectType<State["character"]>({
  name: "Character",
  fields: () => [
    t.field("name", {
      type: t.NonNull(t.String),
      resolve: (character) => character.name,
    }),
    t.field("imageUrl", {
      type: t.String,
      resolve: (character) => character.imageUrl,
    }),
    t.field("health", {
      type: t.NonNull(Health),
      resolve: (character) => character.health,
    }),
  ],
});

const Query = t.queryType<State>({
  name: "Query",
  fields: [
    t.field("character", {
      type: Character,
      resolve: (_, args, context) => context.state.character,
    }),
  ],
});

const Mutation = t.mutationType({
  name: "Mutation",
  fields: () => [
    t.field("setMaximumHealth", {
      type: t.Boolean,
      args: {
        newMaximumHealth: t.arg(t.NonNullInput(t.Int)),
      },
      resolve: (_, args, context) => {
        context.liveQueryStore.invalidate("Query.character");
        return null;
      },
    }),
    t.field("setCurrentHealth", {
      type: t.Boolean,
      args: {
        newCurrentHealth: t.arg(t.NonNullInput(t.Int)),
      },
      resolve: (_, args, context) => {
        context.liveQueryStore.invalidate("Query.character");
        return null;
      },
    }),
    t.field("setCharacterImage", {
      type: t.Boolean,
      args: {
        imageUrl: t.arg(t.NonNullInput(t.String)),
      },
      resolve: (_, args, context) => {
        context.liveQueryStore.invalidate("Query.character");
        return null;
      },
    }),
  ],
});

export const schema = buildGraphQLSchema({
  query: Query,
  mutation: Mutation,
  directives: [GraphQLLiveDirective],
});
