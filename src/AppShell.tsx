import * as React from "react";
import {
  Box,
  Button,
  Container,
  HStack,
  useColorMode,
  Image,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import styled from "@emotion/styled";
import { FeedbackFish } from "@feedback-fish/react";

const LogoImage = styled(Image)<{ isDark: boolean }>`
  height: 75px;
  width: 60px;
  filter: invert(${(p) => (p.isDark ? 1 : 0)});
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

const DarkModeButton = () => {
  const { toggleColorMode, colorMode } = useColorMode();

  return (
    <IconButton
      aria-label="Dark Mode"
      icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
      onClick={toggleColorMode}
    />
  );
};

export const HeaderSection = (): React.ReactElement => {
  const { colorMode } = useColorMode();
  return (
    <SectionContainer>
      <HStack justify="space-between">
        <Box
          as="a"
          href="/"
          width="auto"
          display="inline-block"
          alignSelf="flex-start"
        >
          <HStack>
            <LogoImage src="/head.png" isDark={colorMode === "dark"} />
            <LogoText>
              Character <br />
              Overlay
            </LogoText>
          </HStack>
        </Box>
        <HStack>
          <DarkModeButton />
          <FeedbackFish projectId="518614210753ad">
            <Button>Send feedback</Button>
          </FeedbackFish>
        </HStack>
      </HStack>
    </SectionContainer>
  );
};
