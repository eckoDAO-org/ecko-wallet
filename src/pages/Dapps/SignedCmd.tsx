import images from 'src/images';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';
import { getLocalSelectedNetwork, getLocalSignedCmd } from 'src/utils/storage';
import Button from 'src/components/Buttons';
import { DivFlex, SecondaryLabel } from 'src/components';
import { updateSignedCmdMessage } from 'src/utils/message';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 2;
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
  const [tabId, setTabId] = useState(null);
  const [cmd, setCmd] = useState<any>({});

  useEffect(() => {
    getLocalSignedCmd(
      (signedCmd) => {
        getLocalSelectedNetwork(
          (selectedNetwork) => {
            if (selectedNetwork.networkId === signedCmd.networkId) {
              setDomain(signedCmd.domain);
              setCmd(signedCmd.cmd);
              setTabId(signedCmd.tabId);
            }
          },
          () => {},
        );
      },
      () => {},
    );
  }, []);

  const onSave = () => {
    const result = {
      status: 'success',
      signedCmd: cmd,
    };
    updateSignedCmdMessage(result, tabId);
    setTimeout(() => {
      window.close();
    }, 300);
  };
  const onClose = () => {
    const result = {
      status: 'fail',
      message: 'Rejected by user',
    };
    updateSignedCmdMessage(result, tabId);
    setTimeout(() => {
      window.close();
    }, 300);
  };

  const newCmd = cmd.cmd ? { ...cmd, cmd: JSON.parse(cmd.cmd) } : {};
  return (
    <Wrapper>
      <Logo src={images.xWalletIcon} alt="logo" />
      <DappDescription>{domain}</DappDescription>
      <SecondaryLabel style={{ textAlign: 'center' }} uppercase>
        Get signed command
      </SecondaryLabel>
      <ContentWrapper>
        <ReactJson
          src={newCmd}
          enableClipboard={false}
          displayObjectSize={false}
          displayDataTypes={false}
          quotesOnKeys={false}
          collapsed
          indentWidth={2}
          style={{ paddingBottom: 40 }}
          collapseStringsAfterLength={false}
        />
      </ContentWrapper>
      <DivFlex gap="10px" padding="24px">
        <Button size="full" label="Reject" variant="disabled" onClick={onClose} />
        <Button size="full" label="Confirm" onClick={onSave} />
      </DivFlex>
    </Wrapper>
  );
};

export default SignedCmd;
