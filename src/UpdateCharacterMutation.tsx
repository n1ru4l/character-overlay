// THIS FILE IS AUTO GENERATED DO NOT MANUALLY EDIT
/* eslint-disable */
import * as Types from './__generated__/types';

import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type UpdateCharacterMutationVariables = Types.Exact<{
  input: Types.UpdateCharacterInput;
}>;


export type UpdateCharacterMutation = (
  { __typename?: 'Mutation' }
  & Pick<Types.Mutation, 'updateCharacter'>
);


export const UpdateCharacterMutationDocument = gql`
    mutation UpdateCharacterMutation($input: UpdateCharacterInput!) {
  updateCharacter(input: $input)
}
    `;

export function useUpdateCharacterMutationMutation() {
  return Urql.useMutation<UpdateCharacterMutation, UpdateCharacterMutationVariables>(UpdateCharacterMutationDocument);
};