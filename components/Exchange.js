import { Grid, GridItem, useBreakpointValue } from '@chakra-ui/react';
import Balance from '@components/Balance';
import MyTransactions from '@components/MyTransactions';
import NewOrder from '@components/NewOrder';
import OrderBook from '@components/OrderBook';
import PriceChart from '@components/PriceChart';
import Trades from '@components/Trades';
import { loadAllOrders, subscribeToEvents } from '@store/effects';
import { accountSelector, exchangeSelector, tokenSelector, web3Selector } from '@store/selectors';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Exchange = () => {
  const mediumScreenAndUp = useBreakpointValue({ md: true, base: false });
  const gridTemplateColumns = useBreakpointValue({ md: '1fr 1fr 2fr 1fr', base: '1fr' });
  const gridTemplateRows = useBreakpointValue({ md: 'repeat(2, 1fr)', base: 'repeat(6, 1fr)' });
  const gridHeight = useBreakpointValue({
    md: { height: 'calc(100vh - 68px)' },
    base: { height: 'calc(100vh - 68px - 16px)' }
  });

  const dispatch = useDispatch();
  const exchange = useSelector(exchangeSelector);
  const account = useSelector(accountSelector);
  const web3 = useSelector(web3Selector);
  const token = useSelector(tokenSelector);

  const loadBlockchainData = async () => {
    await loadAllOrders(exchange, dispatch);
  };

  useEffect(async () => {
    await loadBlockchainData();
    subscribeToEvents(web3, exchange, token, account, dispatch);
  }, []);

  return (
    <GridItem>
      <Grid
        style={gridHeight}
        overflow="scroll"
        p="4"
        templateRows={gridTemplateRows}
        templateColumns={gridTemplateColumns}
        gap={4}
        color="gray.700"
      >
        <GridItem
          borderRadius="xl"
          colSpan={mediumScreenAndUp && 1}
          colStart={mediumScreenAndUp && 1}
          bg="pink.50"
          shadow="lg"
          p="2"
        >
          <Balance />
        </GridItem>

        <GridItem
          borderRadius="xl"
          colSpan={mediumScreenAndUp && 1}
          rowStart={mediumScreenAndUp && 2}
          colStart={mediumScreenAndUp && 1}
          bg="pink.50"
          shadow="lg"
          p="2"
        >
          <NewOrder />
        </GridItem>

        <GridItem
          borderRadius="xl"
          overflow={mediumScreenAndUp ? 'scroll' : 'initial'}
          colSpan={1}
          rowSpan={mediumScreenAndUp && 2}
          bg="pink.50"
          shadow="lg"
          p="2"
        >
          <OrderBook />
        </GridItem>

        <GridItem
          borderRadius="xl"
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
          borderRadius="xl"
          overflow={mediumScreenAndUp ? 'scroll' : 'initial'}
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
          borderRadius="xl"
          overflow={mediumScreenAndUp ? 'scroll' : 'initial'}
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
  );
};

export default Exchange;
