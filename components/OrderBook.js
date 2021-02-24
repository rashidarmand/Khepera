import { Box, Flex, Heading, Table, Tbody, Td, Tr } from '@chakra-ui/react';

const OrderBook = () => {
  const _numberOfOrders = Array.from({ length: 9 }, (_, i) => i);

  return (
    <Flex h="100%" direction="column">
      <Heading size="md" p="4" shadow="sm">
        Order Book
      </Heading>

      <Box flexGrow="1" mt="4">
        <Table size="sm" h="100%">
          <Tbody>
            {_numberOfOrders.map((o) => (
              <Tr key={o}>
                <Td>100</Td>
                <Td color="red">2.00008</Td>
                <Td isNumeric>0.01</Td>
              </Tr>
            ))}
            <Tr>
              <Td fontWeight="bold">KHEP</Td>
              <Td fontWeight="bold">KHEP/ETH</Td>
              <Td fontWeight="bold" textAlign="center">
                ETH
              </Td>
            </Tr>
            {_numberOfOrders.map((o) => (
              <Tr key={o}>
                <Td>100</Td>
                <Td color="green">2.00008</Td>
                <Td isNumeric>0.01</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Flex>
  );
};

export default OrderBook;
