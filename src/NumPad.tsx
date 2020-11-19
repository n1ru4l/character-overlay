import * as React from "react";
import {
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  PopoverFooter,
  Button,
  PopoverHeader,
  VStack,
  Grid,
  GridItem,
  Input,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { isSome } from "./Maybe";
import { parseIntSafe } from "./number-utilities";

export const NumPad = (props: {
  onAdd: (value: number) => void;
  onSubstract: (value: number) => void;
}): React.ReactElement => {
  const [value, setValue] = React.useState("0");
  const handleNumber = (inputNumber: number) => {
    setValue((value) => {
      if (value === "0") {
        return String(inputNumber);
      }
      return `${value}${inputNumber}`;
    });
  };

  const handleRemove = () => {
    setValue((value) => {
      if (value.length === 1) {
        return "0";
      }
      return value.substring(0, value.length - 1);
    });
  };

  const handleAdd = () => {
    props.onAdd(parseInt(value, 10));
    setValue("0");
  };

  const handleSubstract = () => {
    props.onSubstract(parseInt(value, 10));
    setValue("0");
  };

  return (
    <PopoverContent
      onKeyDown={(ev) => {
        switch (ev.key) {
          case "Backspace":
          case "Delete":
            handleRemove();
            return;
          case "+":
            handleAdd();
            return;
          case "-":
            handleSubstract();
            return;
          default:
            const maybeNumber = parseIntSafe(ev.key);
            if (isSome(maybeNumber)) {
              handleNumber(maybeNumber);
            }
        }
      }}
    >
      <PopoverArrow />
      <PopoverCloseButton />
      <PopoverHeader>Change Health</PopoverHeader>
      <PopoverBody>
        <VStack spacing="2">
          <Input
            padding="2"
            background="lightgray"
            width="100%"
            value={value}
            textAlign="right"
          />

          <Grid templateColumns="repeat(3, 1fr)" gap="1" width="100%">
            <Button
              variant="outline"
              width="100%"
              onClick={() => handleNumber(7)}
            >
              7
            </Button>
            <Button
              variant="outline"
              width="100%"
              onClick={() => handleNumber(8)}
            >
              8
            </Button>
            <Button
              variant="outline"
              width="100%"
              onClick={() => handleNumber(9)}
            >
              9
            </Button>

            <Button
              variant="outline"
              width="100%"
              onClick={() => handleNumber(4)}
            >
              4
            </Button>
            <Button
              variant="outline"
              width="100%"
              onClick={() => handleNumber(5)}
            >
              5
            </Button>
            <Button
              variant="outline"
              width="100%"
              onClick={() => handleNumber(6)}
            >
              6
            </Button>

            <Button
              variant="outline"
              width="100%"
              onClick={() => handleNumber(1)}
            >
              1
            </Button>
            <Button
              variant="outline"
              width="100%"
              onClick={() => handleNumber(2)}
            >
              2
            </Button>
            <Button
              variant="outline"
              width="100%"
              onClick={() => handleNumber(3)}
            >
              3
            </Button>
            <GridItem colSpan={2}>
              <Button
                width="100%"
                variant="outline"
                onClick={() => handleNumber(0)}
              >
                0
              </Button>
            </GridItem>
            <Button variant="outline" onClick={handleRemove}>
              Entf
            </Button>
          </Grid>
        </VStack>
      </PopoverBody>
      <PopoverFooter>
        <Grid templateColumns="repeat(3, 1fr)" gap="1">
          <Button variant="outline" onClick={() => setValue("0")}>
            Reset
          </Button>
          <Button
            rightIcon={<AddIcon boxSize={3} />}
            variant="outline"
            onClick={handleAdd}
          >
            Add
          </Button>
          <Button
            rightIcon={<MinusIcon boxSize={3} />}
            variant="outline"
            onClick={handleSubstract}
          >
            Minus
          </Button>
        </Grid>
      </PopoverFooter>
    </PopoverContent>
  );
};
