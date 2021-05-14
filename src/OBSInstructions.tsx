import * as React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Image,
  Text,
  Stack,
} from "@chakra-ui/react";

import image1 from "./obs-instruction-images/01-create-browser-source.jpg";
import image2 from "./obs-instruction-images/02-insert-link.jpg";
import image3 from "./obs-instruction-images/03-finished.jpg";

export const OBSInstructions = (): React.ReactElement => {
  return (
    <Accordion allowToggle>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              OBS Embed Instructions
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel>
          <Stack>
            <Image src={image1} boxSize="600px" />
            <Text>
              First of you must create a new Scene and add a Browser source
              using the plus button.
            </Text>
            <Image src={image2} boxSize="600px" />
            <Text>
              Paste the url from above into the URL field and confirm with the
              OK button.
            </Text>
            <Image src={image3} boxSize="600px" />
            <Text>
              Drag/resize the element to a position that suits you best!
            </Text>
          </Stack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
