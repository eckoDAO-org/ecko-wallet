import React from 'react';
import { useGovernanceMining } from 'src/contexts/GovernanceMiningContext';
import GovernanceMiningUI from './UI';

const KDXGovernanceMining = () => {
  const governanceMining = useGovernanceMining();

  React.useEffect(() => {
    governanceMining.fetch();
  }, []);

  return (
    <GovernanceMiningUI />
  );
};

export default KDXGovernanceMining;
