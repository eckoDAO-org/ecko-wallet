import { toast } from 'react-toastify';
import styled from 'styled-components';
import Button from 'src/components/Buttons';
import SimpleToast from 'src/components/Toast/SimpleToast';
import { useModalContext } from 'src/contexts/ModalContext';
import { useAppSelector } from 'src/stores/hooks';
import { canTrackPortfolio } from 'src/stores/slices/analytics';
import { DivFlex, SecondaryLabel } from 'src/components';
import images from 'src/images';
import InfoIcon from 'src/images/info.svg';
import PortfolioValueApproved from '../PortfolioValueApproved';
import { Container } from '../UI';
import Confirm from './Confirm';
import DisclaimerInfo from './DisclaimerInfo';

const Content = styled.div`
  width: 100%;
  height: 240px;
  background: url(${images.analytics.portfolioValueBlurred}) no-repeat center center;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TrackButton = styled(Button)`
  background: transparent;
  border: 1px solid white;
  color: white;
  margin: 16px;
  width: 100%;
  max-width: 400px;
`;

const ButtonWrapper = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0px;
`;

const IconContainer = styled.img`
  width: 24px;
  height: 24px;
`;

const PortfolioValue = () => {
  const trackPortfolio = useAppSelector(canTrackPortfolio());
  const { openModal, closeModal } = useModalContext();

  const handleTrackPortfolio = () => {
    openModal({
      title: 'Track Portfolio Value',
      content: <Confirm onConfirm={closeModal} />,
    });
  };

  const onInfo = () => {
    toast.warning(
      <SimpleToast content={<DisclaimerInfo />} />,
      {
        autoClose: false,
        toastId: 'portfolioValueApprovedInfo',
      },
    );
  };

  const children = (
    trackPortfolio ? (
      <PortfolioValueApproved />
    ) : (
      <Content>
        <TrackButton label="Start Tracking" onClick={handleTrackPortfolio} />
      </Content>
    )
  );

  return (
    <Container>
      <DivFlex flexDirection="row" alignItems="center" gap="12px">
        <SecondaryLabel>PORTFOLIO VALUE CHART</SecondaryLabel>
        <ButtonWrapper onClick={onInfo}>
          <IconContainer src={InfoIcon} />
        </ButtonWrapper>
      </DivFlex>
      {children}
    </Container>
  );
};

export default PortfolioValue;
