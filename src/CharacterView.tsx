import styled from "@emotion/styled";
import * as React from "react";
import { Box, HStack, Text, Stack } from "@chakra-ui/react";
import { ProgressBar } from "./ProgressBar";
import { FatePoints } from "./FatePointsIndicator";
import { FragmentType, gql, useFragment } from "./gql";

const CharacterOverlayFragment = gql(/* GraphQL */ `
  fragment CharacterOverlayFragment on Character {
    id
    name
    currentHealth
    maximumHealth
    hasMana
    currentMana
    maximumMana
    hasFatePoints
    currentFatePoints
    maximumFatePoints
    imageUrl
  }
`);

export const CharacterOverlay = (props: {
  character: FragmentType<typeof CharacterOverlayFragment>;
  size: "sm" | "lg";
}): React.ReactElement => {
  const character = useFragment(CharacterOverlayFragment, props.character);
  const imageSize = (props.size === "sm" ? 75 : 125) + "px";
  return (
    <HStack>
      <Box>
        <Text
          color="white"
          fontSize="lg"
          textShadow="-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black"
          width="100%"
        >
          {character.name}
        </Text>
        <Stack spacing="2">
          <ProgressBar
            current={character.currentHealth}
            maximum={character.maximumHealth}
            colors={["#ec008c", "#ff0000"]}
            label={
              <Text as="span">
                <Text fontWeight="bold" as="span">
                  LeP
                </Text>{" "}
                <Text as="span">
                  {character.currentHealth} / {character.maximumHealth}
                </Text>
              </Text>
            }
          />
          {character.hasMana ? (
            <ProgressBar
              current={character.currentMana}
              maximum={character.maximumMana}
              colors={["#3c99dc", "#66D3FA"]}
              label={
                <Text as="span">
                  <Text fontWeight="bold" as="span">
                    AsP
                  </Text>{" "}
                  <Text as="span">
                    {character.currentMana} / {character.maximumMana}
                  </Text>
                </Text>
              }
            />
          ) : null}
          {character.hasFatePoints ? (
            <FatePoints
              current={character.currentFatePoints}
              maximum={character.maximumFatePoints}
            />
          ) : null}
        </Stack>
      </Box>
      <CharacterImage
        style={{
          height: imageSize,
          width: imageSize,
        }}
        src={character.imageUrl ?? ""}
      />
    </HStack>
  );
};

const CharacterImage = styled.div((props: { src: string }) => ({
  background: "white",
  borderRadius: 10,
  backgroundSize: "cover",
  backgroundImage: `url(${props.src})`,
}));
