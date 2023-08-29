import React from 'react';
import GovernanceMiningUI from './UI';

const KDXGovernanceMining = () => {
  const position = 500;

  return (
    <GovernanceMiningUI
      position={position}
      collected={0}
    />
  );
};

export default KDXGovernanceMining;
