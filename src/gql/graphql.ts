/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Character = {
  __typename?: "Character";
  currentFatePoints: Scalars["Int"];
  currentHealth: Scalars["Int"];
  currentMana: Scalars["Int"];
  hasFatePoints: Scalars["Boolean"];
  hasMana: Scalars["Boolean"];
  id: Scalars["ID"];
  imageUrl?: Maybe<Scalars["String"]>;
  maximumFatePoints: Scalars["Int"];
  maximumHealth: Scalars["Int"];
  maximumMana: Scalars["Int"];
  name: Scalars["String"];
};

export type CharacterEditor = CharacterEditorView | Error;

export type CharacterEditorView = {
  __typename?: "CharacterEditorView";
  character: Character;
};

export type CharacterUpdateFields = {
  currentFatePoints?: InputMaybe<Scalars["Int"]>;
  currentHealth?: InputMaybe<Scalars["Int"]>;
  currentMana?: InputMaybe<Scalars["Int"]>;
  hasFatePoints?: InputMaybe<Scalars["Boolean"]>;
  hasMana?: InputMaybe<Scalars["Boolean"]>;
  imageUrl?: InputMaybe<Scalars["String"]>;
  maximumFatePoints?: InputMaybe<Scalars["Int"]>;
  maximumHealth?: InputMaybe<Scalars["Int"]>;
  maximumMana?: InputMaybe<Scalars["Int"]>;
  name?: InputMaybe<Scalars["String"]>;
};

export type CreateCharacterResult = CreateCharacterSuccess | Error;

export type CreateCharacterSuccess = {
  __typename?: "CreateCharacterSuccess";
  editHash: Scalars["String"];
};

export type Error = {
  __typename?: "Error";
  reason: Scalars["String"];
};

export type Mutation = {
  __typename?: "Mutation";
  createCharacter: CreateCharacterResult;
  updateCharacter?: Maybe<Scalars["Boolean"]>;
};

export type MutationUpdateCharacterArgs = {
  input: UpdateCharacterInput;
};

export type Query = {
  __typename?: "Query";
  character?: Maybe<Character>;
  characterEditor?: Maybe<CharacterEditor>;
};

export type QueryCharacterArgs = {
  id: Scalars["ID"];
};

export type QueryCharacterEditorArgs = {
  editHash: Scalars["ID"];
};

export type UpdateCharacterInput = {
  editHash: Scalars["String"];
  updates: CharacterUpdateFields;
};

export type CharacterQueryQueryVariables = Exact<{
  characterId: Scalars["ID"];
}>;

export type CharacterQueryQuery = {
  __typename?: "Query";
  character?:
    | ({ __typename?: "Character"; id: string } & {
        " $fragmentRefs": {
          CharacterViewFragmentFragment: CharacterViewFragmentFragment;
          CharacterOverlayFragmentFragment: CharacterOverlayFragmentFragment;
        };
      })
    | null
    | undefined;
};

export type CharacterEditorQueryQueryVariables = Exact<{
  editHash: Scalars["ID"];
}>;

export type CharacterEditorQueryQuery = {
  __typename?: "Query";
  characterEditor?:
    | {
        __typename: "CharacterEditorView";
        character: { __typename?: "Character"; id: string } & {
          " $fragmentRefs": {
            CharacterViewFragmentFragment: CharacterViewFragmentFragment;
          };
        };
      }
    | { __typename: "Error"; reason: string }
    | null
    | undefined;
};

export type UpdateCharacterMutationMutationVariables = Exact<{
  input: UpdateCharacterInput;
}>;

export type UpdateCharacterMutationMutation = {
  __typename?: "Mutation";
  updateCharacter?: boolean | null | undefined;
};

export type CharacterViewFragmentFragment = {
  __typename?: "Character";
  id: string;
  name: string;
  imageUrl?: string | null | undefined;
  maximumHealth: number;
  currentHealth: number;
  hasMana: boolean;
  maximumMana: number;
  currentMana: number;
  hasFatePoints: boolean;
  maximumFatePoints: number;
  currentFatePoints: number;
} & { " $fragmentName": "CharacterViewFragmentFragment" };

