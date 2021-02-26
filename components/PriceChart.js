import { Box, Center, Flex, Heading, Spinner } from '@chakra-ui/react';
import { chartOptions, dummyData } from '@lib/price-chart-config';
import { priceChartLoadedSelector, priceChartSelector } from '@store/selectors';
import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';

const showPriceChart = ({ series, lastPrice, lastPriceChange }) => {
  return (
    <>
      <Heading size="lg" p="4">
        KHEP-ETH {priceSymbol(lastPriceChange)} {lastPrice}
      </Heading>

      <Box flexGrow="1">
        <Chart options={chartOptions} series={series} type="candlestick" width="100%" height="100%" />
      </Box>
    </>
  );
};

const priceSymbol = (lastPriceChange) => {
  return lastPriceChange === '+' ? (
    <Box as="span" color="green">
      &#9650;
    </Box>
  ) : (
    <Box as="span" color="green">
      &#9660;
    </Box>
  );
};

const PriceChart = () => {
  const priceChartLoaded = useSelector(priceChartLoadedSelector);
  const priceChart = useSelector(priceChartSelector);

  return (
    <Flex direction="column" h="100%">
      <Heading size="md" p="4" shadow="sm">
        Price Chart
      </Heading>

      {priceChartLoaded ? (
        showPriceChart(priceChart)
      ) : (
        <Center flexGrow="1">
          <Spinner size="xl" />
        </Center>
      )}
    </Flex>
  );
};

export default PriceChart;
