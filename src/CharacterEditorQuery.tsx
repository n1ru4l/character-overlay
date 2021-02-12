// THIS FILE IS AUTO GENERATED DO NOT MANUALLY EDIT
/* eslint-disable */
import * as Types from './__generated__/types';

import { CharacterViewFragment } from './CharacterViewFragment';
import gql from 'graphql-tag';
import { CharacterViewFragmentDoc } from './CharacterViewFragment';
import * as Urql from 'urql';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type CharacterEditorQueryVariables = Types.Exact<{
  editHash: Types.Scalars['ID'];
}>;


export type CharacterEditorQuery = (
  { __typename?: 'Query' }
  & { characterEditor?: Types.Maybe<(
    { __typename: 'CharacterEditorView' }
    & { character: (
      { __typename?: 'Character' }
      & Pick<Types.Character, 'id'>
      & CharacterViewFragment
    ) }
  ) | (
    { __typename: 'Error' }
    & Pick<Types.Error, 'reason'>
  )> }
);


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
    ${CharacterViewFragmentDoc}`;

export function useCharacterEditorQueryQuery(options: Omit<Urql.UseQueryArgs<CharacterEditorQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<CharacterEditorQuery>({ query: CharacterEditorQueryDocument, ...options });
};