export type CharacterOverlayFragmentFragment = {
  __typename?: "Character";
  id: string;
  name: string;
  currentHealth: number;
  maximumHealth: number;
  hasMana: boolean;
  currentMana: number;
  maximumMana: number;
  hasFatePoints: boolean;
  currentFatePoints: number;
  maximumFatePoints: number;
  imageUrl?: string | null | undefined;
} & { " $fragmentName": "CharacterOverlayFragmentFragment" };

export type CreateCharacterMutationMutationVariables = Exact<{
  [key: string]: never;
}>;

export type CreateCharacterMutationMutation = {
  __typename?: "Mutation";
  createCharacter:
    | { __typename: "CreateCharacterSuccess"; editHash: string }
    | { __typename: "Error"; reason: string };
};

export const CharacterViewFragmentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "CharacterViewFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Character" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "imageUrl" } },
          { kind: "Field", name: { kind: "Name", value: "maximumHealth" } },
          { kind: "Field", name: { kind: "Name", value: "currentHealth" } },
          { kind: "Field", name: { kind: "Name", value: "hasMana" } },
          { kind: "Field", name: { kind: "Name", value: "maximumMana" } },
          { kind: "Field", name: { kind: "Name", value: "currentMana" } },
          { kind: "Field", name: { kind: "Name", value: "hasFatePoints" } },
          { kind: "Field", name: { kind: "Name", value: "maximumFatePoints" } },
          { kind: "Field", name: { kind: "Name", value: "currentFatePoints" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CharacterViewFragmentFragment, unknown>;
export const CharacterOverlayFragmentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "CharacterOverlayFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Character" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "currentHealth" } },
          { kind: "Field", name: { kind: "Name", value: "maximumHealth" } },
          { kind: "Field", name: { kind: "Name", value: "hasMana" } },
          { kind: "Field", name: { kind: "Name", value: "currentMana" } },
          { kind: "Field", name: { kind: "Name", value: "maximumMana" } },
          { kind: "Field", name: { kind: "Name", value: "hasFatePoints" } },
          { kind: "Field", name: { kind: "Name", value: "currentFatePoints" } },
          { kind: "Field", name: { kind: "Name", value: "maximumFatePoints" } },
          { kind: "Field", name: { kind: "Name", value: "imageUrl" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CharacterOverlayFragmentFragment, unknown>;
export const CharacterQueryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "CharacterQuery" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "characterId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      directives: [
        { kind: "Directive", name: { kind: "Name", value: "live" } },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "character" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "characterId" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "CharacterViewFragment" },
                },
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "CharacterOverlayFragment" },
                },
              ],
            },
          },
        ],
      },
    },
    ...CharacterViewFragmentFragmentDoc.definitions,
    ...CharacterOverlayFragmentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<CharacterQueryQuery, CharacterQueryQueryVariables>;
export const CharacterEditorQueryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "CharacterEditorQuery" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "editHash" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      directives: [
        { kind: "Directive", name: { kind: "Name", value: "live" } },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "characterEditor" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "editHash" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "editHash" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "__typename" } },
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: { kind: "Name", value: "Error" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "reason" },
                      },
                    ],
                  },
                },
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: { kind: "Name", value: "CharacterEditorView" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "character" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "FragmentSpread",
                              name: {
                                kind: "Name",
                                value: "CharacterViewFragment",
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...CharacterViewFragmentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  CharacterEditorQueryQuery,
  CharacterEditorQueryQueryVariables
>;
export const UpdateCharacterMutationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateCharacterMutation" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "UpdateCharacterInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateCharacter" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateCharacterMutationMutation,
  UpdateCharacterMutationMutationVariables
>;
export const CreateCharacterMutationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreateCharacterMutation" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createCharacter" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "__typename" } },
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: { kind: "Name", value: "Error" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "reason" },
                      },
                    ],
                  },
                },
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: { kind: "Name", value: "CreateCharacterSuccess" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "editHash" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateCharacterMutationMutation,
  CreateCharacterMutationMutationVariables
>;
