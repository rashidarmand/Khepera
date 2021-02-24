import { Grid, GridItem, Heading, useBreakpointValue } from '@chakra-ui/react';
import Balance from '@components/Balance';
import MyTransactions from '@components/MyTransactions';
import NewOrder from '@components/NewOrder';
import OrderBook from '@components/OrderBook';
import PriceChart from '@components/PriceChart';
import Trades from '@components/Trades';
import Token from '@truffle/abis/Token.json';
import { colorLog } from '@utils/helpers';
import Head from 'next/head';
import { useEffect } from 'react';
import Web3 from 'web3';

const loadBlockchainData = async () => {
  const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
  // const web3 = new Web3(window.ethereum);
  await window.ethereum.enable();
  const networkId = await web3.eth.net.getId();
  const accounts = await web3.eth.getAccounts();
  const token = new web3.eth.Contract(Token.abi, Token?.networks[networkId]?.address);
  const totalSupply = await token.methods.totalSupply().call();
  colorLog('Token total supply:: ', totalSupply);
};

const Home = () => {
  const mediumScreenAndUp = useBreakpointValue({ md: true, base: false });
  const gridTemplateColumns = useBreakpointValue({ md: '1fr 1fr 2fr 1fr', base: '1fr' });
  const gridTemplateRows = useBreakpointValue({ md: 'repeat(2, 1fr)', base: 'repeat(6, 1fr)' });

  useEffect(async () => {
    await loadBlockchainData();
  }, []);

  return (
    <Grid
      minH="100vh"
      minW="100vw"
      w="min-content"
      bgGradient="linear-gradient(to top, #7028e4 0%, #e5b2ca 100%)"
      templateRows="68px 1fr"
      gap={(4, 0)}
    >
      <Head>
        <title>Khepera - Decentralized Ethereum Token Exchange</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <GridItem
        bgGradient="linear-gradient(120deg, #7028e4 0%, #e5b2ca 55%, #7028e4 100%)"
        w="100%"
        p={4}
        color="white"
        shadow="md"
      >
        <Heading size="lg">Khepera Token Exchange</Heading>
      </GridItem>

      <GridItem>
        <Grid
          h="100%"
          p="4"
          templateRows={gridTemplateRows}
          templateColumns={gridTemplateColumns}
          gap={4}
          color="gray.700"
        >
          <GridItem colSpan={mediumScreenAndUp && 1} colStart={mediumScreenAndUp && 1} bg="pink.50" shadow="lg" p="2">
            <Balance />
          </GridItem>

          <GridItem
            colSpan={mediumScreenAndUp && 1}
            rowStart={mediumScreenAndUp && 2}
            colStart={mediumScreenAndUp && 1}
            bg="pink.50"
            shadow="lg"
            p="2"
          >
            <NewOrder />
          </GridItem>

          <GridItem colSpan={1} rowSpan={mediumScreenAndUp && 2} bg="pink.50" shadow="lg" p="2">
            <OrderBook />
          </GridItem>

          <GridItem
            colSpan={mediumScreenAndUp && 1}
            colStart={mediumScreenAndUp && 3}
            rowSpan={mediumScreenAndUp && 1}
            bg="pink.50"
            shadow="lg"
            p="2"
          >
            <PriceChart />
          </GridItem>

          <GridItem
            colSpan={1}
            colStart={mediumScreenAndUp && 3}
            rowSpan={mediumScreenAndUp && 1}
            rowStart={mediumScreenAndUp && 2}
            bg="pink.50"
            shadow="lg"
            p="2"
          >
            <MyTransactions />
          </GridItem>

          <GridItem
            colSpan={1}
            colStart={mediumScreenAndUp && 4}
            rowSpan={mediumScreenAndUp && 2}
            bg="pink.50"
            shadow="lg"
            p="2"
          >
            <Trades />
          </GridItem>
        </Grid>
      </GridItem>
    </Grid>
  );
};

export default Home;
