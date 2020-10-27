import { createTypesFactory, buildGraphQLSchema } from "gqtx";
import crypto from "crypto";
import { GraphQLLiveDirective } from "@n1ru4l/graphql-live-query";
import type { ApplicationContext } from "./ApplicationContext";
import type { Character } from "@prisma/client";

const createUniqueId = () => crypto.randomBytes(16).toString("hex");

const t = createTypesFactory<ApplicationContext>();

const GraphQLErrorType = t.objectType<{
  type: "Error";
  reason: string;
}>({
  name: "Error",
  fields: () => [
    t.field("reason", {
      type: t.NonNull(t.String),
      resolve: (error) => error.reason,
    }),
  ],
});

const Health = t.objectType<{ maximum: number; current: number }>({
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

const GraphQLCharacterType = t.objectType<Character>({
  name: "Character",
  fields: () => [
    t.field("id", {
      type: t.NonNull(t.ID),
      resolve: (character) => character.id,
    }),
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
      resolve: (character) => ({
        maximum: character.maximumHealth,
        current: character.currentHealth,
      }),
    }),
    t.field("mana", {
      type: Health,
      resolve: (character) =>
        character.hasMana
          ? {
              maximum: character.maximumMana,
              current: character.currentMana,
            }
          : null,
    }),
  ],
});

const CharacterEditorView = t.objectType<{
  type: "CharacterEditorView";
  character: Character;
}>({
  name: "CharacterEditorView",
  fields: () => [
    t.field("character", {
      type: t.NonNull(GraphQLCharacterType),
      resolve: (source) => source.character,
    }),
  ],
});

const GraphQLCharacterEditorType = t.unionType<{
  type: "Error" | "CharacterEditorView";
}>({
  name: "CharacterEditor",
  types: [CharacterEditorView, GraphQLErrorType],
  resolveType: (source) => {
    switch (source.type) {
      case "Error":
        return GraphQLErrorType;
      case "CharacterEditorView":
        return CharacterEditorView;
    }
  },
});

const Query = t.queryType({
  name: "Query",
  fields: [
    t.field("characterEditor", {
      type: GraphQLCharacterEditorType,
      args: {
        editHash: t.arg(t.NonNullInput(t.ID)),
      },
      resolve: async (_, args, context) => {
        const character = await context.prisma.character.findOne({
          where: { editHash: args.editHash },
        });

        if (character === null) {
          return {
            type: "Error" as const,
            reason: "Could not find the given character.",
          };
        }

        return {
          type: "CharacterEditorView" as const,
          character,
        };
      },
    }),
    t.field("character", {
      type: GraphQLCharacterType,
      args: {
        id: t.arg(t.NonNullInput(t.ID)),
      },
      resolve: async (_, args, context) => {
        const character = await context.prisma.character.findOne({
          where: { id: args.id },
        });
        return character;
      },
    }),
  ],
});

const CreateCharacterSuccess = t.objectType<{
  type: "CreateCharacterSuccess";
  character: Character;
}>({
  name: "CreateCharacterSuccess",
  fields: () => [
    t.field("editHash", {
      type: t.NonNull(t.String),
      resolve: (source) => source.character.editHash,
    }),
  ],
});

const CreateCharacterResult = t.unionType<{
  type: "Error" | "CreateCharacterSuccess";
}>({
  name: "CreateCharacterResult",
  types: [GraphQLErrorType, CreateCharacterSuccess],
  resolveType: (source) => {
    switch (source.type) {
      case "Error":
        return GraphQLErrorType;
      case "CreateCharacterSuccess":
        return CreateCharacterSuccess;
    }
  },
});

const Mutation = t.mutationType({
  name: "Mutation",
  fields: () => [
    t.field("characterSetMaximumHealth", {
      type: t.Boolean,
      args: {
        editHash: t.arg(t.NonNullInput(t.String)),
        newMaximumHealth: t.arg(t.NonNullInput(t.Int)),
      },
      resolve: async (_, args, context) => {
        const character = await context.prisma.character.update({
          where: {
            editHash: args.editHash,
          },
          data: {
            maximumHealth: args.newMaximumHealth,
          },
        });
        context.liveQueryStore.invalidate(`Character:${character.id}`);
        return null;
      },
    }),
    t.field("characterSetCurrentHealth", {
      type: t.Boolean,
      args: {
        editHash: t.arg(t.NonNullInput(t.String)),
        newCurrentHealth: t.arg(t.NonNullInput(t.Int)),
      },
      resolve: async (_, args, context) => {
        const character = await context.prisma.character.update({
          where: {
            editHash: args.editHash,
          },
          data: {
            currentHealth: args.newCurrentHealth,
          },
        });
        context.liveQueryStore.invalidate(`Character:${character.id}`);
        return null;
      },
    }),
    t.field("setCharacterImage", {
      type: t.Boolean,
      args: {
        editHash: t.arg(t.NonNullInput(t.String)),
        imageUrl: t.arg(t.NonNullInput(t.String)),
      },
      resolve: (_, args, context) => {
        context.liveQueryStore.invalidate("Query.character");
        return null;
      },
    }),
    t.field("characterSetName", {
      type: t.Boolean,
      args: {
        editHash: t.arg(t.NonNullInput(t.String)),
        newName: t.arg(t.NonNullInput(t.String)),
      },
      resolve: async (_, args, context) => {
        const character = await context.prisma.character.update({
          where: {
            editHash: args.editHash,
          },
          data: {
            name: args.newName,
          },
        });
        context.liveQueryStore.invalidate(`Character:${character.id}`);
        return null;
      },
    }),
    t.field("createCharacter", {
      type: t.NonNull(CreateCharacterResult),
      resolve: async (_, __, context) => {
        try {
          const character = await context.prisma.character.create({
            data: {
              id: createUniqueId(),
              name: "Peter Parker",
              imageUrl:
                "https://upload.wikimedia.org/wikipedia/en/3/3b/SpongeBob_SquarePants_character.svg",
              editHash: createUniqueId(),
            },
          });
          return {
            type: "CreateCharacterSuccess" as const,
            character,
          };
        } catch (err) {
          console.error(err);
          return {
            type: "Error" as const,
            reason: "Somethign unexpected happened. Please try again.",
          };
        }
      },
    }),
  ],
});

export const schema = buildGraphQLSchema({
  query: Query,
  mutation: Mutation,
  directives: [GraphQLLiveDirective],
});
