import images from 'src/images';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';
import { getLocalSelectedNetwork, getLocalSignedCmd } from 'src/utils/storage';
import Button from 'src/components/Buttons';
import { DivFlex, SecondaryLabel } from 'src/components';
import { updateSignedCmdMessage } from 'src/utils/message';

export const DappWrapper = styled.div`
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
export const DappContentWrapper = styled.div`
  padding: 20px;
  word-break: break-word;
`;
export const DappDescription = styled.div`
  text-align: center;
  margin: 20px 0;
`;
export const DappLogo = styled.img`
  width: 70px;
  height: 70px;
  margin: 50px auto 20px auto;
`;
const SignedCmd = () => {
  const [domain, setDomain] = useState('example.com.vn');
  const [tabId, setTabId] = useState(null);
  const [cmd, setCmd] = useState<any>({});
  const [caps, setCaps] = useState<any[]>([]);

  useEffect(() => {
    getLocalSignedCmd(
      (signedCmd) => {
        getLocalSelectedNetwork(
          (selectedNetwork) => {
            if (selectedNetwork.networkId === signedCmd.networkId) {
              setDomain(signedCmd.domain);
              setCmd(signedCmd.cmd);
              setTabId(signedCmd.tabId);
              setCaps(signedCmd.caps);
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
    <DappWrapper>
      <DappLogo src={images.xWalletIcon} alt="logo" />
      <DappDescription>{domain}</DappDescription>
      <SecondaryLabel style={{ textAlign: 'center' }} uppercase>
        signed command
      </SecondaryLabel>
      <DappContentWrapper>
        <ReactJson
          name="signedCmd"
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
      </DappContentWrapper>
      {caps?.length ? (
        <>
          <SecondaryLabel style={{ textAlign: 'center' }}>CAPABILITIES</SecondaryLabel>
          <DivFlex flexDirection="column">
            {caps?.map((cap, i) => (
              <DivFlex flexDirection="column">
                <DappContentWrapper>
                  <ReactJson
                    name={cap?.cap?.name || `CAP ${i + 1}`}
                    src={cap}
                    enableClipboard={false}
                    displayObjectSize={false}
                    displayDataTypes={false}
                    quotesOnKeys={false}
                    collapsed
                    indentWidth={2}
                    collapseStringsAfterLength={false}
                  />
                </DappContentWrapper>
              </DivFlex>
            ))}
          </DivFlex>
        </>
      ) : null}

      <DivFlex gap="10px" padding="24px">
        <Button size="full" label="Reject" variant="disabled" onClick={onClose} />
        <Button size="full" label="Confirm" onClick={onSave} />
      </DivFlex>
    </DappWrapper>
  );
};

export default SignedCmd;
