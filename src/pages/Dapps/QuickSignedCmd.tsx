import images from 'src/images';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';
import { getLocalQuickSignedCmd, getLocalSelectedNetwork } from 'src/utils/storage';
import Button from 'src/components/Buttons';
import { useCurrentWallet } from 'src/stores/wallet/hooks';
import { CommonLabel, DivFlex, SecondaryLabel } from 'src/components';
import { updateQuickSignedCmdMessage } from 'src/utils/message';
import { DappDescription, DappLogo, DappWrapper } from './SignedCmd';

const CommandListWrapper = styled.div`
  padding: 10px;
  word-break: break-word;
`;
const CodeWrapper = styled.div`
  font-family: monospace;
  max-height: 100px;
  overflow: auto;
  background: #d6d6d6;
  padding: 10px;
  &::-webkit-scrollbar {
    width: 2px;
  }
  &::-webkit-scrollbar-track {
    background: rgb(226, 226, 226);
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgb(186, 186, 186);
    border-radius: 2px;
  }
`;

const QuickSignedCmd = () => {
  const [domain, setDomain] = useState('example.com.vn');
  const [tabId, setTabId] = useState(null);
  const [quickSignData, setQuickSignData] = useState<any>([]);
  const stateWallet = useCurrentWallet();

  useEffect(() => {
    getLocalQuickSignedCmd(
      (quickSignedCmd) => {
        getLocalSelectedNetwork(
          (selectedNetwork) => {
            if (selectedNetwork.networkId === quickSignedCmd.networkId) {
              setDomain(quickSignedCmd.domain);
              setQuickSignData(quickSignedCmd.quickSignData);
              setTabId(quickSignedCmd.tabId);
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
      quickSignData,
    };
    updateQuickSignedCmdMessage(result, tabId);
    setTimeout(() => {
      window.close();
    }, 300);
  };
  const onClose = () => {
    const result = {
      status: 'fail',
      message: 'Rejected by user',
    };
    updateQuickSignedCmdMessage(result, tabId);
    setTimeout(() => {
      window.close();
    }, 300);
  };

  return (
    <DappWrapper>
      <DappLogo src={images.xWalletIcon} alt="logo" />
      <DappDescription>{domain}</DappDescription>
      <CommonLabel textCenter fontWeight={800} style={{ marginBottom: 20 }}>
        QUICK SIGN REQUEST
      </CommonLabel>
      {quickSignData?.map(({ commandSigData, outcome }, iCmd) => {
        const cmd = JSON.parse(commandSigData?.cmd || {});
        const signData = {
          cmd,
          hash: outcome?.hash,
          sigs: commandSigData?.sigs,
        };
        const caps = cmd?.signers?.find((s) => s?.pubKey === stateWallet?.publicKey)?.clist;
        return (
          <>
            <CommonLabel textCenter fontWeight={800} style={{ marginBottom: 15 }}>
              COMMAND {iCmd + 1}/{quickSignData?.length}
            </CommonLabel>
            <SecondaryLabel textCenter>CODE</SecondaryLabel>
            <CommandListWrapper>
              <CodeWrapper fontWeight={600}>{cmd?.payload?.exec?.code}</CodeWrapper>
              {caps?.length ? (
                <DivFlex flexDirection="column">
                  <SecondaryLabel textCenter style={{ marginTop: 15 }}>
                    CAPABILITIES ({caps?.length})
                  </SecondaryLabel>
                  <DivFlex flexDirection="column">
                    {caps?.map((cap, i) => (
                      <div style={{ margin: '10px 0' }}>
                        <ReactJson
                          name={cap.name}
                          src={cap?.args}
                          enableClipboard={false}
                          displayObjectSize={false}
                          displayDataTypes={false}
                          quotesOnKeys={false}
                          collapsed
                          indentWidth={2}
                          collapseStringsAfterLength={false}
                        />
                      </div>
                    ))}
                  </DivFlex>
                </DivFlex>
              ) : null}
              <DivFlex flexDirection="column">
                <SecondaryLabel textCenter style={{ marginTop: 15 }}>
                  RAW DATA
                </SecondaryLabel>
              </DivFlex>
              <ReactJson
                name="rawCmd"
                src={signData}
                enableClipboard={false}
                displayObjectSize={false}
                displayDataTypes={false}
                quotesOnKeys={false}
                collapsed
                indentWidth={2}
                style={{ paddingBottom: 40 }}
                collapseStringsAfterLength={false}
              />
            </CommandListWrapper>
          </>
        );
      })}
      <DivFlex gap="10px" padding="24px">
        <Button size="full" label="Reject" variant="disabled" onClick={onClose} />
        <Button size="full" label="Confirm" onClick={onSave} />
      </DivFlex>
    </DappWrapper>
  );
};

export default QuickSignedCmd;
