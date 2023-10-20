import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { DivBottomShadow, DivFlex } from 'src/components';
import { NavigationHeader } from 'src/components/NavigationHeader';
import { BodyFullScreen, FooterFullScreen, PageFullScreen } from 'src/components/Page';
import { Details, GasWarning, Position, Staking, VotingPowerBar, Withdraw } from 'src/components/GovernanceMining';
import images from 'src/images';

const Header = styled.div`
  padding: 0 20px;
`;

const Icon = styled.img`
  width: 72px;
  height: 72px;
`;

const PositionContainer = styled(DivFlex)`
  width: 100%;
  align-items: center;
`;

const GovernanceMining = () => {
  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  return (
    <PageFullScreen>
      <Header>
        <NavigationHeader title="Governance Mining" onBack={goBack} />
      </Header>
      <BodyFullScreen>
        <DivBottomShadow justifyContent="center" flexDirection="column" alignItems="center" gap="16px" padding="20px" marginBottom="24px">
          <PositionContainer>
            <Icon src={images.governance.governanceMiningKdx} />
            <Position />
          </PositionContainer>
          <GasWarning />
          <Staking />
        </DivBottomShadow>
        <DivFlex justifyContent="center" flexDirection="column" padding="0 20px" gap="16px">
          <Details />
          <VotingPowerBar />
        </DivFlex>
        <FooterFullScreen>
          <Withdraw />
        </FooterFullScreen>
      </BodyFullScreen>
    </PageFullScreen>
  );
};

export default GovernanceMining;
