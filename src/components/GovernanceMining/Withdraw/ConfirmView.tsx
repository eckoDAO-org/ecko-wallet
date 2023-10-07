import React from 'react';
import styled from 'styled-components';
import { TokenElement } from 'src/pages/Wallet/components/TokenElement';
import { DivFlex, SecondaryLabel } from 'src/components';
import Button from 'src/components/Buttons';
import images from 'src/images';

interface ConfirmAmountViewProps {
  amount: number;
  usdAmount: number;
  onConfirm: () => void;
}

const Subtitle = styled(SecondaryLabel)`
  text-transform: uppercase;
  color: #A0A6AA;
  fontWeight: bold;
`;

const ConfirmAmount = ({
  amount,
  usdAmount,
  onConfirm,
}: ConfirmAmountViewProps) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleConfirm = () => {
    setIsLoading(true);
    onConfirm();
  };

  return (

    <DivFlex flexDirection="column" padding="24px" paddingTop="0px" gap="8px">
      <Subtitle>
        Staking rewards collected
      </Subtitle>

      <TokenElement
        name="KDX"
        balance={amount}
        usdBalance={usdAmount}
        logo={images.wallet.tokens['kaddex.kdx']}
      />

      <DivFlex justifyContent="center" padding="4px" paddingTop="8px">
        <Button isDisabled={isLoading} label={isLoading ? '...' : 'Continue'} size="full" variant="primary" onClick={handleConfirm} />
      </DivFlex>
    </DivFlex>
  );
};

export default ConfirmAmount;
