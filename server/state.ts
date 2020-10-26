export const rootState = {
  character: {
    name: "Der unglaubliche Hans",
    health: {
      maximum: 39,
      current: 27,
    },
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/3/3b/SpongeBob_SquarePants_character.svg" as
      | null
      | string,
  },
};

export type State = typeof rootState;
