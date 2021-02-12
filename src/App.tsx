/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import { Box } from "@chakra-ui/react";
import { useCharacterQueryQuery } from "./CharacterQuery";
import { isNone, isSome, Maybe } from "./Maybe";
import { LandingPage } from "./LandingPage";
import { CharacterEditor } from "./CharacterEditor";
import { CharacterOverlay } from "./CharacterView";

const parseEditHash = (hash: string): Maybe<string> => {
  const result = /edit=(\w*)/.exec(hash);
  if (isNone(result)) {
    return null;
  }
  const [, editHash] = result;
  return editHash;
};

const parseCharacterId = (hash: string): Maybe<string> => {
  const result = /character=(\w*)/.exec(hash);
  if (isNone(result)) {
    return null;
  }
  const [, characterId] = result;
  return characterId;
};

const useRoutingState = () => {
  const [state, setState] = React.useState({
    type: "main",
    data: {},
  } as
    | {
        type: "edit";
        data: {
          editHash: string;
        };
      }
    | {
        type: "main";
        data: {};
      }
    | {
        type: "character";
        data: {
          characterId: string;
        };
      });

  React.useEffect(() => {
    const onHashChange = () => {
      const { hash } = window.location;
      const editHash = parseEditHash(hash);
      if (isSome(editHash)) {
        setState({
          type: "edit",
          data: {
            editHash,
          },
        });
        return;
      }
      const characterId = parseCharacterId(hash);
      if (isSome(characterId)) {
        setState({
          type: "character",
          data: {
            characterId,
          },
        });
        return;
      }
      setState({
        type: "main",
        data: {},
      });
    };
    window.addEventListener("hashchange", onHashChange);
    onHashChange();
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [setState]);

  return state;
};

export const App = (): React.ReactElement => {
  const routingState = useRoutingState();

  if (routingState.type === "character") {
    return <CharacterRenderer characterId={routingState.data.characterId} />;
  } else if (routingState.type === "edit") {
    return <CharacterEditor editHash={routingState.data.editHash} />;
  }
  return <LandingPage />;
};

const CharacterRenderer = ({ characterId }: { characterId: string }) => {
  const [data] = useCharacterQueryQuery({
    variables: {
      characterId,
    },
  });

  if (!data.data?.character) {
    // TODO: Show Character not found view.
    return <Box>Character not found...</Box>;
  }

  return <CharacterOverlay character={data.data.character} size="lg" />;
};
