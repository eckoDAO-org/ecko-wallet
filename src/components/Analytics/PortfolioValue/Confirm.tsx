import { useState } from 'react';
import styled from 'styled-components';
import { DivFlex, SecondaryLabel } from 'src/components';
import Button from 'src/components/Buttons';
import { useAppDispatch } from 'src/stores/hooks';
import { startTrackPortfolio } from 'src/stores/slices/analytics';
import Disclaimer from './Disclaimer';

const Subtitle = styled(SecondaryLabel)`
  text-transform: uppercase;
  color: #A0A6AA;
  font-weight: bold;
`;

const Description = styled(SecondaryLabel)`
  font-weight: 300;
  font-size: 14px;
  margin-bottom: 8px;
`;

const Separator = styled.div`
  margin: 8px 0px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const Confirm = ({ onConfirm }: ConfirmProps) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleConfirm = async () => {
    if (loading) return;
    setLoading(true);
    dispatch(startTrackPortfolio());
    onConfirm?.();
  };

  return (
    <DivFlex flexDirection="column" padding="24px" paddingTop="0px" gap="8px">
      <Subtitle>START ACCOUNT BALANCE MONITORING</Subtitle>
      <Description>By confirming, you&apos;re authorising the start of tracking for your account balance.</Description>
      <Description>Proceed?</Description>
      <Separator />
      <Disclaimer />

      <DivFlex justifyContent="center" padding="4px" paddingTop="8px">
        { loading ? (
          <Button label="Confirming, please wait..." size="full" variant="primary" disabled />
        ) : (
          <Button label="Confirm" size="full" variant="primary" onClick={handleConfirm} />
        )}
      </DivFlex>
    </DivFlex>
  );
};

interface ConfirmProps {
  onConfirm?: () => void;
}

export default Confirm;
