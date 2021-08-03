import * as React from "react";
import {
  Image,
  Container,
  Heading,
  Box,
  Button,
  AspectRatio,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { gql } from "./gql";
import styled from "@emotion/styled";
import { CharacterOverlay } from "./CharacterView";
import { isSome, Maybe } from "./Maybe";
import { HeaderSection } from "./AppShell";
import { useMutation } from "urql";

const SectionContainer = styled(Container)`
  max-width: 1200px;
`;

const MainSectionContainer = styled(SectionContainer)`
  margin-top: 6rem;
`;

const BackgroundImageContainer = styled.div`
  background-size: cover;
  width: 100%;
  min-height: 100vh;
  background-image: url("/background.svg");
`;

export const CreateCharacterMutation = gql(/* GraphQL */ `
  mutation CreateCharacterMutation {
    createCharacter {
      __typename
      ... on Error {
        reason
      }
      ... on CreateCharacterSuccess {
        editHash
      }
    }
  }
`);

export const LandingPage = (): React.ReactElement => {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const streamRef = React.useRef<Maybe<MediaStream>>(null);
  const [previewState, setPreviewState] = React.useState<
    "notStarted" | "starting" | "started"
  >("notStarted");

  const [createCharacterState, createCharacter] = useMutation(
    CreateCharacterMutation
  );

  React.useEffect(() => {
    if (
      createCharacterState.data?.createCharacter.__typename ===
      "CreateCharacterSuccess"
    ) {
      window.location.hash = `edit=${createCharacterState.data.createCharacter.editHash}`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createCharacterState.data?.createCharacter]);

  React.useEffect(
    () => () => {
      const stream = streamRef.current;
      if (isSome(stream)) {
        for (const track of stream.getTracks()) {
          track.stop();
        }
      }
    },
    []
  );

  return (
    <BackgroundImageContainer
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundImage: "",
      }}
    >
      <HeaderSection />
      <MainSectionContainer>
        <HStack spacing="24px">
          <Stack spacing="8px">
            <Heading maxW={600} size="2xl" lineHeight="1.2">
              Overlay for your favorite RPG in seconds!
            </Heading>
            <Text fontSize="lg">
              Add information such as health, mana to your video without hassle.
            </Text>
            <Box>
              <Button
                colorScheme="purple"
                size="lg"
                onClick={() => {
                  createCharacter();
                }}
                disabled={createCharacterState.fetching}
              >
                Create Overlay
              </Button>
            </Box>
          </Stack>
          <Box w="600px" position="relative">
            <AspectRatio
              maxH="400px"
              width="100%"
              ratio={3 / 4}
              borderRadius="10px"
              overflow="hidden"
            >
              <Image src="/hero.jpg" objectFit="cover" />
            </AspectRatio>
            <video
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                overflow: "hidden",
                objectFit: "cover",
                borderRadius: 10,
                maxHeight: 400,
                width: "100%",
              }}
              playsInline
              autoPlay
              ref={videoRef}
              onPlay={() => {
                setPreviewState("started");
              }}
            ></video>
            <OverlayContainer>
              <CharacterOverlay
                size="sm"
                character={{
                  id: "__local-example",
                  name: "Robin Hood",
                  maximumHealth: 30,
                  currentHealth: 22,
                  imageUrl: "/sample-portrait.jpg",
                  currentMana: 10,
                  maximumMana: 20,
                  hasMana: false,
                  hasFatePoints: false,
                  currentFatePoints: 0,
                  maximumFatePoints: 0,
                }}
              />
            </OverlayContainer>
            <WebcamTriggerContainer>
              {previewState === "notStarted" ? (
                <Button
                  leftIcon={<VideoIcon />}
                  onClick={() => {
                    const constraints = {
                      audio: false,
                      video: true,
                    };
                    navigator.mediaDevices
                      .getUserMedia(constraints)
                      .then((stream) => {
                        videoRef.current!.srcObject = stream;
                        streamRef.current = stream;

                        setPreviewState("starting");
                      })
                      .catch((err) => {
                        console.error(err);
                      });
                  }}
                >
                  Preview
                </Button>
              ) : previewState === "starting" ? (
                <Button>...</Button>
              ) : (
                <Button
                  colorScheme="red"
                  leftIcon={<VideoOffIcon />}
                  onClick={() => {
                    videoRef.current!.srcObject = null;
                    const tracks = streamRef.current?.getTracks();
                    setPreviewState("notStarted");
                    if (isSome(tracks)) {
                      for (const track of tracks) {
                        track.stop();
                      }
                    }
                  }}
                >
                  Stop
                </Button>
              )}
            </WebcamTriggerContainer>
          </Box>
        </HStack>
      </MainSectionContainer>
    </BackgroundImageContainer>
  );
};

const OverlayContainer = styled.div`
  position: absolute;
  bottom: 20px;
  right: 10px;
`;

const WebcamTriggerContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 10px;
`;

const VideoIcon = (): React.ReactElement => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23 7l-7 5 7 5V7z" />
    <rect x={1} y={5} width={15} height={14} rx={2} ry={2} />
  </svg>
);

const VideoOffIcon = (): React.ReactElement => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 16v1a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2h2m5.66 0H14a2 2 0 012 2v3.34l1 1L23 7v10M1 1l22 22" />
  </svg>
);
