import {
  Button,
  Center,
  Heading,
  NumberInput,
  NumberInputField,
  Spinner,
  Stack,
  Tab,
  Table,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Tr
} from '@chakra-ui/react';
import {
  buyOrderAmountChanged,
  buyOrderPriceChanged,
  sellOrderAmountChanged,
  sellOrderPriceChanged
} from '@store/actions';
import { createBuyOrder, createSellOrder } from '@store/effects';
import {
  accountSelector,
  buyOrderSelector,
  exchangeSelector,
  sellOrderSelector,
  tokenSelector,
  web3Selector
} from '@store/selectors';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const OrderForm = ({
  amountTitle,
  amountPlaceholder,
  priceTitle,
  pricePlaceholder,
  handlers,
  orderButtonText,
  showTotal,
  order
}) => {
  return (
    <Table size="sm">
      <Tbody>
        <Tr>
          <Td fontWeight="bold">{amountTitle}</Td>
        </Tr>
        <Tr>
          <Td colSpan="3" px="0">
            <Stack spacing={4} direction="row" align="center" justify="center">
              <NumberInput min={0} max={1000} w="100%" onChange={handlers.handleAmountChange}>
                <NumberInputField placeholder={amountPlaceholder} />
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
              <NumberInput min={0} max={1000} w="100%" onChange={handlers.handlePriceChange}>
                <NumberInputField placeholder={pricePlaceholder} />
              </NumberInput>
            </Stack>
          </Td>
        </Tr>
        <Tr>
          <Td colSpan="3" px="0">
            <Stack spacing={4} direction="row" align="center" justify="center">
              <Button
                onClick={handlers.handleClick}
                colorScheme="purple"
                variant="outline"
                size="sm"
                w="100%"
                maxW="325px"
              >
                {orderButtonText}
              </Button>
            </Stack>
          </Td>
        </Tr>
        {showTotal && (
          <Tr>
            <Td colSpan="3" px="0">
              Total: {order.amount * order.price} ETH
            </Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  );
};

const Loading = () => (
  <Center h="80%" flexGrow="1">
    <Spinner size="xl" />
  </Center>
);

const NewOrder = () => {
  const options = ['Buy', 'Sell'];
  const [tabIndex, setTabIndex] = useState(0);
  const selectedOption = options[tabIndex];
  const amountTitle = `${selectedOption} Amount (KHEP)`;
  const amountPlaceholder = `${selectedOption} Amount`;
  const priceTitle = `${selectedOption} Price`;
  const pricePlaceholder = `${selectedOption} Price`;
  const orderButtonText = `${selectedOption} Order`;

  const dispatch = useDispatch();
  const account = useSelector(accountSelector);
  const exchange = useSelector(exchangeSelector);
  const token = useSelector(tokenSelector);
  const web3 = useSelector(web3Selector);
  const buyOrder = useSelector(buyOrderSelector);
  const sellOrder = useSelector(sellOrderSelector);
  const showForm = !buyOrder.creating && !sellOrder.creating;

  const orderFormProps = { amountTitle, amountPlaceholder, priceTitle, pricePlaceholder, orderButtonText };
  const buyOrderProps = {
    order: buyOrder,
    showTotal: buyOrder.amount && buyOrder.price,
    handlers: {
      handleAmountChange: (amount) => dispatch(buyOrderAmountChanged(amount)),
      handlePriceChange: (price) => dispatch(buyOrderPriceChanged(price)),
      handleClick: () => createBuyOrder(exchange, token, web3, buyOrder, account, dispatch)
    }
  };
  const sellOrderProps = {
    order: sellOrder,
    showTotal: sellOrder.amount && sellOrder.price,
    handlers: {
      handleAmountChange: (amount) => dispatch(sellOrderAmountChanged(amount)),
      handlePriceChange: (price) => dispatch(sellOrderPriceChanged(price)),
      handleClick: () => createSellOrder(exchange, token, web3, sellOrder, account, dispatch)
    }
  };

  return (
    <>
      <Heading size="md" p="4" shadow="sm">
        New Order
      </Heading>

      {!showForm ? (
        <Loading />
      ) : (
        <Tabs onChange={(index) => setTabIndex(index)} my="4" variant="soft-rounded" colorScheme="purple">
          <TabList>
            <Tab>Buy</Tab>
            <Tab>Sell</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <OrderForm {...orderFormProps} {...buyOrderProps} />
            </TabPanel>
            <TabPanel>
              <OrderForm {...orderFormProps} {...sellOrderProps} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </>
  );
};

export default NewOrder;
