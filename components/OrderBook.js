import { Box, Flex, Heading, Spinner, Table, Tbody, Td, Tooltip, Tr } from '@chakra-ui/react';
import { fillOrder } from '@store/effects';
import {
  accountSelector,
  exchangeSelector,
  fillingOrderSelector,
  orderBookLoadedSelector,
  orderBookSelector
} from '@store/selectors';
import { useDispatch, useSelector } from 'react-redux';

const OrderBookTableRows = ({ orderBook }) => {
  const { buy, sell } = orderBook;
  const dispatch = useDispatch();
  const exchange = useSelector(exchangeSelector);
  const account = useSelector(accountSelector);

  const renderOrderRow = (order) => {
    const orderFillMessage = `Click here to ${order.orderFillAction}`;
    const orderBelongsToUser = order.user === account;
    return (
      <Tr key={order.id}>
        <Td>{order.tokenAmount}</Td>
        <Td color={order.orderTypeColor}>{renderOrderFill(orderBelongsToUser, orderFillMessage, order)}</Td>
        <Td isNumeric>{order.etherAmount}</Td>
      </Tr>
    );
  };

  const renderOrderFill = (orderBelongsToUser, orderFillMessage, order) => {
    return orderBelongsToUser ? (
      <Box as="span">{order.tokenPrice}</Box>
    ) : (
      <Tooltip label={orderFillMessage} aria-label={orderFillMessage} hasArrow>
        <Box as="span" cursor="pointer" onClick={() => fillOrder(exchange, order, account, dispatch)}>
          {order.tokenPrice}
        </Box>
      </Tooltip>
    );
  };

  return (
    <>
      {sell?.map(renderOrderRow)}
      <Tr>
        <Td fontWeight="bold">KHEP</Td>
        <Td fontWeight="bold">KHEP/ETH</Td>
        <Td fontWeight="bold" textAlign="center">
          ETH
        </Td>
      </Tr>
      {buy?.map(renderOrderRow)}
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
  const fillingOrder = useSelector(fillingOrderSelector);
  const showOrderBook = useSelector(orderBookLoadedSelector) && !fillingOrder;

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
