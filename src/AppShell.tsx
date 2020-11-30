import * as React from "react";
import { Box, Button, Container, HStack, Image, Text } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { FeedbackFish } from "@feedback-fish/react";

const LogoImage = styled(Image)`
  height: 75px;
  width: 60px;
`;

const LogoText = styled(Text)`
  font-weight: bold;
  line-height: 1;
  font-family: Inter, "Aileron Black", sans-serif, "Source Sans Pro", Roboto,
    Tahoma, Geneva, Verdana, sans-serif;
`;

export const SectionContainer = styled(Container)`
  max-width: 1200px;
`;

export const MainSectionContainer = styled(SectionContainer)`
  margin-top: 6rem;
`;

export const HeaderSection = (): React.ReactElement => (
  <SectionContainer>
    <HStack justify="space-between">
      <Box as="a" href="/" width="auto" display="inline-block">
        <HStack>
          <LogoImage src="/head.png" alt="OBS Character Overlay Logo" />
          <LogoText>
            Character <br />
            Overlay
          </LogoText>
        </HStack>
      </Box>
      <FeedbackFish projectId="518614210753ad">
        <Button>Send feedback</Button>
      </FeedbackFish>
    </HStack>
  </SectionContainer>
);
