import React from 'react';
import { GovernanceMiningContextProvider } from 'src/contexts/GovernanceMinigContext';
import GovernanceMiningUI from './UI';

const KDXGovernanceMining = () => (
  <GovernanceMiningContextProvider>
    <GovernanceMiningUI />
  </GovernanceMiningContextProvider>
);

export default KDXGovernanceMining;
