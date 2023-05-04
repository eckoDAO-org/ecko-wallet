import images from 'src/images';
import Pact from 'pact-lang-api';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';
import { getLocalSelectedNetwork, getLocalSigningCmd } from 'src/utils/storage';
import Button from 'src/components/Buttons';
import { DivFlex, SecondaryLabel } from 'src/components';
import { sendWalletConnectMessage, updateSignedCmdMessage } from 'src/utils/message';
import { useAppThemeContext } from 'src/contexts/AppThemeContext';
import { getTimestamp } from 'src/utils';
import { ECKO_WALLET_DAPP_SIGN_NONCE, WALLET_CONNECT_SIGN_METHOD } from 'src/utils/config';
import { getSignatureFromHash } from 'src/utils/chainweb';
import { SigningResponse } from './interfaces';

export const DappWrapper = styled.div`
  display: flex;
  flex-direction: column;
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
  color: ${({ theme }) => theme.text.primary};
  text-align: center;
  margin: 20px 0;
`;
export const DappLogo = styled.img`
  width: 70px;
  height: 70px;
  margin: 50px auto 20px auto;
`;

export interface WalletConnectParams {
  id: number;
  topic: string;
  action: string;
}

const SignedCmd = () => {
  const [domain, setDomain] = useState('example.com.vn');
  const [tabId, setTabId] = useState(null);
  const [cmd, setCmd] = useState<any>({});
  const [chainId, setChainId] = useState<any>();
  const [caps, setCaps] = useState<any[]>([]);
  const [walletConnectParams, setWalletConnectParams] = useState<WalletConnectParams | null>(null);

  const rootState = useSelector((state) => state);
  const { publicKey, secretKey } = rootState.wallet;

  const { theme } = useAppThemeContext();

  const returnSignedMessage = (result, error?) => {
    if (walletConnectParams?.topic) {
      sendWalletConnectMessage(walletConnectParams.id, walletConnectParams.topic, result, error);
    } else {
      updateSignedCmdMessage(result, tabId);
    }
    setTimeout(() => {
      window.close();
    }, 300);
  };

  useEffect(() => {
    getLocalSigningCmd(
      (signingCmd) => {
        setTabId(signingCmd?.signingCmd?.tabId);
        setChainId(signingCmd?.signingCmd?.chainId);
        if (signingCmd?.signingCmd?.walletConnectAction) {
          const { id, topic, walletConnectAction } = signingCmd?.signingCmd;
          setWalletConnectParams({
            id,
            topic,
            action: walletConnectAction,
          });
        }
        const signedResponse = signCommand(signingCmd?.signingCmd);
        if (signedResponse?.signingCmd && signedResponse.signedCmd) {
          getLocalSelectedNetwork(
            (selectedNetwork) => {
              if (selectedNetwork.networkId === signedResponse?.signingCmd.networkId) {
                setDomain(signedResponse?.signingCmd.domain);
                setCmd(signedResponse?.signedCmd);
                setCaps(signedResponse?.signingCmd.caps);
              }
            },
            () => {},
          );
        }
      },
      () => {},
    );
  }, [secretKey]);

  const signCommand = (signingCmd) => {
    try {
      const meta = Pact.lang.mkMeta(
        signingCmd.sender,
        signingCmd.chainId.toString(),
        signingCmd.gasPrice,
        signingCmd.gasLimit,
        getTimestamp(),
        signingCmd.ttl,
      );
      const clist = signingCmd.caps ? signingCmd.caps.map((c) => c.cap) : [];
      const keyPairs: any = {
        publicKey,
      };
      if (secretKey.length === 64) {
        keyPairs.secretKey = secretKey;
      }
      if (clist.length > 0) {
        keyPairs.clist = clist;
      }
      const signedCmd = Pact.api.prepareExecCmd(
        keyPairs,
        `${ECKO_WALLET_DAPP_SIGN_NONCE}-"${new Date().toISOString()}"`,
        signingCmd?.pactCode || signingCmd?.code,
        signingCmd.envData,
        meta,
        signingCmd.networkId,
      );
      if (secretKey.length > 64) {
        const signature = getSignatureFromHash(signedCmd.hash, secretKey);
        const sigs = [{ sig: signature }];
        signedCmd.sigs = sigs;
      }
      return { signedCmd, signingCmd };
    } catch (err) {
      console.log(`Signing cmd err:`, err);
      const result = {
        status: 'fail',
        message: 'Signing cmd error',
      };
      returnSignedMessage(result);
      return null;
    }
  };

  const onSave = () => {
    if (walletConnectParams?.action === WALLET_CONNECT_SIGN_METHOD) {
      const result: SigningResponse = {
        chainId,
        body: cmd,
      };
      returnSignedMessage(result);
    } else {
      const result = {
        status: 'success',
        signedCmd: cmd,
      };
      returnSignedMessage(result);
    }
  };

  const onClose = () => {
    const result = {
      status: 'fail',
      message: 'Rejected by user',
    };
    returnSignedMessage(result, {
      code: 5000,
      message: 'User rejected.',
    });
  };

  const newCmd = cmd.cmd ? { ...cmd, cmd: JSON.parse(cmd.cmd) } : {};
  return (
    <DappWrapper>
      <DappLogo src={images.eckoWalletLogoRounded} alt="logo" />
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
          theme={theme.isDark ? 'twilight' : 'rjv-default'}
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
                    theme={theme.isDark ? 'twilight' : 'rjv-default'}
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
