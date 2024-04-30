import styled from 'styled-components';
import Button from 'src/components/Buttons';
import { useModalContext } from 'src/contexts/ModalContext';
import { useAppSelector } from 'src/stores/hooks';
import { canTrackPortfolio } from 'src/stores/slices/analytics';
import { getAccount } from 'src/stores/slices/wallet';
import images from 'src/images';
import PortfolioValueApproved from '../PortfolioValueApproved';
import { LabeledContainer } from '../UI';
import Confirm from './Confirm';

const Container = styled.div`
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

const PortfolioValue = () => {
  const account = useAppSelector(getAccount);
  const trackPortfolio = useAppSelector(canTrackPortfolio(account));
  const { openModal, closeModal } = useModalContext();

  if (trackPortfolio) {
    return <PortfolioValueApproved />;
  }

  const handleTrackPortfolio = () => {
    openModal({
      title: 'Track Portfolio Value',
      content: <Confirm onConfirm={closeModal} />,
    });
  };

  return (
    <LabeledContainer label="PORTFOLIO VALUE CHART">
      <Container>
        <TrackButton label="Start Tracking" onClick={handleTrackPortfolio} />
      </Container>
    </LabeledContainer>
  );
};

export default PortfolioValue;
