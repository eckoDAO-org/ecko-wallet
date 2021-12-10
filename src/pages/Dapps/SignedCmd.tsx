import images from 'src/images';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';
import {
  getLocalSelectedNetwork,
  getLocalSignedCmd,
} from 'src/utils/storage';
import Button from 'src/components/Buttons';
import { BUTTON_SIZE, BUTTON_TYPE } from 'src/utils/constant';
import { updateSignedCmdMessage } from 'src/utils/message';
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
  padding-bottom: 15px;
  &::-webkit-scrollbar {
    display: none;
  }

  &::-webkit-scrollbar-track {
    background: rgb(226, 226, 226);
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgb(54, 54, 54);
    border-radius: 2px;
  }
`;

const DappTitle = styled.div`
  text-align: center;
  font-weight: 700;
  font-size: 18px;
`;

const FooterWrapper = styled(Footer)`
  padding: 0 20px;
`;
const ContentWrapper = styled.div`
  padding: 20px;
  word-break: break-word;
`;
const DappDescription = styled.div`
  text-align: center;
  margin: 20px 0;
`;
const Logo = styled.img`
  width: 70px;
  height: 70px;
  margin: 50px auto 20px auto;
`;
const SignedCmd = () => {
  const [domain, setDomain] = useState('example.com.vn');
  const [cmd, setCmd] = useState<any>({});

  useEffect(() => {
    getLocalSignedCmd((signedCmd) => {
      getLocalSelectedNetwork((selectedNetwork) => {
        if (selectedNetwork.networkId === signedCmd.networkId) {
          setDomain(signedCmd.domain);
          setCmd(signedCmd.cmd);
        }
      }, () => {});
    }, () => {});
  }, []);

  const onSave = () => {
    const result = {
      status: 'success',
      signedCmd: cmd,
    };
    updateSignedCmdMessage(result);
    setTimeout(() => {
      window.close();
    }, 300);
  };
  const onClose = () => {
    const result = {
      status: 'fail',
      message: 'Rejected by user',
    };
    updateSignedCmdMessage(result);
    setTimeout(() => {
      window.close();
    }, 300);
  };

  const newCmd = cmd.cmd ? { ...cmd, cmd: JSON.parse(cmd.cmd) } : {};
  return (
    <Wrapper>
      <Logo src={images.logoDapps} alt="logo" />
      <DappDescription>{domain}</DappDescription>
      <DappTitle>Get signed command</DappTitle>
      <ContentWrapper>
        <ReactJson
          src={newCmd}
          enableClipboard={false}
          displayObjectSize={false}
          displayDataTypes={false}
          quotesOnKeys={false}
          indentWidth={2}
          collapseStringsAfterLength={false}
        />
      </ContentWrapper>
      <FooterWrapper>
        <ButtonWrapper>
          <Button
            label="Reject"
            type={BUTTON_TYPE.DISABLE}
            onClick={onClose}
            size={BUTTON_SIZE.FULL}
          />
        </ButtonWrapper>
        <ButtonWrapper>
          <Button
            label="Confirm"
            onClick={onSave}
            size={BUTTON_SIZE.FULL}
          />
        </ButtonWrapper>
      </FooterWrapper>
    </Wrapper>
  );
};

export default SignedCmd;
