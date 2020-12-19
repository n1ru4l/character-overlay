import { Box, HStack, Text } from "@chakra-ui/react";
import { darken } from "polished";
import * as React from "react";
const color = "#FFEA00";

const FatePoint = (props: { isActive: boolean }): React.ReactElement => (
  <Box
    height={5}
    width={5}
    borderRadius={10}
    overflow={"hidden"}
    background={color}
    border={`2px solid ${darken(0.1, color)}`}
    opacity={props.isActive ? 1 : 0.5}
  />
);

const times = <T,>(amount: number, create: (index: number) => T) => {
  if (amount < 0) {
    return [];
  }
  return new Array(amount).fill(undefined).map((_, index) => create(index));
};

export const FatePoints = (props: {
  maximum: number;
  current: number;
}): React.ReactElement => (
  <HStack justifyContent="flex-end">
    <Text fontWeight="bold" as="span">
      SchiPs
    </Text>
    {times(props.current, (index) => (
      <FatePoint isActive={true} key={`active_${index}`} />
    ))}
    {times(props.maximum - props.current, (index) => (
      <FatePoint isActive={false} key={`inactive_${index}`} />
    ))}
  </HStack>
);
