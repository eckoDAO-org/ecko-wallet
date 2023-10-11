import React from 'react';
import styled from 'styled-components';
import { TokenElement } from 'src/pages/Wallet/components/TokenElement';
import { DivFlex, SecondaryLabel } from 'src/components';
import Button from 'src/components/Buttons';
import images from 'src/images';

export interface BaseConfirmAmountViewProps {
  amount: number;
  usdAmount: number;
  summaryTitle: string;
  summaryDescription: string;
  summaryDetails?: React.ReactNode;
  title: string;
  details?: React.ReactNode;
  isLoading: boolean;
  onConfirm: () => void;
}

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

const BaseConfirmAmount = ({
  amount,
  usdAmount,
  summaryTitle,
  summaryDescription,
  summaryDetails,
  title,
  details,
  isLoading,
  onConfirm,
}: BaseConfirmAmountViewProps) => (
  <DivFlex flexDirection="column" padding="24px" paddingTop="0px" gap="8px">
    <Subtitle>{summaryTitle}</Subtitle>
    <Description>{summaryDescription}</Description>

    {summaryDetails}

    <Separator />

    <Subtitle>{title}</Subtitle>
    <TokenElement
      name="KDX"
      balance={amount}
      usdBalance={usdAmount}
      logo={images.wallet.tokens['kaddex.kdx']}
    />

    {details}

    <DivFlex justifyContent="center" padding="4px" paddingTop="8px">
      <Button isDisabled={isLoading} label={isLoading ? '...' : 'Confirm'} size="full" variant="primary" onClick={onConfirm} />
    </DivFlex>
  </DivFlex>
);

export default BaseConfirmAmount;
