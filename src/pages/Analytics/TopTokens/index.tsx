import React, { forwardRef } from 'react';
import PairTrend from 'src/components/Analytics/PairTrend';
import TokenTrend from 'src/components/Analytics/TokenTrend';
import { useDexPairs } from 'src/hooks/dexPairs';
import { useDexTokensPerformance } from 'src/hooks/dexTokensPerformance';
import images from 'src/images';

const TopTokens = forwardRef<HTMLDivElement>((_, ref) => {
  const { data: performanceData, isFetching } = useDexTokensPerformance('1D');
  const { data: pairs, isFetching: isPairsFetching } = useDexPairs();
  const bestPerformer = performanceData?.tickers?.reduce((max, ticker) => (ticker?.diff > max.diff ? ticker : max), performanceData.tickers[0]);
  const worstPerformer = performanceData?.tickers?.reduce((min, ticker) => (ticker?.diff < min.diff ? ticker : min), performanceData.tickers[0]);

  const topTradedPair = pairs?.reduce((max, pair) => (pair?.volume24h > max.volume24h ? pair : max), pairs[0]);

  return !isFetching ? (
    <div ref={ref}>
      <TokenTrend
        title="TOP GAINER"
        iconPath={images.wallet.tickers[bestPerformer?.ticker] ?? images.wallet.tickers.generic}
        symbol={bestPerformer.ticker}
        value={parseFloat(bestPerformer?.diff?.toFixed(2) ?? 0)}
        isUp={bestPerformer.diff > 0}
      />

      <TokenTrend
        title="TOP LOSER"
        iconPath={images.wallet.tickers[worstPerformer?.ticker] ?? images.wallet.tickers.generic}
        symbol={worstPerformer.ticker}
        value={parseFloat(worstPerformer?.diff?.toFixed(2) ?? 0)}
        isUp={worstPerformer.diff > 0}
      />

      {!isPairsFetching && topTradedPair ? (
        <PairTrend
          title="ECKODEX TOP TRADED PAIR"
          firstTokenIconPath={images.wallet.tickers[topTradedPair?.token0.name] ?? images.wallet.tickers.generic}
          secondTokenIconPath={images.wallet.tickers[topTradedPair?.token1.name] ?? images.wallet.tickers.generic}
          firstTokenSymbol={topTradedPair.token0.name}
          secondTokenSymbol={topTradedPair.token1.name}
          value={parseFloat(topTradedPair?.pricePercChange24h?.toFixed(2) ?? 0)}
          isUp={topTradedPair.pricePercChange24h > 0}
        />
      ) : null}
    </div>
  ) : null;
});

export default TopTokens;
