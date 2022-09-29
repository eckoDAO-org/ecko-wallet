import { useState } from 'react';
import ModalCustom from 'src/components/Modal/ModalCustom';
import Button from 'src/components/Buttons';
import images from 'src/images';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { BaseTextInput, InputError } from 'src/baseComponent';
import { BUTTON_SIZE } from 'src/utils/constant';
import { shortenAddress, shortenPrivateKey } from 'src/utils';
import Toast from 'src/components/Toast/Toast';
import { toast } from 'react-toastify';
import QRCode from 'qrcode.react';
import bcrypt from 'bcryptjs';
import JSPDF from 'jspdf';
import { useWindowResizeMobile } from 'src/hooks/useWindowResizeMobile';
import BaseInfoDisable from 'src/components/BaseInfoDisable/BaseInfoDisable';

const ExportPrivateKeyContent = styled.div`
  width: ${(props) => props.width};
  padding: 20px 0;
`;
const Item = styled.div`
  margin-bottom: 25px;
`;
const SubmitBtn = styled.div`
  margin-top: 100px;
  @media screen and (max-width: 480px) {
    margin-top: 30px;
  }
`;
const Div = styled.div``;

const DivChild = styled.div`
  margin-bottom: 50px;
`;
const Warning = styled.div`
  padding: 13px;
  background: #eee6f3;

  border: 1px solid #461a57;
  border-radius: 8px;
  text-align: center;
`;
const QrCodeBox = styled.div`
  display: none;
`;
const DivError = styled.div`
  margin-top: 10px;
  min-height: 50px;
`;
const ModalExportPrivateKey = (props: Props) => {
  const { isOpen, onCloseModal, closeOnOverlayClick, title, showCloseIcon } = props;
  const [isMobile] = useWindowResizeMobile(420);
  const { chainId, account, secretKey } = useSelector((state) => state?.wallet);
  const { passwordHash } = useSelector((state) => state.extensions);
  const [passwordInput, setPasswordInput] = useState('');
  const [isErrorEmpty, setErrorEmpty] = useState(false);
  const [isErrorVerify, setErrorVerify] = useState(false);
  const [isVerify, setVerify] = useState(false);
  const onChangeInput = (e) => {
    setPasswordInput(e.target.value);
    if (e.target.value) {
      setErrorEmpty(false);
      setErrorVerify(false);
    } else {
      setErrorVerify(false);
    }
  };
  const handleVerifyPassword = () => {
    if (!passwordInput) {
      setErrorEmpty(true);
    } else {
      bcrypt.compare(passwordInput, passwordHash, (_errors, isValid) => {
        if (isValid) {
          setVerify(true);
        } else {
          setErrorVerify(true);
        }
      });
    }
  };
  const downloadQrCode = () => {
    const canvas = document.getElementById('export-private-key');
    const pngUrl = (canvas as any).toDataURL('image/png').replace('image/png', 'image/octet-stream');
    const doc = new JSPDF();
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Account: ${account}`, 15, 20);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Chain ID: ${chainId}`, 15, 30);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    let index = 40;
    if (secretKey.length === 64) {
      doc.text(`Private Key: ${secretKey}`, 15, index);
    } else {
      doc.text(`Private Key: ${secretKey.slice(0, 64)}`, 15, index);
      doc.text(secretKey.slice(64, 128), 35, index + 10);
      doc.text(secretKey.slice(128, 192), 35, index + 20);
      doc.text(secretKey.slice(192, 256), 35, index + 30);
      index = 70;
    }
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text('QR Code:', 15, index + 10);
    doc.addImage(pngUrl, 'PNG', 80, index + 20, 60, 60);
    doc.save(`Privatekey_${account}_chain${chainId}`);
  };
  const copyToClipboard = (value) => {
    navigator.clipboard.writeText(value);
    toast.success(<Toast type="success" content="Copied!" />);
  };
  return (
    <ModalCustom isOpen={isOpen} title={title} onCloseModal={onCloseModal} closeOnOverlayClick={closeOnOverlayClick} showCloseIcon={showCloseIcon}>
      <ExportPrivateKeyContent width={isMobile ? '260px' : '400px'}>
        <Item>
          <BaseTextInput
            inputProps={{ readOnly: true, value: shortenAddress(account) }}
            title="Account"
            height="auto"
            image={{
              width: '12px',
              height: '12px',
              src: images.wallet.copyGray,
              callback: () => copyToClipboard(account),
            }}
          />
        </Item>
        <Item>
          <BaseTextInput inputProps={{ readOnly: true, value: chainId }} title="Chain ID" height="auto" />
        </Item>
        {!isVerify && (
          <Div>
            <Item>
              <BaseTextInput
                inputProps={{ placeholder: 'Input password', type: 'password' }}
                title="Input password to show private key"
                height="auto"
                onChange={onChangeInput}
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    handleVerifyPassword();
                  }
                }}
                typeInput="password"
              />
              <DivError>
                {isErrorEmpty && <InputError marginTop="0">This field is required.</InputError>}
                {isErrorVerify && <InputError marginTop="0">Invalid Passwords.</InputError>}
              </DivError>
            </Item>
            <SubmitBtn>
              <Button label="Verify" onClick={handleVerifyPassword} />
            </SubmitBtn>
          </Div>
        )}
        {isVerify && (
          <Div>
            <DivChild>
              <BaseInfoDisable
                title="This is your private key"
                label={shortenPrivateKey(secretKey)}
                image={{
                  width: '12px',
                  height: '12px',
                  src: images.wallet.copyGray,
                  callback: () => {
                    navigator.clipboard.writeText(secretKey);
                    toast.success(<Toast type="success" content="Copied!" />);
                  },
                }}
              />
            </DivChild>
            <QrCodeBox>
              <QRCode id="export-private-key" value={secretKey} size={200} level="H" />
            </QrCodeBox>
            <Item>
              <Button label="Download" onClick={downloadQrCode} />
            </Item>
            <Warning>Warning: Never disclose this key. Anyone with your private keys can steal any assets held in your account.</Warning>
          </Div>
        )}
      </ExportPrivateKeyContent>
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

export default ModalExportPrivateKey;
