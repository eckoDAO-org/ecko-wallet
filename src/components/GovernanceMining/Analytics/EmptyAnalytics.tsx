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
    <Value primaryLabel="— KDX" />

    <Key>APR</Key>
    <Value primaryLabel="— %" />

    <Key>Daily Volume</Key>
    <Value primaryLabel="$ —" />

    <Key>KDX Burned</Key>
    <Value primaryLabel="— KDX" />

    <Key>Staked Share</Key>
    <Value primaryLabel="— %" />

    <Key>Total Staked</Key>
    <Value primaryLabel="— %" />
  </Container>
);

export default Analytics;
