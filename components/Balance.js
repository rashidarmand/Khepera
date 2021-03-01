import {
  Button,
  Heading,
  NumberInput,
  NumberInputField,
  Spinner,
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
import {
  etherDepositAmountChanged,
  etherWithdrawAmountChanged,
  tokenDepositAmountChanged,
  tokenWithdrawAmountChanged
} from '@store/actions';
import { depositEther, depositToken, loadBalances, withdrawEther, withdrawToken } from '@store/effects';
import {
  accountSelector,
  etherBalanceSelector,
  etherDepositAmountSelector,
  etherWithdrawAmountSelector,
  exchangeEtherBalanceSelector,
  exchangeSelector,
  exchangeTokenBalanceSelector,
  loadingBalancesSelector,
  tokenBalanceSelector,
  tokenDepositAmountSelector,
  tokenSelector,
  tokenWithdrawAmountSelector,
  web3Selector
} from '@store/selectors';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const TableRows = ({
  web3,
  token,
  account,
  exchange,
  dispatch,
  selectedTab,
  etherBalance,
  tokenBalance,
  exchangeEtherBalance,
  exchangeTokenBalance,
  etherDepositAmount,
  etherWithdrawAmount,
  tokenDepositAmount,
  tokenWithdrawAmount
}) => {
  const trWithInputProps = {
    web3,
    token,
    account,
    dispatch,
    exchange,
    onDepositTab: selectedTab === 'Deposit'
  };
  const trWithInputPropsForEther = {
    depositHandlers: {
      handleOnChange: (amount) => dispatch(etherDepositAmountChanged(amount)),
      handleOnClick: () => depositEther(etherDepositAmount, exchange, web3, account, dispatch)
    },
    withdrawHandlers: {
      handleOnChange: (amount) => dispatch(etherWithdrawAmountChanged(amount)),
      handleOnClick: () => withdrawEther(etherWithdrawAmount, exchange, web3, account, dispatch)
    }
  };
  const trWithInputPropsForToken = {
    depositHandlers: {
      handleOnChange: (amount) => dispatch(tokenDepositAmountChanged(amount)),
      handleOnClick: () => depositToken(tokenDepositAmount, exchange, token, web3, account, dispatch)
    },
    withdrawHandlers: {
      handleOnChange: (amount) => dispatch(tokenWithdrawAmountChanged(amount)),
      handleOnClick: () => withdrawToken(tokenWithdrawAmount, exchange, token, web3, account, dispatch)
    }
  };
  return (
    <>
      <Tr>
        <Td>ETH</Td>
        <Td isNumeric>{etherBalance}</Td>
        <Td isNumeric>{exchangeEtherBalance}</Td>
      </Tr>
      <TrWithInput {...trWithInputProps} {...trWithInputPropsForEther} placeholder="ETH Amount" />
      <Tr>
        <Td>KHEP</Td>
        <Td isNumeric>{tokenBalance}</Td>
        <Td isNumeric>{exchangeTokenBalance}</Td>
      </Tr>
      <TrWithInput {...trWithInputProps} {...trWithInputPropsForToken} placeholder="KHEP Amount" />
    </>
  );
};

const TrWithInput = ({ placeholder, onDepositTab, depositHandlers, withdrawHandlers }) => {
  const showDeposit = () => (
    <>
      <NumberInput min={0} max={1000} onChange={depositHandlers.handleOnChange}>
        <NumberInputField placeholder={placeholder} />
      </NumberInput>

      <Button colorScheme="purple" variant="outline" size="sm" onClick={depositHandlers.handleOnClick}>
        Deposit
      </Button>
    </>
  );

  const showWithdraw = () => (
    <>
      <NumberInput min={0} max={1000} onChange={withdrawHandlers.handleOnChange}>
        <NumberInputField placeholder={placeholder} />
      </NumberInput>

      <Button colorScheme="purple" variant="outline" size="sm" onClick={withdrawHandlers.handleOnClick}>
        Withdraw
      </Button>
    </>
  );

  return (
    <>
      <Tr>
        <Td colSpan="3" px="0">
          <Stack spacing={4} direction="row" align="center" justify="center">
            {onDepositTab ? showDeposit() : showWithdraw()}
          </Stack>
        </Td>
      </Tr>
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

const Balance = () => {
  const options = ['Deposit', 'Withdraw'];
  const [tabIndex, setTabIndex] = useState(0);
  const selectedTab = options[tabIndex];
  const dispatch = useDispatch();
  const exchange = useSelector(exchangeSelector);
  const account = useSelector(accountSelector);
  const web3 = useSelector(web3Selector);
  const token = useSelector(tokenSelector);
  const etherBalance = useSelector(etherBalanceSelector);
  const tokenBalance = useSelector(tokenBalanceSelector);
  const exchangeEtherBalance = useSelector(exchangeEtherBalanceSelector);
  const exchangeTokenBalance = useSelector(exchangeTokenBalanceSelector);
  const loadingBalances = useSelector(loadingBalancesSelector);
  const etherDepositAmount = useSelector(etherDepositAmountSelector);
  const etherWithdrawAmount = useSelector(etherWithdrawAmountSelector);
  const tokenDepositAmount = useSelector(tokenDepositAmountSelector);
  const tokenWithdrawAmount = useSelector(tokenWithdrawAmountSelector);
  const showTableRows = !loadingBalances;
  const tableRowsProps = {
    web3,
    token,
    account,
    exchange,
    dispatch,
    selectedTab,
    etherBalance,
    tokenBalance,
    tokenDepositAmount,
    tokenWithdrawAmount,
    etherDepositAmount,
    etherWithdrawAmount,
    exchangeTokenBalance,
    exchangeEtherBalance
  };

  const loadBlockchainData = async (dispatch) => {
    await loadBalances(web3, exchange, token, account, dispatch);
  };

  useEffect(async () => {
    await loadBlockchainData(dispatch);
  }, []);

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
        <Tbody>{showTableRows ? <TableRows {...tableRowsProps} /> : <LoadingTableRows />}</Tbody>
      </Table>
    </>
  );
};

export default Balance;
