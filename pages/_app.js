import '../styles/globals.scss';

import { ChakraProvider } from '@chakra-ui/react';
import { css, Global } from '@emotion/react';
import theme from '@lib/theme';
import { useStore } from '@store/store';
import { Provider as StoreProvider } from 'react-redux';

function MyApp({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState);

  return (
    <ChakraProvider theme={theme}>
      <Global
        styles={css`
          html {
            min-width: 360px;
            scroll-behavior: smooth;
          }
          #__next {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
          }
        `}
      />
      <StoreProvider store={store}>
        <Component {...pageProps} />
      </StoreProvider>
    </ChakraProvider>
  );
}

export default MyApp;
