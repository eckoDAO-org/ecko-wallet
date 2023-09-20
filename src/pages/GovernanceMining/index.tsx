import React from 'react';
import { GovernanceMiningContextProvider } from 'src/contexts/GovernanceMiningContext';
import GovernanceMiningUI from './UI';

const KDXGovernanceMining = () => (
  <GovernanceMiningContextProvider>
    <GovernanceMiningUI />
  </GovernanceMiningContextProvider>
);

export default KDXGovernanceMining;
