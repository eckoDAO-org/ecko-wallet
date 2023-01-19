import images from 'src/images';
import { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';
import { getLocalQuickSignedCmd, getLocalSelectedNetwork } from 'src/utils/storage';
import Button from 'src/components/Buttons';
import { useCurrentWallet } from 'src/stores/wallet/hooks';
import { DivFlex, SecondaryLabel } from 'src/components';
import { updateQuickSignedCmdMessage } from 'src/utils/message';
import { DappContentWrapper, DappDescription, DappLogo, DappWrapper } from './SignedCmd';

const QuickSignedCmd = () => {
  const [domain, setDomain] = useState('example.com.vn');
  const [tabId, setTabId] = useState(null);
  const [quickSignData, setQuickSignData] = useState<any>([]);
  const stateWallet = useCurrentWallet();
  console.log(`🚀 !!! ~ quickSignData`, quickSignData);

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
      <SecondaryLabel style={{ textAlign: 'center', marginBottom: 20 }} uppercase>
        QUICK SIGN REQUEST
      </SecondaryLabel>
      {quickSignData?.map(({ commandSigData, outcome }, iCmd) => {
        const cmd = JSON.parse(commandSigData?.cmd || {});
        console.log(`🚀 !!! ~ cmd`, cmd);
        const signData = {
          cmd,
          hash: outcome?.hash,
          sigs: commandSigData?.sigs,
        };
        const caps = cmd?.signers?.find((s) => s?.pubKey === stateWallet?.publicKey)?.clist;
        return (
          <>
            <SecondaryLabel fontSIze={10} style={{ textAlign: 'center' }} uppercase>
              COMMAND {iCmd + 1}/{quickSignData?.length}
            </SecondaryLabel>
            <DappContentWrapper>
              <ReactJson
                name="quickSignedCmd"
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
            </DappContentWrapper>
            {caps?.length ? (
              <>
                <SecondaryLabel style={{ textAlign: 'center' }}>CAPABILITIES</SecondaryLabel>
                <DivFlex flexDirection="column">
                  {caps?.map((cap, i) => (
                    <DivFlex flexDirection="column">
                      <SecondaryLabel>
                        {cap.name || '-'}: {cap?.args?.length ? cap?.args?.join(',') : null}
                      </SecondaryLabel>
                    </DivFlex>
                  ))}
                </DivFlex>
              </>
            ) : null}
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

/**
 * CONSOLE TEST
 */
