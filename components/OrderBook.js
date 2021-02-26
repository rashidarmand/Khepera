import { Box, Flex, Heading, Spinner, Table, Tbody, Td, Tr } from '@chakra-ui/react';
import { orderBookLoadedSelector, orderBookSelector } from '@store/selectors';
import { useSelector } from 'react-redux';

const OrderBookTableRows = ({ orderBook }) => {
  const { buy, sell } = orderBook;

  const renderOrderRow = (order) => (
    <Tr key={order.id}>
      <Td>{order.tokenAmount}</Td>
      <Td color={order.orderTypeColor}>{order.tokenPrice}</Td>
      <Td isNumeric>{order.etherAmount}</Td>
    </Tr>
  );

  return (
    <>
      {sell.map(renderOrderRow)}
      <Tr>
        <Td fontWeight="bold">KHEP</Td>
        <Td fontWeight="bold">KHEP/ETH</Td>
        <Td fontWeight="bold" textAlign="center">
          ETH
        </Td>
      </Tr>
      {buy.map(renderOrderRow)}
    </>
  );
};

const LoadingTableRows = () => (
  <Tr>
    <Td colSpan="3" pt="6" textAlign="center">
      <Spinner size="xl" />
    </Td>
  </Tr>
);

const OrderBook = () => {
  const orderBook = useSelector(orderBookSelector);
  const showOrderBook = useSelector(orderBookLoadedSelector);

  return (
    <Flex h="100%" direction="column">
      <Heading size="md" p="4" shadow="sm">
        Order Book
      </Heading>

      <Box flexGrow="1" mt="4">
        <Table size="sm" h="100%">
          <Tbody>{showOrderBook ? <OrderBookTableRows orderBook={orderBook} /> : <LoadingTableRows />}</Tbody>
        </Table>
      </Box>
    </Flex>
  );
};

export default OrderBook;
