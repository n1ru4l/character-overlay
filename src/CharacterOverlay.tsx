import * as React from "react";
import { Box, Image, HStack, Text } from "@chakra-ui/react";
import { darken, transparentize } from "polished";
import styled from "@emotion/styled";

type Character = {
  name: string;
  currentHealth: number;
  maximumHealth: number;
  portraitUrl: string;
};

export const CharacterOverlay = (props: {
  character: Character;
}): React.ReactElement => {
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
        <ProgressBar w={300} h={30}>
          <ProgressBarProgress h={30} w={175} />
          <ProgressLabel>LeP 10 / 10</ProgressLabel>
        </ProgressBar>
      </Box>
      <Image
        height="75px"
        width="75px"
        borderRadius="10px"
        overflow="hidden"
        src={props.character.portraitUrl}
        alt="Character Portrait"
      />
    </HStack>
  );
};

const ProgressBar = styled.div((props: { w: number; h: number }) => ({
  position: "relative",
  width: props.w,
  height: props.h,
  borderRadius: 3,
  border: `2px solid ${darken(0.1, "#ec008c")}`,
  overflow: "hidden",
  background: transparentize(0.7, "#ec008c"),
  color: "white",
  flexShrink: 0,
}));

const ProgressBarProgress = styled.div<{ w: number; h: number }>((props) => ({
  width: props.w,
  height: props.h,
  transition: "width .6s ease-in-out",
  background: `linear-gradient(160deg, #ec008c, #ff0000)`,
}));

// const ProgressBarProgress = styled(ProgressBarProgress)({
//   backgroundImage: `linear-gradient(160deg, ${healthGradientColors[0]}, ${healthGradientColors[1]})`,
// });

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
