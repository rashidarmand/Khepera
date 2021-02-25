import { ExternalLinkIcon } from '@chakra-ui/icons';
import { GridItem, Heading, HStack, Link } from '@chakra-ui/react';
import { accountSelector } from '@store/selectors';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const account = useSelector(accountSelector);
  const etherScanAddress = `https://etherscan.io/address/${account}`;
  return (
    <GridItem
      bgGradient="linear-gradient(120deg, #7028e4 0%, #e5b2ca 55%, #7028e4 100%)"
      w="100%"
      p={4}
      color="white"
      shadow="md"
    >
      <HStack>
        <Heading size="lg" flexGrow="1">
          Khepera Token Exchange
        </Heading>
        <Link href={etherScanAddress} rel="noopener noreferrer" isExternal>
          {account}
          <ExternalLinkIcon mx="2px" />
        </Link>
      </HStack>
    </GridItem>
  );
};

export default Navbar;
