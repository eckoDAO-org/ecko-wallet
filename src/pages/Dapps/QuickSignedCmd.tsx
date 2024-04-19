/* eslint-disable no-await-in-loop */
import images from 'src/images';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';
import Toast from 'src/components/Toast/Toast';
import { toast } from 'react-toastify';
import { hash as kadenaJSHash, sign as kadenaJSSign } from '@kadena/cryptography-utils';
import { useAppThemeContext } from 'src/contexts/AppThemeContext';
import { getSignatureFromHash } from 'src/utils/chainweb';
import { WALLET_CONNECT_QUICKSIGN_METHOD } from 'src/utils/config';
import { getLocalQuickSignedCmd, getLocalSelectedNetwork } from 'src/utils/storage';
import Button from 'src/components/Buttons';
import { InputError } from 'src/baseComponent';
import { CommonLabel, DivFlex, SecondaryLabel } from 'src/components';
import { sendWalletConnectMessage, updateQuickSignedCmdMessage } from 'src/utils/message';
import { DEFAULT_BIP32_PATH, bufferToHex, useLedgerContext } from 'src/contexts/LedgerContext';
import { AccountType } from 'src/stores/slices/wallet';
import { DappDescription, DappLogo, DappWrapper, WalletConnectParams } from './SignedCmd';

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
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [currentHash, setCurrentHash] = useState<{ hash: string; count: number }>({ hash: '', count: 0 });
  const [isWaitingLedger, setIsWaitingLedger] = useState(false);
  const [totalCommands, setTotalCommands] = useState(0);
  const [quickSignData, setQuickSignData] = useState<any>([]);
  const [walletConnectParams, setWalletConnectParams] = useState<WalletConnectParams | null>(null);
  const { getLedger } = useLedgerContext();

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
      setErrorMessage('QuickSign fail: your data structure is invalid');
      return null;
    }
    const hasQuickSignValidSignature = await checkHasQuickSignValidSignature(data.commandSigDatas);
    if (!hasQuickSignValidSignature) {
      setErrorMessage('QuickSign fail: wallet public key not found');
      return null;
    }
    let ledger: any = null;
    if (type === AccountType.LEDGER) {
      setIsWaitingLedger(true);
      ledger = await getLedger();
    }

    const signedResponses: any[] = [];
    setTotalCommands(data.commandSigDatas.length);
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
              setCurrentHash({ hash, count: i + 1 });
              const ledgerSig = await ledger?.signHash(DEFAULT_BIP32_PATH, hash);
              toast.success(<Toast type="success" content={`Ledger command ${i + 1}/${data?.commandSigDatas?.length ?? '?'} signed successfully`} />);
              signature = bufferToHex(ledgerSig?.signature);
            } else if (secretKey.length > 64) {
              signature = getSignatureFromHash(hash, secretKey);
            } else {
              signature = kadenaJSSign(cmd, { secretKey, publicKey }).sig;
            }
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error('QUICK-SIGN ERROR', err);
            setIsWaitingLedger(false);
            setErrorMessage('Ledger signing fail');
            return null;
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
    setIsWaitingLedger(false);
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
        responses: quickSignData,
      };
      returnSignedMessage(result);
    }
  };
  const onClose = () => {
    const result = {
      status: 'fail',
      message: errorMessage || 'Rejected by user',
    };
    returnSignedMessage(result, {
      code: 5000,
      message: errorMessage || 'User rejected.',
    });
  };

  return (
    <DappWrapper>
      <DappLogo src={images.eckoWalletLogoRounded} alt="logo" />
      <DappDescription>{domain}</DappDescription>
      <CommonLabel textCenter fontWeight={800} style={{ marginBottom: 20 }}>
        QUICK SIGN REQUEST
      </CommonLabel>
      {type === AccountType.LEDGER && isWaitingLedger && (
        <DivFlex flexDirection="column" alignItems="center" padding="24px">
          <SecondaryLabel style={{ textAlign: 'center' }}>
            Please enable BLIND SIGNING <br />
            and follow the instruction on your ledger first
          </SecondaryLabel>
          {currentHash?.hash && (
            <SecondaryLabel style={{ textAlign: 'center', marginTop: 30, wordBreak: 'break-all' }}>
              HASH TO SIGN ({currentHash?.count}/{totalCommands}):
              <br />
              {currentHash?.hash}
            </SecondaryLabel>
          )}
        </DivFlex>
      )}
      {quickSignData?.map(({ commandSigData, outcome }, iCmd) => {
        const cmd = JSON.parse(commandSigData?.cmd || {});
        const signData = {
          cmd,
          hash: outcome?.hash,
          sigs: commandSigData?.sigs,
        };
        const caps = cmd?.signers?.find((s) => s?.pubKey === publicKey)?.clist;
        return (
          !isWaitingLedger && (
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
          )
        );
      })}
      {!isWaitingLedger && (
        <>
          <DivFlex gap="10px" padding="24px">
            <InputError>{errorMessage}</InputError>
          </DivFlex>
          <DivFlex gap="10px" padding="24px">
            <Button size="full" label={errorMessage ? 'Close' : 'Reject'} variant="disabled" onClick={onClose} />
            {!errorMessage && <Button isDisabled={isWaitingLedger} size="full" label="Confirm" onClick={onSave} />}
          </DivFlex>
        </>
      )}
    </DappWrapper>
  );
};

export default QuickSignedCmd;
