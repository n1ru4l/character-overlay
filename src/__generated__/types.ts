// THIS FILE IS AUTO GENERATED DO NOT MANUALLY EDIT
/* eslint-disable */
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
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
