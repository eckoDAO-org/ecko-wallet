import React from 'react';
import styled from 'styled-components';
import { useGovernanceMining } from 'src/contexts/GovernanceMiningContext';
import { Warning } from 'src/pages/SendTransactions/styles';
import { ReactComponent as AlertIconSVG } from 'src/images/icon-alert.svg';
import { useStakingConstants } from '../constants/staking';

const Container = styled(Warning)`
  padding: 10px 0;
  justify-content: center;
  width: 100%;
`;

const GasWarning = () => {
  const { hasGas } = useGovernanceMining();
  const { chainId } = useStakingConstants();

  if (hasGas !== false) {
    return null;
  }

  return (
    <Container>
      <AlertIconSVG />
      <div>
        Insufficient Gas. You need KDA in chain {chainId}
      </div>
    </Container>
  );
};

export default GasWarning;
