/* eslint-disable no-await-in-loop */
import images from 'src/images';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';
import { hash as kadenaJSHash, sign as kadenaJSSign } from '@kadena/cryptography-utils';
import { useAppThemeContext } from 'src/contexts/AppThemeContext';
import { getSignatureFromHash } from 'src/utils/chainweb';
import { WALLET_CONNECT_QUICKSIGN_METHOD } from 'src/utils/config';
import { getLocalQuickSignedCmd, getLocalSelectedNetwork } from 'src/utils/storage';
import Button from 'src/components/Buttons';
import { CommonLabel, DivFlex, SecondaryLabel } from 'src/components';
import { sendWalletConnectMessage, updateQuickSignedCmdMessage } from 'src/utils/message';
import { useLedgerContext } from 'src/contexts/LedgerContext';
import { DappDescription, DappLogo, DappWrapper, WalletConnectParams } from './SignedCmd';
import { AccountType } from 'src/stores/wallet';

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
  const [domain, setDomain] = useState('');
  const [tabId, setTabId] = useState(null);
  const [quickSignData, setQuickSignData] = useState<any>([]);
  const [walletConnectParams, setWalletConnectParams] = useState<WalletConnectParams | null>(null);
  const { signHash } = useLedgerContext();

  const rootState = useSelector((state) => state);
  const { publicKey, secretKey, type } = rootState.wallet;

  const { theme } = useAppThemeContext();

  const returnSignedMessage = (result, error?) => {
    if (walletConnectParams?.topic) {
      sendWalletConnectMessage(walletConnectParams.id, walletConnectParams.topic, result, error);
    } else {
      updateQuickSignedCmdMessage(result, tabId);
    }
    setTimeout(() => {
      window.close();
    }, 300);
  };

  useEffect(() => {
    if (publicKey) {
      getLocalQuickSignedCmd(
        async (toQuickSignData) => {
          setTabId(toQuickSignData.tabId);
          setDomain(toQuickSignData.domain);
          if (toQuickSignData?.walletConnectAction) {
            const { id, topic, walletConnectAction } = toQuickSignData;
            setWalletConnectParams({
              id,
              topic,
              action: walletConnectAction,
            });
          }
          const signedResponse = await quickSignCmd(toQuickSignData);
          if (signedResponse?.length) {
            getLocalSelectedNetwork(
              (selectedNetwork) => {
                if (selectedNetwork.networkId === toQuickSignData.networkId) {
                  setQuickSignData(signedResponse);
                }
              },
              () => {},
            );
          }
        },
        () => {},
      );
    }
  }, [publicKey]);

  const checkIsValidQuickSignPayload = (payload) =>
    payload &&
    payload.commandSigDatas &&
    Array.isArray(payload.commandSigDatas) &&
    payload.commandSigDatas.every((r) => Array.isArray(r.sigs) && r.cmd);

  const checkHasQuickSignValidSignature = async (commandSigDatas) =>
    commandSigDatas && commandSigDatas.filter((r) => r.sigs?.some((s) => s.pubKey === publicKey))?.length > 0;

  const quickSignCmd = async (data) => {
    const isValidPayload = checkIsValidQuickSignPayload(data);
    if (!isValidPayload) {
      const result = {
        status: 'fail',
        message: 'QuickSign fail: your data structure is invalid',
      };
      returnSignedMessage(result);
      return null;
    }
    const hasQuickSignValidSignature = await checkHasQuickSignValidSignature(data.commandSigDatas);
    if (!hasQuickSignValidSignature) {
      const result = {
        status: 'fail',
        message: 'QuickSign fail: wallet public key not found',
      };
      returnSignedMessage(result);
      return null;
    }
    const signedResponses: any[] = [];
    for (let i = 0; i < data.commandSigDatas.length; i += 1) {
      const { cmd, sigs } = data.commandSigDatas[i];
      let signature: any = null;
      let hash: string | null = null;
      const signatureIndex = sigs.findIndex((s) => s.pubKey === publicKey);
      // Account pubKey not present in sigs
      if (signatureIndex < 0) {
        signedResponses.push({
          cmd,
          sigs,
          outcome: {
            result: 'noSig',
          },
        });
      } else {
        const parsedCmd = JSON.parse(cmd);
        // find sig index for selected account
        const commandSigIndex = parsedCmd.signers.findIndex((s) => s.pubKey === publicKey);
        if (commandSigIndex > -1) {
          parsedCmd.signers[commandSigIndex].secretKey = secretKey;
          try {
            hash = kadenaJSHash(cmd);
            if (type === AccountType.LEDGER) {
              const ledgerSig = await signHash(hash);
              signature = ledgerSig?.signature;
            } else if (secretKey.length > 64) {
              signature = getSignatureFromHash(hash, secretKey);
            } else {
              signature = kadenaJSSign(hash, { secretKey, publicKey }).sig;
            }
          } catch (err) {
            console.log('QUICK-SIGN ERROR');
            signedResponses.push({
              commandSigData: {
                cmd,
                sigs,
              },
              outcome: {
                result: 'failure',
                msg: 'Error to sign cmd',
              },
            });
          }
        }

        sigs[signatureIndex].sig = signature;
        signedResponses.push({
          commandSigData: {
            cmd,
            sigs,
          },
          outcome: {
            result: 'success',
            hash,
          },
        });
      }
    }
    return signedResponses;
  };

  const onSave = () => {
    if (walletConnectParams?.action === WALLET_CONNECT_QUICKSIGN_METHOD) {
      const result = {
        responses: quickSignData,
      };
      returnSignedMessage(result);
    } else {
      const result = {
        status: 'success',
        quickSignData,
      };
      returnSignedMessage(result);
    }
  };
  const onClose = () => {
    const result = {
      status: 'fail',
      message: 'Rejected by user',
    };
    returnSignedMessage(result);
  };

  return (
    <DappWrapper>
      <DappLogo src={images.eckoWalletLogoRounded} alt="logo" />
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
        const caps = cmd?.signers?.find((s) => s?.pubKey === publicKey)?.clist;
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
                    {caps?.map((cap) => (
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
                          theme={theme.isDark ? 'twilight' : 'rjv-default'}
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
                theme={theme.isDark ? 'twilight' : 'rjv-default'}
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
