import * as React from "react";
import styled from "@emotion/styled";
import { useAppQuery } from "./generated/graphql";

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

const Container = styled.div({
  display: "flex",
});

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

export const App = (): React.ReactElement => {
  const [data] = useAppQuery();

  if (!data.data?.character) {
    return <div />;
  }
  return (
    <Container>
      <Column>
        <CharacterImage src={data.data.character.imageUrl ?? ""} />
      </Column>
      <Spacer width={12} />
      <Column>
        <Spacer height={18} />

        <CharacterName>{data.data.character.name}</CharacterName>
        <Spacer height={4} />
        <ProgressBar>
          <HealthBarProgress
            width={
              (data.data.character.health.current /
                data.data.character.health.maximum) *
              healthBarWidth
            }
          />
          <ProgressLabel>
            LeP {data.data.character.health.current} /{" "}
            {data.data.character.health.maximum}
          </ProgressLabel>
        </ProgressBar>
        <Spacer height={4} />
        <ProgressBar>
          <ManaBarProgress
            width={
              (data.data.character.health.current /
                data.data.character.health.maximum) *
              healthBarWidth
            }
          />
          <ProgressLabel>
            LeP {data.data.character.health.current} /{" "}
            {data.data.character.health.maximum}
          </ProgressLabel>
        </ProgressBar>
      </Column>
    </Container>
  );
};
