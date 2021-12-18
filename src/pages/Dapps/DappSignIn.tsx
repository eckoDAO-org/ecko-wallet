import images from 'src/images';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import {
  getLocalActiveDapps,
  getLocalDapps,
  getLocalPassword,
  getLocalSelectedNetwork,
  getLocalSelectedWallet,
  setLocalActiveDapps,
} from 'src/utils/storage';
import { decryptKey } from 'src/utils/security';
import Button from 'src/components/Buttons';
import { BUTTON_SIZE, BUTTON_TYPE } from 'src/utils/constant';
import { updateConnectMessage } from 'src/utils/message';
import { Footer } from '../SendTransactions/styles';
import { ButtonWrapper } from '../SendTransactions/views/style';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 2;
  background: linear-gradient(90deg, #E6FEFE 0%, #FDF6E6 100%);
  font-size: 14px;
  overflow-y: scroll;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 2px;
  }

  &::-webkit-scrollbar-track {
    background: rgb(226, 226, 226);
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgb(54, 54, 54);
    border-radius: 2px;
  }
`;
const CompleteWrapper = styled.div`
  padding: 20px;
  margin-top: 50px;
`;
const ConnectItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  align-items: ${(props) => (props.alignTop ? 'flex-start' : 'center')};
`;
const Div = styled.div`
  display: flex;
  align-items: center;
  width: 32%;
  justify-content: center;
  text-align: center;
  word-break: break-word;
`;
const FooterWrapper = styled(Footer)`
`;
const ConnectInfo = styled.div`
  font-size: 16px;
  font-weight: 700;
  margin: 40px 0;
  line-height: 25px;
  text-align: center;
  word-break: break-word;
`;
const ConnectDescription = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 25px;
  text-align: center;
`;
const Image = styled.img`
  width: 60px;
  height: 60px;
`;
const CenterImage = styled.img`
  width: 36%;
  height: 33px;
`;
const DappSignIn = () => {
  const [domain, setDomain] = useState('example.com.vn');
  const [icon, setIcon] = useState(images.dappsLogo);

  useEffect(() => {
    getLocalDapps((dapps) => {
      getLocalSelectedNetwork((selectedNetwork) => {
        if (selectedNetwork.networkId === dapps.networkId) {
          setDomain(dapps.domain);
          if (dapps.icon !== 'no icon') {
            setIcon(dapps.icon);
          }
        }
      }, () => {});
    }, () => {});
  }, []);

  const onSave = () => {
    getLocalDapps((dapp) => {
      getLocalActiveDapps((dapps) => {
        const newDapps = dapps || [];
        newDapps.push(dapp.domain);
        setLocalActiveDapps(newDapps, () => {});
      }, () => {
        const newDapps = [dapp.domain];
        setLocalActiveDapps(newDapps, () => {});
      });
      getLocalPassword((accountPassword) => {
        getLocalSelectedWallet((selectedWallet) => {
          const result = {
            status: 'success',
            message: 'Connected successfully',
            account: {
              chainId: selectedWallet.chainId,
              account: decryptKey(selectedWallet.account, accountPassword),
              publicKey: decryptKey(selectedWallet.publicKey, accountPassword),
            },
          };
          updateConnectMessage(result);
          setTimeout(() => {
            window.close();
          }, 500);
        }, () => {});
      }, () => {});
    }, () => {});
  };
  const onReject = () => {
    const result = {
      status: 'fail',
      message: 'Connect fail',
    };
    updateConnectMessage(result);
    setTimeout(() => {
      window.close();
    }, 500);
  };
  return (
    <Wrapper>
      <CompleteWrapper>
        <ConnectItem>
          <Div>
            <Image src={icon} alt="logo" />
          </Div>
          <CenterImage src={images.connectedDapps} alt="logo" />
          <Div>
            <Image src={images.logoDapps} alt="logo" />
          </Div>
        </ConnectItem>
        <ConnectItem alignTop>
          <Div>
            {domain}
          </Div>
          <Div>
            X Wallet extension
          </Div>
        </ConnectItem>
        <ConnectInfo>
          {`${domain} would like to connect to your account`}
        </ConnectInfo>
        <ConnectDescription>
          This site is requesting access to view your current account address. Always make sure you trust the sites you interact with.
        </ConnectDescription>
        <FooterWrapper>
          <ButtonWrapper>
            <Button
              label="Reject"
              type={BUTTON_TYPE.DISABLE}
              onClick={onReject}
              size={BUTTON_SIZE.FULL}
            />
          </ButtonWrapper>
          <ButtonWrapper>
            <Button
              label="Save"
              onClick={onSave}
              size={BUTTON_SIZE.FULL}
            />
          </ButtonWrapper>
        </FooterWrapper>
      </CompleteWrapper>
    </Wrapper>
  );
};

export default DappSignIn;
