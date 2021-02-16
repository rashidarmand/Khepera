import { Heading } from '@chakra-ui/react';
import Head from 'next/head';

import styles from '../styles/Home.module.scss';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Khepera - Decentralized Ethereum Token Exchange</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Heading>Khepera - Decentralized Ethereum Token Exchange</Heading>
    </div>
  );
}
