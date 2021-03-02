import { Box, Button, Center, GridItem, Heading, Img, LinkBox, LinkOverlay, Text } from '@chakra-ui/react';

const Landing = () => {
  return (
    <GridItem>
      <Center h="100%">
        <Box borderRadius="xl" bg="pink.50" shadow="lg" p="5" maxH="600px" maxW="600px">
          <Heading size="lg">Please sign in to use the application</Heading>
          <Text fontSize="lg" mt="5" fontWeight="700">
            Currently, we only support Metamask. Sign up for an account by visiting the link below.
          </Text>
          <Center mt="7">
            <LinkBox>
              <Button variant="outline" colorScheme="purple" flexDir="column" p="10" mx="auto">
                <LinkOverlay href="https://metamask.io" target="_blank">
                  <Img src="https://metamask.io/images/mm-logo.svg" />
                  <Box>Sign Up</Box>
                </LinkOverlay>
              </Button>
            </LinkBox>
          </Center>
        </Box>
      </Center>
    </GridItem>
  );
};

export default Landing;
