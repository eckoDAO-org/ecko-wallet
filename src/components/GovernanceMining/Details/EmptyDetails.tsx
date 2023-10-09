import React from 'react';
import { Container, Key, Value } from './UI';

const EmptyDetails = () => (
  <Container>
    <Key>KDX collected</Key>
    <Value>— KDX</Value>

    <Key>Waiting time</Key>
    <Value>—</Value>

    <Key>Reward penalty</Key>
    <Value>None</Value>

    <Key>Voting Power</Key>
    <Value>—</Value>
  </Container>
);

export default EmptyDetails;
