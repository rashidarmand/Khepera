import { Heading, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';

const Trades = () => {
  const _numberOfOrders = Array.from({ length: 6 }, (_, i) => i);

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
          {_numberOfOrders.map((o, i) => (
            <Tr key={o}>
              <Td>{new Date('2/23/2021, 7:27:11 PM').toLocaleString()}</Td>
              <Td isNumeric>2.8</Td>
              <Td color={i % 3 === 0 ? 'red' : 'green'} isNumeric>
                25.4
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
};

export default Trades;
