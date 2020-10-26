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
  character?: Maybe<Character>;
};

export type Character = {
  __typename?: 'Character';
  name: Scalars['String'];
  imageUrl?: Maybe<Scalars['String']>;
  health: Health;
};

export type Health = {
  __typename?: 'Health';
  maximum: Scalars['Int'];
  current: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  setMaximumHealth?: Maybe<Scalars['Boolean']>;
  setCurrentHealth?: Maybe<Scalars['Boolean']>;
  setCharacterImage?: Maybe<Scalars['Boolean']>;
};


export type MutationSetMaximumHealthArgs = {
  newMaximumHealth: Scalars['Int'];
};


export type MutationSetCurrentHealthArgs = {
  newCurrentHealth: Scalars['Int'];
};


export type MutationSetCharacterImageArgs = {
  imageUrl: Scalars['String'];
};

export type AppQueryVariables = Exact<{ [key: string]: never; }>;


export type AppQuery = (
  { __typename?: 'Query' }
  & { character?: Maybe<(
    { __typename?: 'Character' }
    & Pick<Character, 'name' | 'imageUrl'>
    & { health: (
      { __typename?: 'Health' }
      & Pick<Health, 'maximum' | 'current'>
    ) }
  )> }
);


export const AppQueryDocument = gql`
    query AppQuery @live {
  character {
    name
    imageUrl
    health {
      maximum
      current
    }
  }
}
    `;

export function useAppQuery(options: Omit<Urql.UseQueryArgs<AppQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<AppQuery>({ query: AppQueryDocument, ...options });
};