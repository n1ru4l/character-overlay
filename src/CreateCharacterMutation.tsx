// THIS FILE IS AUTO GENERATED DO NOT MANUALLY EDIT
/* eslint-disable */
import * as Types from './__generated__/types';

import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type CreateCharacterMutationVariables = Types.Exact<{ [key: string]: never; }>;


export type CreateCharacterMutation = (
  { __typename?: 'Mutation' }
  & { createCharacter: (
    { __typename: 'Error' }
    & Pick<Types.Error, 'reason'>
  ) | (
    { __typename: 'CreateCharacterSuccess' }
    & Pick<Types.CreateCharacterSuccess, 'editHash'>
  ) }
);


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
  return Urql.useMutation<CreateCharacterMutation, CreateCharacterMutationVariables>(CreateCharacterMutationDocument);
};