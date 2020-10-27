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
  Text,
  Popover,
  PopoverTrigger,
  Portal,
} from "@chakra-ui/core";
import { darken, transparentize } from "polished";
import { parseIntSafe } from "./number-utilities";
// import FontPicker from "font-picker-react";
import {
  CharacterFragment,
  useCharacterEditorQuery,
  useCharacterQuery,
  useCreateCharacterMutation,
  useCharacterSetNameMutation,
  useCharacterSetCurrentHealthMutation,
  useCharacterSetMaximumHealthMutation,
} from "./generated/graphql";
import { isSome } from "./Maybe";
import { NumPad } from "./NumPad";

const CharacterImage = styled.img({
  width: 150,
  height: 150,
  background: "white",
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
  borderRadius: 3,
  border: `2px solid ${darken(0.1, "#ec008c")}`,
  overflow: "hidden",
  background: transparentize(0.7, "#ec008c"),
  color: "white",
});

const ProgressBarProgress = styled.div<{ width: number }>((props) => ({
  width: props.width,
  height: healthBarHeight,
  transition: "width .6s ease-in-out",
  flexShrink: 0,
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
  const [, saveCurrentHealth] = useCharacterSetCurrentHealthMutation();
  const [, saveMaximumHealth] = useCharacterSetMaximumHealthMutation();
  const [characterName, setCharacterName] = React.useState(character.name);
  const [currentHealth, setCurrentHealth] = React.useState(
    character.health.current
  );
  const [maximumHealth, setMaximumHealth] = React.useState(
    character.health.maximum
  );

  React.useEffect(() => {
    if (editHash === "") {
      return;
    }
    saveCharacterName({
      editHash,
      newName: characterName,
    });
  }, [editHash, characterName, saveCharacterName]);

  React.useEffect(() => {
    if (editHash === "") {
      return;
    }
    saveCurrentHealth({
      editHash,
      newCurrentHealth: currentHealth,
    });
  }, [editHash, currentHealth, saveCurrentHealth]);

  React.useEffect(() => {
    if (editHash === "") {
      return;
    }
    saveMaximumHealth({
      editHash,
      newMaximumHealth: maximumHealth,
    });
  }, [editHash, maximumHealth, saveMaximumHealth]);

  const actualCurrentHealth =
    editHash === "" ? character.health.current : currentHealth;
  const actualMaximumHealth =
    editHash === "" ? character.health.maximum : maximumHealth;

  return (
    <>
      <HStack spacing="2" width="100%">
        <Column>
          <CharacterImage src={character.imageUrl ?? ""} />
        </Column>
        <VStack spacing="2">
          <Spacer height={18} />
          {editHash === "" ? (
            <Text
              color="white"
              fontSize="lg"
              textShadow="-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black"
              width="100%"
            >
              {character.name}
            </Text>
          ) : (
            <Input
              value={characterName}
              onChange={(ev) => setCharacterName(ev.target.value)}
            />
          )}
          <HStack width="100%">
            <ProgressBar>
              <HealthBarProgress
                width={
                  (actualCurrentHealth / actualMaximumHealth) * healthBarWidth
                }
              />
              <ProgressLabel>
                LeP {actualCurrentHealth} / {actualMaximumHealth}
              </ProgressLabel>
            </ProgressBar>
            {editHash === "" ? null : (
              <>
                <Popover>
                  <PopoverTrigger>
                    <Input
                      value={actualCurrentHealth}
                      type="number"
                      onChange={(ev) => {
                        const maybeNumber = parseIntSafe(ev.target.value);
                        if (isSome(maybeNumber)) {
                          setCurrentHealth(maybeNumber);
                        }
                      }}
                    />
                  </PopoverTrigger>
                  <Portal>
                    <NumPad
                      onAdd={(value) => {
                        let newHealth = currentHealth + value;
                        if (newHealth > maximumHealth) {
                          newHealth = maximumHealth;
                        }
                        setCurrentHealth(newHealth);
                      }}
                      onSubstract={(value) => {
                        let newHealth = currentHealth - value;
                        if (newHealth < 0) {
                          newHealth = 0;
                        }
                        setCurrentHealth(newHealth);
                      }}
                    />
                  </Portal>
                </Popover>
                <Input
                  value={actualMaximumHealth}
                  type="number"
                  onChange={(ev) => {
                    const maybeNumber = parseIntSafe(ev.target.value);
                    if (isSome(maybeNumber)) {
                      setMaximumHealth(maybeNumber);
                    }
                  }}
                />
              </>
            )}
          </HStack>
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
          <CopyInput
            type="text"
            readOnly
            value={buildCharacterUrl(character.id)}
          />
          {/* {process.env.REACT_APP_GOOGLE_API_KEY ? (
            <>
              Select custom font:
              <FontPicker apiKey={process.env.REACT_APP_GOOGLE_API_KEY} />
            </>
          ) : null} */}
        </>
      )}
    </>
  );
};

const buildCharacterUrl = (characterId: string) =>
  process.env.PUBLIC_URL ||
  window.location.protocol +
    "//" +
    window.location.hostname +
    (window.location.port ? `:${window.location.port}` : "") +
    "/#" +
    encodeURIComponent(JSON.stringify({ characterId, hash: "" }));

const CopyInput = (props: React.ComponentProps<typeof Input>) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  return (
    <InputGroup size="md">
      <Input pr="4.5rem" ref={inputRef} {...props} />
      <InputRightElement width="4.5rem">
        <Button
          h="1.75rem"
          size="sm"
          onClick={() => {
            inputRef.current?.select();
            document.execCommand("copy");
          }}
        >
          Copy
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};
