import { Heading, Spinner, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { filledOrdersLoadedSelector, filledOrdersSelector } from '@store/selectors';
import { useSelector } from 'react-redux';

const FilledOrderTableRows = ({ filledOrders }) => (
  <>
    {filledOrders.map((order) => (
      <Tr key={order.id}>
        <Td>{order.formattedTimestamp}</Td>
        <Td isNumeric>{order.tokenAmount}</Td>
        <Td color={order.tokenPriceClass} isNumeric>
          {order.tokenPrice}
        </Td>
      </Tr>
    ))}
  </>
);

const LoadingTableRows = () => (
  <Tr>
    <Td colSpan="3" pt="6" textAlign="center">
      <Spinner size="xl" />
    </Td>
  </Tr>
);

const Trades = () => {
  const filledOrders = useSelector(filledOrdersSelector);
  const filledOrdersLoaded = useSelector(filledOrdersLoadedSelector);

  return (
    <>
      <Heading size="md" p="4" shadow="sm">
        Trades
      </Heading>

      <Table size="sm" mt="4">
        <Thead>
          <Tr>
            <Th>Time</Th>
            <Th isNumeric>KHEP</Th>
            <Th isNumeric>KHEP/ETH</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filledOrdersLoaded ? <FilledOrderTableRows filledOrders={filledOrders} /> : <LoadingTableRows />}
        </Tbody>
      </Table>
    </>
  );
};

export default Trades;
