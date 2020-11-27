import * as React from "react";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverTrigger,
  Portal,
  Stack,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { HeaderSection, MainSectionContainer } from "./AppShell";
import {
  CharacterViewFragment,
  useCharacterEditorQueryQuery,
  useCreateCharacterMutationMutation,
  useUpdateCharacterMutationMutation,
} from "./generated/graphql";
import { isSome, Maybe } from "./Maybe";
import { parseIntSafe } from "./number-utilities";
import { NumPad } from "./NumPad";
import { ProgressBar } from "./ProgressBar";
import { elementDragControls } from "framer-motion/types/gestures/drag/VisualElementDragControls";

export const CharacterEditor = (props: {
  editHash: string;
}): React.ReactElement => {
  return (
    <>
      <HeaderSection />
      <MainSectionContainer>
        <Renderer editHash={props.editHash} />
      </MainSectionContainer>
    </>
  );
};

const Renderer = (props: { editHash: string }) => {
  const [data] = useCharacterEditorQueryQuery({
    variables: {
      editHash: props.editHash,
    },
  });

  switch (data?.data?.characterEditor?.__typename) {
    case "Error":
      return <CharacterNotFoundView />;
    case "CharacterEditorView": {
      const { character } = data.data.characterEditor;
      return <Editor character={character} editHash={props.editHash} />;
    }
    default:
      // TODO: Show Character not found view.
      return <Box>Loading...</Box>;
  }
};

const CharacterNotFoundView = (): React.ReactElement => {
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
    <Stack spacing="4">
      <Heading>Expired or invalid link.</Heading>
      <Text fontSize="lg">
        Sorry, but we could not find the character you are looking for.
      </Text>
      <Box>
        <Button
          colorScheme="purple"
          width="auto"
          size="lg"
          disabled={createCharacterState.fetching}
          onClick={() => {
            createCharacter();
          }}
        >
          Create new Character
        </Button>
      </Box>
    </Stack>
  );
};

