import {
  Button,
  Heading,
  NumberInput,
  NumberInputField,
  Stack,
  Tab,
  Table,
  TabList,
  Tabs,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react';
import { useState } from 'react';

const Balance = () => {
  const options = ['Deposit', 'Withdraw'];
  const [tabIndex, setTabIndex] = useState(0);
  const selectedOption = options[tabIndex];

  return (
    <>
      <Heading size="md" p="4" shadow="sm">
        Balance
      </Heading>

      <Tabs onChange={(index) => setTabIndex(index)} my="4" variant="soft-rounded" colorScheme="purple">
        <TabList>
          <Tab>Deposit</Tab>
          <Tab>Withdraw</Tab>
        </TabList>
      </Tabs>

      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Token</Th>
            <Th isNumeric>Wallet</Th>
            <Th isNumeric>Exchange</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>ETH</Td>
            <Td isNumeric>2.8</Td>
            <Td isNumeric>25.4</Td>
          </Tr>
          <Tr>
            <Td colSpan="3" px="0">
              <Stack spacing={4} direction="row" align="center" justify="center">
                <NumberInput min={0} max={20}>
                  <NumberInputField placeholder="ETH Amount" />
                </NumberInput>
                {selectedOption === 'Deposit' ? (
                  <Button colorScheme="purple" variant="outline" size="sm">
                    Deposit
                  </Button>
                ) : (
                  <Button colorScheme="purple" variant="outline" size="sm">
                    Withdraw
                  </Button>
                )}
              </Stack>
            </Td>
          </Tr>
          <Tr>
            <Td>KHEP</Td>
            <Td isNumeric>0</Td>
            <Td isNumeric>0</Td>
          </Tr>
          <Tr>
            <Td colSpan="3" px="0">
              <Stack spacing={4} direction="row" align="center" justify="center">
                <NumberInput min={0} max={20}>
                  <NumberInputField placeholder="KHEP Amount" />
                </NumberInput>
                {selectedOption === 'Deposit' ? (
                  <Button colorScheme="purple" variant="outline" size="sm">
                    Deposit
                  </Button>
                ) : (
                  <Button colorScheme="purple" variant="outline" size="sm">
                    Withdraw
                  </Button>
                )}
              </Stack>
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </>
  );
};

export default Balance;
