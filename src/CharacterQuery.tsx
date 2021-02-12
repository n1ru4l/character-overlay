// THIS FILE IS AUTO GENERATED DO NOT MANUALLY EDIT
/* eslint-disable */
import * as Types from './__generated__/types';

import { CharacterViewFragment } from './CharacterViewFragment';
import gql from 'graphql-tag';
import { CharacterViewFragmentDoc } from './CharacterViewFragment';
import * as Urql from 'urql';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type CharacterQueryVariables = Types.Exact<{
  characterId: Types.Scalars['ID'];
}>;


export type CharacterQuery = (
  { __typename?: 'Query' }
  & { character?: Types.Maybe<(
    { __typename?: 'Character' }
    & Pick<Types.Character, 'id'>
    & CharacterViewFragment
  )> }
);


export const CharacterQueryDocument = gql`
    query CharacterQuery($characterId: ID!) @live {
  character(id: $characterId) {
    id
    ...CharacterViewFragment
  }
}
    ${CharacterViewFragmentDoc}`;

export function useCharacterQueryQuery(options: Omit<Urql.UseQueryArgs<CharacterQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<CharacterQuery>({ query: CharacterQueryDocument, ...options });
};