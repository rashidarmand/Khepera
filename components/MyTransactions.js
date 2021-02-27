import {
  Button,
  Heading,
  Spinner,
  Tab,
  Table,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react';
import { cancelOrder } from '@store/effects';
import {
  accountSelector,
  cancellingOrderSelector,
  currentUserFilledOrdersLoadedSelector,
  currentUserFilledOrdersSelector,
  currentUserOpenOrdersLoadedSelector,
  currentUserOpenOrdersSelector,
  exchangeSelector
} from '@store/selectors';
import { useDispatch, useSelector } from 'react-redux';

const CurrentUserFilledOrders = ({ filledOrders }) => {
  return (
    <>
      {filledOrders.map((order) => (
        <Tr key={order.id}>
          <Td>{order.formattedTimestamp}</Td>
          <Td color={order.orderTypeColor} isNumeric>
            {order.orderSign}
            {order.tokenAmount}
          </Td>
          <Td color={order.orderTypeColor} isNumeric>
            {order.tokenPrice}
          </Td>
        </Tr>
      ))}
    </>
  );
};

const CurrentUserOpenOrders = ({ openOrders }) => {
  const dispatch = useDispatch();
  const exchange = useSelector(exchangeSelector);
  const account = useSelector(accountSelector);

  return (
    <>
      {openOrders.map((order) => (
        <Tr key={order.id}>
          <Td color={order.orderTypeColor}>{order.tokenAmount}</Td>
          <Td color={order.orderTypeColor} isNumeric>
            {order.tokenPrice}
          </Td>
          <Td textAlign="center">
            <Button
              onClick={() => cancelOrder(exchange, order, account, dispatch)}
              colorScheme="purple"
              variant="ghost"
              size="xs"
            >
              X
            </Button>
          </Td>
        </Tr>
      ))}
    </>
  );
};
// TODO: make loadingTableRows it's own component
const LoadingTableRows = () => (
  <Tr>
    <Td colSpan="3" pt="6" textAlign="center">
      <Spinner size="xl" />
    </Td>
  </Tr>
);

const MyTransactions = () => {
  const cancellingOrder = useSelector(cancellingOrderSelector);
  const showCurrentUserFilledOrders = useSelector(currentUserFilledOrdersLoadedSelector);
  const currentUserFilledOrders = useSelector(currentUserFilledOrdersSelector);
  const showCurrentUserOpenOrders = useSelector(currentUserOpenOrdersLoadedSelector) && !cancellingOrder;
  const currentUserOpenOrders = useSelector(currentUserOpenOrdersSelector);

  return (
    <>
      <Heading size="md" p="4" shadow="sm">
        My Transactions
      </Heading>

      <Tabs my="4" variant="soft-rounded" colorScheme="purple">
        <TabList>
          <Tab>Trades</Tab>
          <Tab>Orders</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>Time</Th>
                  <Th isNumeric>KHEP</Th>
                  <Th isNumeric>KHEP/ETH</Th>
                </Tr>
              </Thead>
              <Tbody>
                {showCurrentUserFilledOrders ? (
                  <CurrentUserFilledOrders filledOrders={currentUserFilledOrders} />
                ) : (
                  <LoadingTableRows />
                )}
              </Tbody>
            </Table>
          </TabPanel>
          <TabPanel>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>Amount</Th>
                  <Th isNumeric>KHEP/ETH</Th>
                  <Th textAlign="center">Cancel</Th>
                </Tr>
              </Thead>
              <Tbody>
                {showCurrentUserOpenOrders ? (
                  <CurrentUserOpenOrders openOrders={currentUserOpenOrders} />
                ) : (
                  <LoadingTableRows />
                )}
              </Tbody>
            </Table>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default MyTransactions;
