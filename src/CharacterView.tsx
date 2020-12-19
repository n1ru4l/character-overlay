import styled from "@emotion/styled";
import * as React from "react";
import { Box, HStack, Text, Stack } from "@chakra-ui/react";
import { CharacterViewFragment } from "./generated/graphql";
import { ProgressBar } from "./ProgressBar";
import { FatePoints } from "./FatePointsIndicator";

export const CharacterOverlay = (props: {
  character: CharacterViewFragment;
  size: "sm" | "lg";
}): React.ReactElement => {
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
          {props.character.name}
        </Text>
        <Stack spacing="2">
          <ProgressBar
            current={props.character.currentHealth}
            maximum={props.character.maximumHealth}
            colors={["#ec008c", "#ff0000"]}
            label={
              <Text as="span">
                <Text fontWeight="bold" as="span">
                  LeP
                </Text>{" "}
                <Text as="span">
                  {props.character.currentHealth} /{" "}
                  {props.character.maximumHealth}
                </Text>
              </Text>
            }
          />
          {props.character.hasMana ? (
            <ProgressBar
              current={props.character.currentMana}
              maximum={props.character.maximumMana}
              colors={["#3c99dc", "#66D3FA"]}
              label={
                <Text as="span">
                  <Text fontWeight="bold" as="span">
                    AsP
                  </Text>{" "}
                  <Text as="span">
                    {props.character.currentMana} /{" "}
                    {props.character.maximumMana}
                  </Text>
                </Text>
              }
            />
          ) : null}
          {props.character.hasFatePoints ? (
            <FatePoints
              current={props.character.currentFatePoints}
              maximum={props.character.maximumFatePoints}
            />
          ) : null}
        </Stack>
      </Box>
      <CharacterImage
        style={{
          height: imageSize,
          width: imageSize,
        }}
        src={props.character.imageUrl ?? ""}
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
