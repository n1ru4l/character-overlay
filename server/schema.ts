import { createTypesFactory, buildGraphQLSchema } from "gqtx";
import { specifiedDirectives } from "graphql";
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
    t.field("currentHealth", {
      type: t.NonNull(t.Int),
      resolve: (character) => character.currentHealth,
    }),
    t.field("maximumHealth", {
      type: t.NonNull(t.Int),
      resolve: (character) => character.maximumHealth,
    }),
    t.field("hasMana", {
      type: t.NonNull(t.Boolean),
      resolve: (character) => character.hasMana,
    }),
    t.field("currentMana", {
      type: t.NonNull(t.Int),
      resolve: (character) => character.currentMana,
    }),
    t.field("maximumMana", {
      type: t.NonNull(t.Int),
      resolve: (character) => character.maximumMana,
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

const GraphQLCharacterUpdateFields = t.inputObjectType({
  name: "CharacterUpdateFields",
  fields: () => ({
    name: t.arg(t.String),
    maximumHealth: t.arg(t.Int),
    currentHealth: t.arg(t.Int),
    hasMana: t.arg(t.Boolean),
    maximumMana: t.arg(t.Int),
    currentMana: t.arg(t.Int),
    imageUrl: t.arg(t.String),
  }),
});

const GraphQLUpdateCharacterInput = t.inputObjectType({
  name: "UpdateCharacterInput",
  fields: () => ({
    editHash: t.arg(t.NonNullInput(t.String)),
    updates: t.arg(t.NonNullInput(GraphQLCharacterUpdateFields)),
  }),
});

const Mutation = t.mutationType({
  name: "Mutation",
  fields: () => [
    t.field("updateCharacter", {
      type: t.Boolean,
      args: {
        input: t.arg(t.NonNullInput(GraphQLUpdateCharacterInput)),
      },
      resolve: async (_, args, context) => {
        await context.prisma.character.update({
          where: {
            editHash: args.input.editHash,
          },
          data: {
            name: args.input.updates.name ?? undefined,
            maximumHealth: args.input.updates.maximumHealth ?? undefined,
            currentHealth: args.input.updates.currentHealth ?? undefined,
            hasMana: args.input.updates.hasMana ?? undefined,
            maximumMana: args.input.updates.maximumMana ?? undefined,
            currentMana: args.input.updates.currentMana ?? undefined,
            imageUrl: args.input.updates.imageUrl ?? undefined,
          },
        });
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
              name: "John Wayne",
              imageUrl:
                "https://i.pinimg.com/236x/a1/51/44/a151443dadd6fee73bf8c460ebc2854d--character-portraits-character-ideas.jpg",
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
  directives: [...specifiedDirectives, GraphQLLiveDirective],
});
// https://logomakr.com/6iAK0C
