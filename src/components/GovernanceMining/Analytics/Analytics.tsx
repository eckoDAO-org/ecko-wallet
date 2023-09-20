import React from 'react';
import { Container, Key, Value } from './UI';

/* type DetailsProps = {
  collected: number;
  effectiveStartDate: string;
  rewardPenalty: number;
  votingPower: number;
}; */

const Analytics = () => (
  <Container>
    <Key>Daily Income</Key>
    <Value primaryLabel="0.001 KDX" secondaryLabel="<$ 0.001" />

    <Key>APR</Key>
    <Value primaryLabel="0.08 %" />

    <Key>Daily Volume</Key>
    <Value primaryLabel="$ 9,054.88" />

    <Key>KDX Burned</Key>
    <Value primaryLabel="161,151.90 KDX" secondaryLabel="0.12 %" />

    <Key>Staked Share</Key>
    <Value primaryLabel="0.00 %" secondaryLabel="0.02 KDX" />

    <Key>Total Staked</Key>
    <Value primaryLabel="65.17 %" secondaryLabel="143,239,042.62 KDX" />
  </Container>
);

export default Analytics;
