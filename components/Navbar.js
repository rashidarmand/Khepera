import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  GridItem,
  HStack,
  Img,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack
} from '@chakra-ui/react';
import { loadExchange, loadToken, loadWeb3, loadWeb3Account } from '@store/effects';
import { accountSelector } from '@store/selectors';
import { useDispatch, useSelector } from 'react-redux';

const loadBlockchainData = async (dispatch) => {
  const web3 = await loadWeb3(dispatch);
  const networkId = await web3.eth.net.getId();
  await loadWeb3Account(web3, dispatch);
  const token = await loadToken(web3, networkId, dispatch);
  //TODO: make error object that contains all errors as keys and functions that respond to them as values
  if (!token) {
    alert('Token contract not deployed to the current network. Please select another network with Metamask.');
    return;
  }
  const exchange = await loadExchange(web3, networkId, dispatch);
  if (!exchange) {
    alert('Exchange contract not deployed to the current network. Please select another network with Metamask.');
    return;
  }
};

const WalletConnection = ({ account, dispatch, openModal }) => {
  const notConnected = {
    handleClick: () => loadBlockchainData(dispatch)
  };

  const connected = {
    handleClick: openModal
  };

  const handleClick = account ? connected.handleClick : notConnected.handleClick;

  const buttonText = account ? account : 'Connect Wallet';

  return (
    <Button
      variant="outline"
      color="white"
      colorScheme="purple"
      _hover={{
        bg: 'white',
        transform: 'scale(0.98)',
        color: 'purple.700'
      }}
      onClick={handleClick}
      maxW="160px"
    >
      <Box isTruncated>{buttonText}</Box>
    </Button>
  );
};

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const account = useSelector(accountSelector);
  const etherScanAddress = `https://etherscan.io/address/${account}`;
  const disconnectWallet = async () => {
    onClose();
    window.ethereum._handleDisconnect();
    location.reload();
  };

  return (
    <GridItem
      bgGradient="linear-gradient(120deg, #7028e4 0%, #e5b2ca 55%, #7028e4 100%)"
      w="100%"
      color="white"
      shadow="md"
    >
      <HStack h="100%" px={4}>
        <Box h="100%" flexGrow="1">
          <Img h="100%" src="/khepera-Logo-white.svg" alt="Khepera-Logo" />
        </Box>

        <WalletConnection openModal={onOpen} dispatch={dispatch} account={account} />

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Wallet Connected</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack p="2">
                <Box fontWeight="semibold">Logged in as:</Box>
                <Link fontSize="sm" href={etherScanAddress} rel="noopener noreferrer" wordBreak="break-all" isExternal>
                  {account}
                  <ExternalLinkIcon mx="2px" />
                </Link>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="purple" mr={3} onClick={disconnectWallet}>
                Disconnect
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </HStack>
    </GridItem>
  );
};

export default Navbar;
