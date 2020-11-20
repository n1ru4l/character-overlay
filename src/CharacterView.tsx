import * as React from "react";
import { Box, Image, HStack, Text, Stack } from "@chakra-ui/react";
import { CharacterViewFragment } from "./generated/graphql";
import { ProgressBar } from "./ProgressBar";

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
        </Stack>
      </Box>
      <Image
        height={imageSize}
        width={imageSize}
        borderRadius="10px"
        overflow="hidden"
        src={props.character.imageUrl ?? ""}
        alt="Character Portrait"
      />
    </HStack>
  );
};
