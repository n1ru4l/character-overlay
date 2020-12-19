import styled from "@emotion/styled";
import { darken, transparentize } from "polished";
import * as React from "react";

const barWidth = 300;
const barHeight = 30;

const Container = styled.div({
  position: "relative",
  width: barWidth,
  height: barHeight,
  borderRadius: 3,
  overflow: "hidden",
  color: "white",
  flexShrink: 0,
});

const Progress = styled.div({
  width: "100%",
  height: barHeight,
  transition: "width .6s ease-in-out",
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

export const ProgressBar = (props: {
  label: React.ReactNode;
  current: number;
  maximum: number;
  colors: [string, string];
}): React.ReactElement => {
  const progressWidth = (barWidth * props.current) / props.maximum;
  return (
    <Container
      style={{
        border: `2px solid ${darken(0.1, props.colors[0])}`,
        background: transparentize(0.7, props.colors[0]),
      }}
    >
      <Progress
        style={{
          width: progressWidth,
          backgroundImage: `linear-gradient(160deg, ${props.colors[0]}, ${props.colors[1]})`,
        }}
      />
      <ProgressLabel>{props.label}</ProgressLabel>
    </Container>
  );
};
