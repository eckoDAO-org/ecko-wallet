import { useSelector } from 'react-redux';
import ModalCustom from 'src/components/Modal/ModalCustom';
import styled from 'styled-components';
import images from 'src/images';
import { BaseTextInput } from 'src/baseComponent';
import QRCode from 'qrcode.react';
import { toast } from 'react-toastify';
import Toast from 'src/components/Toast/Toast';
import BaseInfoDisable from 'src/components/BaseInfoDisable/BaseInfoDisable';

const ReceiceContent = styled.div`
  padding: 20px 0;
`;
const Item = styled.div`
  margin-bottom: 30px;
`;
const Text = styled.div`
  text-align: center;
  color: #461a57;
  margin-bottom: 20px;
  font-weight: 700;
  font-size: 16px;
`;
const DivChild = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ReceiveModal = (props: Props) => {
  const { isOpen, onCloseModal, closeOnOverlayClick, showCloseIcon, title } = props;
  const { chainId, account } = useSelector((state) => state?.wallet);

  return (
    <ModalCustom isOpen={isOpen} title={title} onCloseModal={onCloseModal} closeOnOverlayClick={closeOnOverlayClick} showCloseIcon={showCloseIcon}>
      <ReceiceContent>
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
      </ReceiceContent>
    </ModalCustom>
  );
};
type Props = {
  isOpen: boolean;
  onCloseModal?: any;
  closeOnOverlayClick?: boolean;
  title?: string;
  showCloseIcon?: boolean;
};
export default ReceiveModal;
