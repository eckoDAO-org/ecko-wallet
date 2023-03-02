import { useSelector } from 'react-redux';
import styled from 'styled-components';
import images from 'src/images';
import QRCode from 'qrcode.react';
import { toast } from 'react-toastify';
import Toast from 'src/components/Toast/Toast';
import { DivFlex, SecondaryLabel } from 'src/components';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

const Label = styled.span`
  font-weight: 500;
  font-size: 14px;
  color: ${($props) => $props.color || $props.theme?.text?.primary || '#000000'};
  word-break: break-word;
`;

export const Icon = styled.img`
  cursor: pointer;
`;

export const ReceiveTitle = styled(SecondaryLabel)`
  font-size: 10px;
`;
export const ReceiveSection = styled.div`
  border-top: ${($props) => $props.theme?.border};
  padding: 24px;
`;

const ReceiveModal = () => {
  const { account } = useSelector((state) => state?.wallet);

  const onCopy = (str: string) => {
    navigator.clipboard.writeText(str);
    toast.success(<Toast type="success" content="Copied!" />);
  };

  return (
    <>
      <DivFlex alignItems="center" justifyContent="center" style={{ paddingBottom: 30 }}>
        <div style={{ background: 'white', padding: 10 }}>
          <QRCode id="receive" value={account} size={200} level="H" />
        </div>
      </DivFlex>
      <ReceiveSection style={{ marginBottom: 30 }}>
        <DivFlex justifyContent="space-between" alignItems="center" style={{ marginBottom: 20 }}>
          <ReceiveTitle fontSize={10}>YOUR ACCOUNT NAME</ReceiveTitle>
          <Icon src={images.wallet.copyGray} onClick={() => onCopy(account)} />
        </DivFlex>
        <DivFlex justifyContent="flex-start" alignItems="flex-start">
          <Jazzicon diameter={24} seed={jsNumberForAddress(account)} paperStyles={{ marginRight: 5, minWidth: 24 }} />
          <Label>{account}</Label>
        </DivFlex>
      </ReceiveSection>
    </>
  );
};

export default ReceiveModal;
