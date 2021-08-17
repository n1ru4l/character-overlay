/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

declare module "@urql/core" {
  export function gql(
    source: "\n  query CharacterQuery($characterId: ID!) @live {\n    character(id: $characterId) {\n      id\n      ...CharacterViewFragment\n    }\n  }\n"
  ): typeof import("./graphql").CharacterQueryDocument;
  export function gql(
    source: "\n  fragment CharacterViewFragment on Character {\n    id\n    name\n    imageUrl\n    maximumHealth\n    currentHealth\n    hasMana\n    maximumMana\n    currentMana\n    hasFatePoints\n    maximumFatePoints\n    currentFatePoints\n  }\n"
  ): typeof import("./graphql").CharacterViewFragmentFragmentDoc;
  export function gql(
    source: "\n  query CharacterEditorQuery($editHash: ID!) @live {\n    characterEditor(editHash: $editHash) {\n      __typename\n      ... on Error {\n        reason\n      }\n      ... on CharacterEditorView {\n        character {\n          id\n          ...CharacterViewFragment\n        }\n      }\n    }\n  }\n"
  ): typeof import("./graphql").CharacterEditorQueryDocument;
  export function gql(
    source: "\n  mutation UpdateCharacterMutation($input: UpdateCharacterInput!) {\n    updateCharacter(input: $input)\n  }\n"
  ): typeof import("./graphql").UpdateCharacterMutationDocument;
  export function gql(
    source: "\n  mutation CreateCharacterMutation {\n    createCharacter {\n      __typename\n      ... on Error {\n        reason\n      }\n      ... on CreateCharacterSuccess {\n        editHash\n      }\n    }\n  }\n"
  ): typeof import("./graphql").CreateCharacterMutationDocument;
  export function gql(source: string): unknown;

  export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
    TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
}
