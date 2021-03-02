import { Grid } from '@chakra-ui/react';
import Landing from '@components/Landing';
import Navbar from '@components/Navbar';
import { contractsLoadedSelector } from '@store/selectors';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useSelector } from 'react-redux';

const Exchange = dynamic(() => import('@components/Exchange'), { ssr: false });

const Home = () => {
  const contractsLoaded = useSelector(contractsLoadedSelector);

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

      {contractsLoaded ? <Exchange /> : <Landing />}
    </Grid>
  );
};

export default Home;
