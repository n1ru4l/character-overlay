import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
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
  __typename?: 'Query';
  characterEditor?: Maybe<CharacterEditor>;
  character?: Maybe<Character>;
};


export type QueryCharacterEditorArgs = {
  editHash: Scalars['ID'];
};


export type QueryCharacterArgs = {
  id: Scalars['ID'];
};

export type CharacterEditor = CharacterEditorView | Error;

export type CharacterEditorView = {
  __typename?: 'CharacterEditorView';
  character: Character;
};

export type Character = {
  __typename?: 'Character';
  id: Scalars['ID'];
  name: Scalars['String'];
  imageUrl?: Maybe<Scalars['String']>;
  health: Health;
  mana?: Maybe<Health>;
};

export type Health = {
  __typename?: 'Health';
  maximum: Scalars['Int'];
  current: Scalars['Int'];
};

export type Error = {
  __typename?: 'Error';
  reason: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  setMaximumHealth?: Maybe<Scalars['Boolean']>;
  setCurrentHealth?: Maybe<Scalars['Boolean']>;
  setCharacterImage?: Maybe<Scalars['Boolean']>;
  characterSetName?: Maybe<Scalars['Boolean']>;
  createCharacter: CreateCharacterResult;
};


export type MutationSetMaximumHealthArgs = {
  editHash: Scalars['String'];
  newMaximumHealth: Scalars['Int'];
};


export type MutationSetCurrentHealthArgs = {
  editHash: Scalars['String'];
  newCurrentHealth: Scalars['Int'];
};


export type MutationSetCharacterImageArgs = {
  editHash: Scalars['String'];
  imageUrl: Scalars['String'];
};


export type MutationCharacterSetNameArgs = {
  editHash: Scalars['String'];
  newName: Scalars['String'];
};

export type CreateCharacterResult = Error | CreateCharacterSuccess;

export type CreateCharacterSuccess = {
  __typename?: 'CreateCharacterSuccess';
  editHash: Scalars['String'];
};

export type CharacterEditorQueryVariables = Exact<{
  editHash: Scalars['ID'];
}>;


export type CharacterEditorQuery = (
  { __typename?: 'Query' }
  & { characterEditor?: Maybe<(
    { __typename: 'CharacterEditorView' }
    & { character: (
      { __typename?: 'Character' }
      & Pick<Character, 'id'>
      & CharacterFragment
    ) }
  ) | (
    { __typename: 'Error' }
    & Pick<Error, 'reason'>
  )> }
);

export type CharacterFragment = (
  { __typename?: 'Character' }
  & Pick<Character, 'id' | 'name' | 'imageUrl'>
  & { health: (
    { __typename?: 'Health' }
    & Pick<Health, 'maximum' | 'current'>
  ), mana?: Maybe<(
    { __typename?: 'Health' }
    & Pick<Health, 'maximum' | 'current'>
  )> }
);

export type CharacterQueryVariables = Exact<{
  characterId: Scalars['ID'];
}>;


export type CharacterQuery = (
  { __typename?: 'Query' }
  & { character?: Maybe<(
    { __typename?: 'Character' }
    & Pick<Character, 'id'>
    & CharacterFragment
  )> }
);

export type CharacterSetNameMutationVariables = Exact<{
  editHash: Scalars['String'];
  newName: Scalars['String'];
}>;


export type CharacterSetNameMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'characterSetName'>
);

export type CreateCharacterMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateCharacterMutation = (
  { __typename?: 'Mutation' }
  & { createCharacter: (
    { __typename: 'Error' }
    & Pick<Error, 'reason'>
  ) | (
    { __typename: 'CreateCharacterSuccess' }
    & Pick<CreateCharacterSuccess, 'editHash'>
  ) }
);

export const CharacterFragment = gql`
    fragment CharacterFragment on Character {
  id
  name
  imageUrl
  health {
    maximum
    current
  }
  mana {
    maximum
    current
  }
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
        ...CharacterFragment
      }
    }
  }
}
    ${CharacterFragment}`;

export function useCharacterEditorQuery(options: Omit<Urql.UseQueryArgs<CharacterEditorQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<CharacterEditorQuery>({ query: CharacterEditorQueryDocument, ...options });
};
export const CharacterQueryDocument = gql`
    query CharacterQuery($characterId: ID!) @live {
  character(id: $characterId) {
    id
    ...CharacterFragment
  }
}
    ${CharacterFragment}`;

export function useCharacterQuery(options: Omit<Urql.UseQueryArgs<CharacterQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<CharacterQuery>({ query: CharacterQueryDocument, ...options });
};
export const CharacterSetNameMutationDocument = gql`
    mutation CharacterSetNameMutation($editHash: String!, $newName: String!) {
  characterSetName(editHash: $editHash, newName: $newName)
}
    `;

export function useCharacterSetNameMutation() {
  return Urql.useMutation<CharacterSetNameMutation, CharacterSetNameMutationVariables>(CharacterSetNameMutationDocument);
};
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

export function useCreateCharacterMutation() {
  return Urql.useMutation<CreateCharacterMutation, CreateCharacterMutationVariables>(CreateCharacterMutationDocument);
};