import '../styles/globals.scss';

import { ChakraProvider } from '@chakra-ui/react';
import { css, Global } from '@emotion/react';
import theme from '@lib/theme';

function MyApp({ Component, pageProps }) {
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
      <Component {...pageProps} />;
    </ChakraProvider>
  );
}

export default MyApp;
