/* eslint-disable */
import * as graphql from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
    "\n  query CharacterQuery($characterId: ID!) @live {\n    character(id: $characterId) {\n      id\n      ...CharacterViewFragment\n      ...CharacterOverlayFragment\n    }\n  }\n": graphql.CharacterQueryDocument,
    "\n  query CharacterEditorQuery($editHash: ID!) @live {\n    characterEditor(editHash: $editHash) {\n      __typename\n      ... on Error {\n        reason\n      }\n      ... on CharacterEditorView {\n        character {\n          id\n          ...CharacterViewFragment\n        }\n      }\n    }\n  }\n": graphql.CharacterEditorQueryDocument,
    "\n  mutation UpdateCharacterMutation($input: UpdateCharacterInput!) {\n    updateCharacter(input: $input)\n  }\n": graphql.UpdateCharacterMutationDocument,
    "\n  fragment CharacterViewFragment on Character {\n    id\n    name\n    imageUrl\n    maximumHealth\n    currentHealth\n    hasMana\n    maximumMana\n    currentMana\n    hasFatePoints\n    maximumFatePoints\n    currentFatePoints\n  }\n": graphql.CharacterViewFragmentFragmentDoc,
    "\n  fragment CharacterOverlayFragment on Character {\n    id\n    name\n    currentHealth\n    maximumHealth\n    hasMana\n    currentMana\n    maximumMana\n    hasFatePoints\n    currentFatePoints\n    maximumFatePoints\n    imageUrl\n  }\n": graphql.CharacterOverlayFragmentFragmentDoc,
    "\n  mutation CreateCharacterMutation {\n    createCharacter {\n      __typename\n      ... on Error {\n        reason\n      }\n      ... on CreateCharacterSuccess {\n        editHash\n      }\n    }\n  }\n": graphql.CreateCharacterMutationDocument,
};

export function gql(source: "\n  query CharacterQuery($characterId: ID!) @live {\n    character(id: $characterId) {\n      id\n      ...CharacterViewFragment\n      ...CharacterOverlayFragment\n    }\n  }\n"): (typeof documents)["\n  query CharacterQuery($characterId: ID!) @live {\n    character(id: $characterId) {\n      id\n      ...CharacterViewFragment\n      ...CharacterOverlayFragment\n    }\n  }\n"];
export function gql(source: "\n  query CharacterEditorQuery($editHash: ID!) @live {\n    characterEditor(editHash: $editHash) {\n      __typename\n      ... on Error {\n        reason\n      }\n      ... on CharacterEditorView {\n        character {\n          id\n          ...CharacterViewFragment\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query CharacterEditorQuery($editHash: ID!) @live {\n    characterEditor(editHash: $editHash) {\n      __typename\n      ... on Error {\n        reason\n      }\n      ... on CharacterEditorView {\n        character {\n          id\n          ...CharacterViewFragment\n        }\n      }\n    }\n  }\n"];
export function gql(source: "\n  mutation UpdateCharacterMutation($input: UpdateCharacterInput!) {\n    updateCharacter(input: $input)\n  }\n"): (typeof documents)["\n  mutation UpdateCharacterMutation($input: UpdateCharacterInput!) {\n    updateCharacter(input: $input)\n  }\n"];
export function gql(source: "\n  fragment CharacterViewFragment on Character {\n    id\n    name\n    imageUrl\n    maximumHealth\n    currentHealth\n    hasMana\n    maximumMana\n    currentMana\n    hasFatePoints\n    maximumFatePoints\n    currentFatePoints\n  }\n"): (typeof documents)["\n  fragment CharacterViewFragment on Character {\n    id\n    name\n    imageUrl\n    maximumHealth\n    currentHealth\n    hasMana\n    maximumMana\n    currentMana\n    hasFatePoints\n    maximumFatePoints\n    currentFatePoints\n  }\n"];
export function gql(source: "\n  fragment CharacterOverlayFragment on Character {\n    id\n    name\n    currentHealth\n    maximumHealth\n    hasMana\n    currentMana\n    maximumMana\n    hasFatePoints\n    currentFatePoints\n    maximumFatePoints\n    imageUrl\n  }\n"): (typeof documents)["\n  fragment CharacterOverlayFragment on Character {\n    id\n    name\n    currentHealth\n    maximumHealth\n    hasMana\n    currentMana\n    maximumMana\n    hasFatePoints\n    currentFatePoints\n    maximumFatePoints\n    imageUrl\n  }\n"];
export function gql(source: "\n  mutation CreateCharacterMutation {\n    createCharacter {\n      __typename\n      ... on Error {\n        reason\n      }\n      ... on CreateCharacterSuccess {\n        editHash\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateCharacterMutation {\n    createCharacter {\n      __typename\n      ... on Error {\n        reason\n      }\n      ... on CreateCharacterSuccess {\n        editHash\n      }\n    }\n  }\n"];

export function gql(source: string): unknown;
export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;