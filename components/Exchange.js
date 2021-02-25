import { Grid, GridItem, useBreakpointValue } from '@chakra-ui/react';
import Balance from '@components/Balance';
import MyTransactions from '@components/MyTransactions';
import NewOrder from '@components/NewOrder';
import OrderBook from '@components/OrderBook';
import PriceChart from '@components/PriceChart';
import Trades from '@components/Trades';

const Exchange = () => {
  const mediumScreenAndUp = useBreakpointValue({ md: true, base: false });
  const gridTemplateColumns = useBreakpointValue({ md: '1fr 1fr 2fr 1fr', base: '1fr' });
  const gridTemplateRows = useBreakpointValue({ md: 'repeat(2, 1fr)', base: 'repeat(6, 1fr)' });

  return (
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
  );
};

export default Exchange;