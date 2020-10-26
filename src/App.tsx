/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import useHashState from "use-hash-state";
import styled from "@emotion/styled";
import {
  VStack,
  Box,
  Button,
  Flex,
  Heading,
  Input,
  HStack,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/core";
import {
  CharacterFragment,
  useCharacterEditorQuery,
  useCharacterQuery,
  useCreateCharacterMutation,
  useCharacterSetNameMutation,
} from "./generated/graphql";

const CharacterImage = styled.img({
  width: 150,
  height: 150,
  border: "1px solid black",
});

const CharacterName = styled.div({
  fontWeight: "bold",
});

const healthBarWidth = 300;
const healthBarHeight = 30;

const healthGradientColors = ["#ec008c", "#ff0000"];
const manaGradientColors = ["#3c99dc", "#66D3FA"] as const;

const Column = styled.div({});

const ProgressBar = styled.div({
  position: "relative",
  width: healthBarWidth,
  height: healthBarHeight,
  background: "transparent",
  borderRadius: 3,
  border: "2px solid black",
  overflow: "hidden",
});

const ProgressBarProgress = styled.div<{ width: number }>((props) => ({
  width: props.width,
  height: healthBarHeight,
}));

const HealthBarProgress = styled(ProgressBarProgress)({
  backgroundImage: `linear-gradient(160deg, ${healthGradientColors[0]}, ${healthGradientColors[1]})`,
});

const ManaBarProgress = styled(ProgressBarProgress)({
  backgroundImage: `linear-gradient(160deg, ${manaGradientColors[0]}, ${manaGradientColors[1]})`,
});

const ProgressLabel = styled.div({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  paddingRight: 8,
});

const Spacer = styled.div<{ width?: number; height?: number }>((props) => ({
  width: props.width,
  height: props.height,
}));

const CharacterEditor = ({
  editHash,
  setEditHash,
}: {
  editHash: string;
  setEditHash: (hash: string) => void;
}): React.ReactElement => {
  const [data] = useCharacterEditorQuery({
    variables: {
      editHash,
    },
  });

  const [createCharacterState, createCharacter] = useCreateCharacterMutation();

  React.useEffect(() => {
    if (
      createCharacterState.data?.createCharacter.__typename ===
      "CreateCharacterSuccess"
    ) {
      setEditHash(createCharacterState.data.createCharacter.editHash);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createCharacterState.data?.createCharacter]);

  if (editHash === "" || !data.data) {
    return (
      <Flex minHeight="100vh" justifyContent="center" alignItems="center">
        <VStack
          spacing="4"
          maxW="sm"
          minWidth={300}
          borderWidth="1px"
          borderRadius="lg"
          p="6"
        >
          <Heading
            mt="1"
            fontWeight="semibold"
            as="h1"
            lineHeight="tight"
            isTruncated
          >
            OBS Character Info
          </Heading>

          <Box as="p" textAlign="center">
            Create an OBS overlay for your favorite tabeltop role-playing game
            in seconds.
          </Box>

          <Button
            onClick={() => {
              createCharacter();
            }}
            disabled={createCharacterState.fetching}
          >
            Create new Character
          </Button>
        </VStack>
      </Flex>
    );
  }

  switch (data?.data.characterEditor?.__typename) {
    case "Error":
      return <Box>Unexpected Error occured</Box>;
    case "CharacterEditorView": {
      const { character } = data.data.characterEditor;
      return <CharacterOverlay character={character} editHash={editHash} />;
    }
    default:
      return <Box />;
  }
};

export const App = (): React.ReactElement => {
  const { state, setStateAtKey } = useHashState({
    hash: "",
    characterId: "",
  });

  console.log(state);

  if (state.characterId !== "") {
    return <CharacterRenderer characterId={state.characterId} />;
  }

  return (
    <CharacterEditor
      setEditHash={(hash) => setStateAtKey("hash", hash)}
      editHash={state.hash}
    />
  );
};

const CharacterRenderer = ({ characterId }: { characterId: string }) => {
  const [data] = useCharacterQuery({
    variables: {
      characterId,
    },
  });

  if (!data.data?.character) {
    return <Box>Character not found...</Box>;
  }

  return <CharacterOverlay character={data.data.character} editHash="" />;
};

const CharacterOverlay = ({
  character,
  editHash,
}: {
  character: CharacterFragment;
  editHash: string;
}) => {
  const [, saveCharacterName] = useCharacterSetNameMutation();
  const [characterName, setCharacterName] = React.useState(character.name);

  React.useEffect(() => {
    if (editHash === "") {
      return;
    }
    saveCharacterName({
      editHash,
      newName: characterName,
    });
  }, [editHash, characterName, saveCharacterName]);

  return (
    <>
      <HStack spacing="2">
        <Column>
          <CharacterImage src={character.imageUrl ?? ""} />
        </Column>
        <VStack spacing="2">
          <Spacer height={18} />
          {editHash === "" ? (
            <CharacterName>{character.name}</CharacterName>
          ) : (
            <Input
              value={characterName}
              onChange={(ev) => setCharacterName(ev.target.value)}
            />
          )}
          <ProgressBar>
            <HealthBarProgress
              width={
                (character.health.current / character.health.maximum) *
                healthBarWidth
              }
            />
            <ProgressLabel>
              LeP {character.health.current} / {character.health.maximum}
            </ProgressLabel>
          </ProgressBar>
          <Spacer height={4} />
          {character.mana ? (
            <ProgressBar>
              <ManaBarProgress
                width={
                  (character.mana.current / character.mana.maximum) *
                  healthBarWidth
                }
              />
              <ProgressLabel>
                AsP {character.mana.current} / {character.mana.maximum}
              </ProgressLabel>
            </ProgressBar>
          ) : null}
        </VStack>
      </HStack>
      {editHash === "" ? null : (
        <>
          <Box>
            Use the following link for adding the character info as a OBS
            overlay.
          </Box>
          <InputGroup size="md">
            <Input
              pr="4.5rem"
              type={"text"}
              readOnly
              value={
                process.env.PUBLIC_URL ||
                window.location.protocol +
                  "://" +
                  window.location.hostname +
                  (window.location.port ? `:${window.location.port}` : "") +
                  "/#" +
                  encodeURIComponent(
                    JSON.stringify({ characterId: character.id, hash: "" })
                  )
              }
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={() => alert("COPIED")}>
                Copy
              </Button>
            </InputRightElement>
          </InputGroup>
        </>
      )}
    </>
  );
};