const Editor = ({
  character,
  editHash,
}: {
  character: CharacterViewFragment;
  editHash: string;
}) => {
  const [, updateCharacter] = useUpdateCharacterMutationMutation();
  const [imageUrl, setImageUrl] = React.useState(character.imageUrl);
  const [name, setName] = React.useState(character.name);
  const [currentHealth, setCurrentHealth] = React.useState(
    character.currentHealth
  );
  const [maximumHealth, setMaximumHealth] = React.useState(
    character.maximumHealth
  );
  const [hasMana, setHasMana] = React.useState(character.hasMana);
  const [currentMana, setCurrentMana] = React.useState(character.currentMana);
  const [maximumMana, setMaximumMana] = React.useState(character.maximumMana);

  const isFirstRun = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (!editHash) {
      return;
    }
    updateCharacter({
      input: {
        editHash,
        updates: {
          name,
          currentHealth,
          maximumHealth,
          hasMana,
          currentMana,
          maximumMana,
          imageUrl,
        },
      },
    });
  }, [
    updateCharacter,
    editHash,
    name,
    currentHealth,
    maximumHealth,
    hasMana,
    currentMana,
    maximumMana,
    imageUrl,
  ]);

  return (
    <>
      <Stack spacing="2" padding="md">
        <Stack spacing="4">
          <Heading>Character Editor</Heading>
          <Text maxWidth="75%"></Text>

          <Alert status="info">
            <AlertIcon />
            You can edit and update this character the link above. We recommend
            bookmarking this site if you plan to re-use the character at a later
            point in time.
          </Alert>

          <Alert status="warning">
            <AlertIcon />
            If you lose the URL you cannot update this character anymore. So
            make sure you bookmark it.
          </Alert>

          <Alert status="info">
            <AlertIcon />
            <Stack padding="2">
              <Text>
                Use the following link for embedding the Overlay in your
                streaming software such as OBS. It will automatically update
                once you applied any changes on this site.
              </Text>
              <CopyInput
                type="text"
                readOnly
                value={buildCharacterUrl(character.id)}
              />
            </Stack>
          </Alert>
        </Stack>

        <HStack spacing="10" width="100%">
          <Box>
            <CharacterImage src={imageUrl ?? ""} />
          </Box>
          <VStack spacing="2">
            <Input value={name} onChange={(ev) => setName(ev.target.value)} />
            <HStack width="100%">
              <ProgressBar
                current={currentHealth}
                maximum={maximumHealth}
                colors={healthGradientColors}
                label={
                  <>
                    LeP
                    <Popover>
                      <PopoverTrigger>
                        <Box
                          as="input"
                          display="inline"
                          value={currentHealth}
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
                          onSubtract={(value) => {
                            let newHealth = currentHealth - value;
                            if (newHealth < 0) {
                              newHealth = 0;
                            }
                            setCurrentHealth(newHealth);
                          }}
                        />
                      </Portal>
                    </Popover>{" "}
                    /{" "}
                    <Box
                      as="input"
                      display="inline"
                      value={maximumHealth}
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
                  </>
                }
              />
            </HStack>
            <Stack>
              {hasMana ? (
                <ProgressBar
                  current={currentMana}
                  maximum={maximumMana}
                  colors={manaGradientColors}
                  label={
                    <>
                      AsP{" "}
                      <Popover>
                        <PopoverTrigger>
                          <Box
                            as="input"
                            display="inline"
                            value={currentMana}
                            type="number"
                            textAlign="right"
                            width="30px"
                            background="transparent"
                            onChange={(
                              ev: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              const maybeNumber = parseIntSafe(ev.target.value);
                              if (isSome(maybeNumber)) {
                                setCurrentMana(maybeNumber);
                              }
                            }}
                          />
                        </PopoverTrigger>
                        <Portal>
                          <NumPad
                            onAdd={(value) => {
                              let newMana = currentMana + value;
                              if (newMana > maximumMana) {
                                newMana = maximumMana;
                              }
                              setCurrentMana(newMana);
                            }}
                            onSubtract={(value) => {
                              let newMana = currentMana - value;
                              if (newMana < 0) {
                                newMana = 0;
                              }
                              setCurrentMana(newMana);
                            }}
                          />
                        </Portal>
                      </Popover>{" "}
                      /{" "}
                      <Box
                        as="input"
                        display="inline"
                        value={maximumMana}
                        type="number"
                        textAlign="left"
                        width="30px"
                        background="transparent"
                        onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                          const maybeNumber = parseIntSafe(ev.target.value);
                          if (isSome(maybeNumber)) {
                            setMaximumMana(maybeNumber);
                          }
                        }}
                      />
                    </>
                  }
                />
              ) : null}

              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="email-alerts" mb="0">
                  AsP?
                </FormLabel>
                <Switch
                  id="email-alerts"
                  isChecked={hasMana}
                  onChange={(ev) => {
                    setHasMana(ev.target.checked);
                  }}
                />
              </FormControl>
            </Stack>
          </VStack>
        </HStack>
        <Box>
          <ImageUpload
            onChange={(fileUrl) => {
              setImageUrl(fileUrl);
            }}
          />
        </Box>
      </Stack>
    </>
  );
};

const ImageUpload = (props: {
  onChange: (newImageUrl: string) => void;
}): React.ReactElement => {
  const [file, setFile] = React.useState<Maybe<File>>(null);
  return (
    <Box>
      <form
        action="/upload"
        encType="multipart/form-data"
        method="post"
        onSubmit={(ev) => {
          ev.preventDefault();
          if (!file) {
            alert("Must select a image first");
            return;
          }
          const formData = new FormData();
          formData.append("avatar", file);
          fetch("/upload", {
            method: "POST",
            // @ts-ignore
            body: formData,
          })
            .then((res) => {
              console.log(res.status);
              return res.text();
            })
            .then(props.onChange)
            .catch(console.log);
        }}
      >
        <div>
          <input
            type="file"
            name="avatar"
            onChange={(ev) => {
              setFile(ev.target.files?.item(0));
            }}
          />
          <Button type="submit" value="Get me the stats!">
            Change Picture
          </Button>
        </div>
      </form>
    </Box>
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
      <Input pr="4.5rem" ref={inputRef} background="white" {...props} />
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

const CharacterImage = styled.div((props: { src: string }) => ({
  width: 150,
  height: 150,
  background: "white",
  borderRadius: 75,
  backgroundSize: "cover",
  backgroundImage: `url(${props.src})`,
}));

const healthGradientColors = ["#ec008c", "#ff0000"] as [string, string];
const manaGradientColors = ["#3c99dc", "#66D3FA"] as [string, string];
