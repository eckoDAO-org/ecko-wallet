import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { DivBottomShadow, DivFlex } from 'src/components';
import Button from 'src/components/Buttons';
import { NavigationHeader } from 'src/components/NavigationHeader';
import { Body, PageFullWidth } from 'src/components/Page';
import { Details, Position, Staking, VotingPowerBar } from 'src/components/GovernanceMining';
import images from 'src/images';

const Header = styled.div`
  padding: 0 20px;
`;

const Icon = styled.img`
  width: 72px;
  height: 72px;
`;

const WithdrawButton = styled(Button)`
  background: transparent;
  border: 1px solid #9FA6AB;
  opacity: 0.7;
`;

const GovernanceMining = () => {
  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  return (
    <PageFullWidth>
      <Header>
        <NavigationHeader title="Governance Mining" onBack={goBack} />
      </Header>
      <Body>
        <DivBottomShadow justifyContent="center" flexDirection="column" alignItems="center" gap="16px" padding="20px" marginBottom="24px">
          <Icon src={images.governance.governanceMiningKdx} />
          <Position />
          <Staking />
        </DivBottomShadow>
        <DivFlex justifyContent="center" flexDirection="column" padding="0 20px" gap="16px">
          <Details />
          <VotingPowerBar />
          <WithdrawButton label="Withdraw" />
        </DivFlex>
      </Body>
    </PageFullWidth>
  );
};

export default GovernanceMining;
