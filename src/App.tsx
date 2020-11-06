/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
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
  Stack,
} from "@chakra-ui/core";
import { darken, transparentize } from "polished";
import { parseIntSafe } from "./number-utilities";
import {
  CharacterViewFragment,
  useCharacterEditorQueryQuery,
  useCharacterQueryQuery,
  useCreateCharacterMutationMutation,
  useUpdateCharacterMutationMutation,
} from "./generated/graphql";
import { isNone, isSome, Maybe } from "./Maybe";
import { NumPad } from "./NumPad";

const CharacterImage = styled.img({
  width: 150,
  height: 150,
  background: "white",
  borderRadius: 75,
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
  flexShrink: 0,
});

const ProgressBarProgress = styled.div<{ w: number }>((props) => ({
  width: props.w,
  height: healthBarHeight,
  transition: "width .6s ease-in-out",
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
}: {
  editHash: string;
}): React.ReactElement => {
  const [data] = useCharacterEditorQueryQuery({
    variables: {
      editHash,
    },
  });

  switch (data?.data?.characterEditor?.__typename) {
    case "Error":
      return <Box>Unexpected Error occured</Box>;
    case "CharacterEditorView": {
      const { character } = data.data.characterEditor;
      return <CharacterOverlay character={character} editHash={editHash} />;
    }
    default:
      // TODO: Show Character not found view.
      return <Box>Character not found...</Box>;
  }
};

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
  return <Main />;
};

const Main = (): React.ReactElement => {
  const [
    createCharacterState,
    createCharacter,
  ] = useCreateCharacterMutationMutation();

  React.useEffect(() => {
    if (
      createCharacterState.data?.createCharacter.__typename ===
      "CreateCharacterSuccess"
    ) {
      window.location.hash = `edit=${createCharacterState.data.createCharacter.editHash}`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createCharacterState.data?.createCharacter]);

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
        <img src="/logo.png" alt="OBS Character Overlay Logo" />

        <Box as="p" textAlign="center">
          Create an OBS overlay for your favorite tabletop role-playing game in
          seconds.
        </Box>

        <Button
          onClick={() => {
            createCharacter();
          }}
          disabled={createCharacterState.fetching}
          colorScheme="purple"
        >
          Create Overlay!
        </Button>
      </VStack>
    </Flex>
  );
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

  return <CharacterOverlay character={data.data.character} editHash="" />;
};

const CharacterOverlay = ({
  character,
  editHash,
}: {
  character: CharacterViewFragment;
  editHash: string;
}) => {
  const [, updateCharacter] = useUpdateCharacterMutationMutation();
  const [name, setName] = React.useState(character.name);
  const [currentHealth, setCurrentHealth] = React.useState(
    character.health.current
  );
  const [maximumHealth, setMaximumHealth] = React.useState(
    character.health.maximum
  );

  const isFirstRun = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (editHash === "") {
      return;
    }
    updateCharacter({
      input: {
        editHash,
        updates: {
          name,
          currentHealth,
          maximumHealth,
        },
      },
    });
  }, [updateCharacter, editHash, name, currentHealth, maximumHealth]);

  const actualCurrentHealth =
    editHash === "" ? character.health.current : currentHealth;
  const actualMaximumHealth =
    editHash === "" ? character.health.maximum : maximumHealth;

  return (
    <>
      <Stack spacing="2" padding="md">
        {editHash === "" ? null : (
          <Stack>
            <Heading>Character Editor</Heading>
            <Text>
              Don't share the URL of this Page with anyone. Bookmark it in order
              to re-use the character at a later point.
            </Text>
            <Text>
              If you loose the URL you cannot use this character anymore. So
              make sure you bookmark it.
            </Text>
            <Text>
              Wanna create a new character? Sure!{" "}
              <Text as="span" fontWeight="bold">
                JUST MAKE SURE TO BOOKMARK THIS URL FIRST.
              </Text>
              <br />
              <Button
                onClick={() => {
                  window.location.hash = "";
                  window.location.reload();
                }}
              >
                Create another character
              </Button>
            </Text>
          </Stack>
        )}

        <HStack spacing="10" width="100%">
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
              <Input value={name} onChange={(ev) => setName(ev.target.value)} />
            )}
            <HStack width="100%">
              <ProgressBar>
                <HealthBarProgress
                  w={
                    (actualCurrentHealth / actualMaximumHealth) * healthBarWidth
                  }
                />
                <ProgressLabel>
                  LeP{" "}
                  {editHash === "" ? (
                    actualCurrentHealth
                  ) : (
                    <Popover>
                      <PopoverTrigger>
                        <Box
                          as="input"
                          display="inline"
                          value={actualCurrentHealth}
                          type="number"
                          textAlign="right"
                          width="30px"
                          background="transparent"
                          onChange={(
                            ev: React.ChangeEvent<HTMLInputElement>
                          ) => {
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
                  )}{" "}
                  /{" "}
                  {editHash === "" ? (
                    actualMaximumHealth
                  ) : (
                    <Box
                      as="input"
                      display="inline"
                      value={actualMaximumHealth}
                      type="number"
                      textAlign="left"
                      width="30px"
                      background="transparent"
                      onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                        const maybeNumber = parseIntSafe(ev.target.value);
                        if (isSome(maybeNumber)) {
                          setMaximumHealth(maybeNumber);
                        }
                      }}
                    />
                  )}
                </ProgressLabel>
              </ProgressBar>
            </HStack>
            <Spacer height={4} />
            {character.mana ? (
              <ProgressBar>
                <ManaBarProgress
                  w={
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
          </>
        )}
      </Stack>
    </>
  );
};

const buildCharacterUrl = (characterId: string) =>
  process.env.PUBLIC_URL ||
  window.location.protocol +
    "//" +
    window.location.hostname +
    (window.location.port ? `:${window.location.port}` : "") +
    `/#character=${characterId}`;

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
