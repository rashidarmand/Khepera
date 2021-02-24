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
  Tr
} from '@chakra-ui/react';
import { useState } from 'react';

const NewOrder = () => {
  const options = ['Buy', 'Sell'];
  const [tabIndex, setTabIndex] = useState(0);
  const selectedOption = options[tabIndex];
  const orderButtonText = `${selectedOption} Order`;
  const amountTitle = `${selectedOption} Amount (KHEP)`;
  const priceTitle = `${selectedOption} Price`;

  return (
    <>
      <Heading size="md" p="4" shadow="sm">
        New Order
      </Heading>

      <Tabs onChange={(index) => setTabIndex(index)} my="4" variant="soft-rounded" colorScheme="purple">
        <TabList>
          <Tab>Buy</Tab>
          <Tab>Sell</Tab>
        </TabList>
      </Tabs>

      <Table size="sm">
        <Tbody>
          <Tr>
            <Td fontWeight="bold">{amountTitle}</Td>
          </Tr>
          <Tr>
            <Td colSpan="3" px="0">
              <Stack spacing={4} direction="row" align="center" justify="center">
                <NumberInput min={0} max={20} w="100%">
                  <NumberInputField placeholder={selectedOption + ' Amount'} />
                </NumberInput>
              </Stack>
            </Td>
          </Tr>
          <Tr>
            <Td fontWeight="bold">{priceTitle}</Td>
          </Tr>
          <Tr>
            <Td colSpan="3" px="0">
              <Stack spacing={4} direction="row" align="center" justify="center">
                <NumberInput min={0} max={20} w="100%">
                  <NumberInputField placeholder={selectedOption + ' Price'} />
                </NumberInput>
              </Stack>
            </Td>
          </Tr>
          <Tr>
            <Td colSpan="3" px="0">
              <Stack spacing={4} direction="row" align="center" justify="center" mt="4">
                {selectedOption === 'Buy' ? (
                  <Button colorScheme="purple" variant="outline" size="sm" w="100%" maxW="325px">
                    {orderButtonText}
                  </Button>
                ) : (
                  <Button colorScheme="purple" variant="outline" size="sm" w="100%" maxW="325px">
                    {orderButtonText}
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

export default NewOrder;
