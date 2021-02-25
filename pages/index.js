import { Grid, Heading } from '@chakra-ui/react';
import Navbar from '@components/Navbar';
import { loadExchange, loadToken, loadWeb3, loadWeb3Account } from '@store/effects';
import { contractsLoadedSelector } from '@store/selectors';
import { colorLog } from '@utils/helpers';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Exchange = dynamic(() => import('@components/Exchange'), { ssr: false });

const Home = () => {
  const dispatch = useDispatch();
  const contractsLoaded = useSelector(contractsLoadedSelector);

  const loadBlockchainData = async (dispatch) => {
    const web3 = await loadWeb3(dispatch);
    const networkId = await web3.eth.net.getId();
    await loadWeb3Account(web3, dispatch);
    const token = await loadToken(web3, networkId, dispatch);
    //TODO: make error object that contains all errors as keys and functions that respond to them as values
    if (!token) {
      alert('Token contract not deployed to the current network. Please select another network with Metamask.');
      return;
    }
    const exchange = await loadExchange(web3, networkId, dispatch);
    if (!exchange) {
      alert('Exchange contract not deployed to the current network. Please select another network with Metamask.');
      return;
    }
  };

  useEffect(async () => {
    await loadBlockchainData(dispatch);
    colorLog('contractsLoaded?? ', contractsLoaded);
  }, []);

  return (
    <Grid
      minH="100vh"
      minW="100vw"
      w="min-content"
      bgGradient="linear-gradient(to top, #7028e4 0%, #e5b2ca 100%)"
      templateRows="68px 1fr"
      gap={(4, 0)}
    >
      <Head>
        <title>Khepera - Decentralized Ethereum Token Exchange</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      {contractsLoaded ? <Exchange /> : <Heading>Contracts Not Loaded</Heading>}
    </Grid>
  );
};

export default Home;
