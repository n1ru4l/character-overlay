// THIS FILE IS AUTO GENERATED DO NOT MANUALLY EDIT
/* eslint-disable */
import * as Types from './__generated__/types';

import gql from 'graphql-tag';
export type CharacterViewFragment = (
  { __typename?: 'Character' }
  & Pick<Types.Character, 'id' | 'name' | 'imageUrl' | 'maximumHealth' | 'currentHealth' | 'hasMana' | 'maximumMana' | 'currentMana' | 'hasFatePoints' | 'maximumFatePoints' | 'currentFatePoints'>
);

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