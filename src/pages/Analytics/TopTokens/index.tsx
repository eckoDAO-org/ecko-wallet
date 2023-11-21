import React from 'react';
import PairTrend from 'src/components/Analytics/PairTrend';
import TokenTrend from 'src/components/Analytics/TokenTrend';
import images from 'src/images';

const TopTokens = () => (
  <>
    <TokenTrend
      title="TOP GAINER"
      iconPath={images.wallet.tokens.coin}
      symbol="KDA"
      value={4.6}
      isUp
    />

    <TokenTrend
      title="TOP LOSER"
      iconPath={images.wallet.tokens['kaddex.kdx']}
      symbol="KDX"
      value={1.2}
      isUp={false}
    />

    <PairTrend
      title="ECKODEX TOP TRADED PAIR"
      firstTokenIconPath={images.wallet.tokens.coin}
      secondTokenIconPath={images.wallet.tokens['kaddex.kdx']}
      firstTokenSymbol="KDA"
      secondTokenSymbol="KDX"
      value={2.83}
      isUp
    />
  </>
);

export default TopTokens;
