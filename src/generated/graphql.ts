import gql from "graphql-tag";
import * as Urql from "urql";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: "Query";
  characterEditor?: Maybe<CharacterEditor>;
  character?: Maybe<Character>;
};

export type QueryCharacterEditorArgs = {
  editHash: Scalars["ID"];
};

export type QueryCharacterArgs = {
  id: Scalars["ID"];
};

export type CharacterEditor = CharacterEditorView | Error;

export type CharacterEditorView = {
  __typename?: "CharacterEditorView";
  character: Character;
};

export type Character = {
  __typename?: "Character";
  id: Scalars["ID"];
  name: Scalars["String"];
  imageUrl?: Maybe<Scalars["String"]>;
  currentHealth: Scalars["Int"];
  maximumHealth: Scalars["Int"];
  hasMana: Scalars["Boolean"];
  currentMana: Scalars["Int"];
  maximumMana: Scalars["Int"];
  hasFatePoints: Scalars["Boolean"];
  currentFatePoints: Scalars["Int"];
  maximumFatePoints: Scalars["Int"];
};

export type Error = {
  __typename?: "Error";
  reason: Scalars["String"];
};

export type Mutation = {
  __typename?: "Mutation";
  updateCharacter?: Maybe<Scalars["Boolean"]>;
  createCharacter: CreateCharacterResult;
};

export type MutationUpdateCharacterArgs = {
  input: UpdateCharacterInput;
};

export type UpdateCharacterInput = {
  editHash: Scalars["String"];
  updates: CharacterUpdateFields;
};

export type CharacterUpdateFields = {
  name?: Maybe<Scalars["String"]>;
  maximumHealth?: Maybe<Scalars["Int"]>;
  currentHealth?: Maybe<Scalars["Int"]>;
  hasMana?: Maybe<Scalars["Boolean"]>;
  maximumMana?: Maybe<Scalars["Int"]>;
  currentMana?: Maybe<Scalars["Int"]>;
  hasFatePoints?: Maybe<Scalars["Boolean"]>;
  maximumFatePoints?: Maybe<Scalars["Int"]>;
  currentFatePoints?: Maybe<Scalars["Int"]>;
  imageUrl?: Maybe<Scalars["String"]>;
};

export type CreateCharacterResult = Error | CreateCharacterSuccess;

export type CreateCharacterSuccess = {
  __typename?: "CreateCharacterSuccess";
  editHash: Scalars["String"];
};

export type CharacterEditorQueryVariables = Exact<{
  editHash: Scalars["ID"];
}>;

export type CharacterEditorQuery = { __typename?: "Query" } & {
  characterEditor?: Maybe<
    | ({ __typename: "CharacterEditorView" } & {
        character: { __typename?: "Character" } & Pick<Character, "id"> &
          CharacterViewFragment;
      })
    | ({ __typename: "Error" } & Pick<Error, "reason">)
  >;
};

export type CharacterQueryVariables = Exact<{
  characterId: Scalars["ID"];
}>;

export type CharacterQuery = { __typename?: "Query" } & {
  character?: Maybe<
    { __typename?: "Character" } & Pick<Character, "id"> & CharacterViewFragment
  >;
};

export type CharacterViewFragment = { __typename?: "Character" } & Pick<
  Character,
  | "id"
  | "name"
  | "imageUrl"
  | "maximumHealth"
  | "currentHealth"
  | "hasMana"
  | "maximumMana"
  | "currentMana"
  | "hasFatePoints"
  | "maximumFatePoints"
  | "currentFatePoints"
>;

export type CreateCharacterMutationVariables = Exact<{ [key: string]: never }>;

export type CreateCharacterMutation = { __typename?: "Mutation" } & {
  createCharacter:
    | ({ __typename: "Error" } & Pick<Error, "reason">)
    | ({ __typename: "CreateCharacterSuccess" } & Pick<
        CreateCharacterSuccess,
        "editHash"
      >);
};

export type UpdateCharacterMutationVariables = Exact<{
  input: UpdateCharacterInput;
}>;

export type UpdateCharacterMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "updateCharacter"
>;

export const CharacterViewFragmentDoc = gql`
  fragment CharacterViewFragment on Character {
    id
    name
    imageUrl
    maximumHealth
    currentHealth
    hasMana
    maximumMana
    currentMana
    hasFatePoints
    maximumFatePoints
    currentFatePoints
  }
`;
export const CharacterEditorQueryDocument = gql`
  query CharacterEditorQuery($editHash: ID!) @live {
    characterEditor(editHash: $editHash) {
      __typename
      ... on Error {
        reason
      }
      ... on CharacterEditorView {
        character {
          id
          ...CharacterViewFragment
        }
      }
    }
  }
  ${CharacterViewFragmentDoc}
`;

export function useCharacterEditorQueryQuery(
  options: Omit<Urql.UseQueryArgs<CharacterEditorQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<CharacterEditorQuery>({
    query: CharacterEditorQueryDocument,
    ...options,
  });
}
export const CharacterQueryDocument = gql`
  query CharacterQuery($characterId: ID!) @live {
    character(id: $characterId) {
      id
      ...CharacterViewFragment
    }
  }
  ${CharacterViewFragmentDoc}
`;

export function useCharacterQueryQuery(
  options: Omit<Urql.UseQueryArgs<CharacterQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<CharacterQuery>({
    query: CharacterQueryDocument,
    ...options,
  });
}
export const CreateCharacterMutationDocument = gql`
  mutation CreateCharacterMutation {
    createCharacter {
      __typename
      ... on Error {
        reason
      }
      ... on CreateCharacterSuccess {
        editHash
      }
    }
  }
`;

export function useCreateCharacterMutationMutation() {
  return Urql.useMutation<
    CreateCharacterMutation,
    CreateCharacterMutationVariables
  >(CreateCharacterMutationDocument);
}
export const UpdateCharacterMutationDocument = gql`
  mutation UpdateCharacterMutation($input: UpdateCharacterInput!) {
    updateCharacter(input: $input)
  }
`;

export function useUpdateCharacterMutationMutation() {
  return Urql.useMutation<
    UpdateCharacterMutation,
    UpdateCharacterMutationVariables
  >(UpdateCharacterMutationDocument);
}
