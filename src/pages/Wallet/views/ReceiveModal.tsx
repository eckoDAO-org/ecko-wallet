import { useSelector } from 'react-redux';
import styled from 'styled-components';
import images from 'src/images';
import { BaseTextInput } from 'src/baseComponent';
import QRCode from 'qrcode.react';
import { toast } from 'react-toastify';
import Toast from 'src/components/Toast/Toast';
import BaseInfoDisable from 'src/components/BaseInfoDisable/BaseInfoDisable';

const ReceiveContent = styled.div`
  padding: 20px 0;
`;
const Item = styled.div`
  margin-bottom: 30px;
`;
const Text = styled.div`
  text-align: center;

  margin-bottom: 20px;
  font-weight: 700;
  font-size: 16px;
`;
const DivChild = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ReceiveModal = () => {
  const { chainId, account } = useSelector((state) => state?.wallet);

  return (
    <ReceiveContent>
      <Item>
        <BaseTextInput inputProps={{ readOnly: true, value: chainId }} title="Chain ID" height="auto" />
      </Item>
      <Item>
        <BaseInfoDisable
          title="Your Account Name"
          label={account}
          image={{
            width: '12px',
            height: '12px',
            src: images.wallet.copyGray,
            callback: () => {
              navigator.clipboard.writeText(account);
              toast.success(<Toast type="success" content="Copied!" />);
            },
          }}
        />
      </Item>
      <Text>QR Code</Text>
      <DivChild>
        <QRCode id="receive" value={account} size={200} level="H" />
      </DivChild>
    </ReceiveContent>
  );
};

export default ReceiveModal;
