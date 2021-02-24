import { Heading, Tab, Table, TabList, TabPanel, TabPanels, Tabs, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { useState } from 'react';

const MyTransactions = () => {
  const options = ['Trades', 'Orders'];
  const [tabIndex, setTabIndex] = useState(0);
  const selectedOption = options[tabIndex];

  return (
    <>
      <Heading size="md" p="4" shadow="sm">
        My Transactions
      </Heading>

      <Tabs onChange={(index) => setTabIndex(index)} my="4" variant="soft-rounded" colorScheme="purple">
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
                <Tr>
                  <Td>{new Date('2/23/2021, 7:27:11 PM').toLocaleString()}</Td>
                  <Td isNumeric>2.8</Td>
                  <Td isNumeric>25.4</Td>
                </Tr>
              </Tbody>
            </Table>
          </TabPanel>
          <TabPanel>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>Amount</Th>
                  <Th isNumeric>KHEP/ETH</Th>
                  <Th isNumeric>Cancel</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>{new Date('2/23/2021, 7:27:11 PM').toLocaleString()}</Td>
                  <Td isNumeric>2.8</Td>
                  <Td isNumeric>25.4</Td>
                </Tr>
              </Tbody>
            </Table>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default MyTransactions;
