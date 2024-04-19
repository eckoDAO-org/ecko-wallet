import Button from 'src/components/Buttons';
import Pact from 'pact-lang-api';
import { convertRecent, getTimestamp, humanReadableNumber, shortenAddress } from 'src/utils';
import { getApiUrl, getSignatureFromHash, fetchLocal, pollRequestKey } from 'src/utils/chainweb';
import { CONFIG, ECKO_WALLET_SEND_TX_NONCE } from 'src/utils/config';
import { getFloatPrecision } from 'src/utils/numbers';
import { toast } from 'react-toastify';
import { AccountType } from 'src/stores/slices/wallet';
import { ReactComponent as AlertIconSVG } from 'src/images/icon-alert.svg';
import Toast from 'src/components/Toast/Toast';
import { useLedgerContext } from 'src/contexts/LedgerContext';
import { useGoHome } from 'src/hooks/ui';
import { setRecent } from 'src/stores/slices/extensions';
import { addLocalActivity, addPendingCrossChainRequestKey, getLocalRecent, setLocalRecent } from 'src/utils/storage';
import { updateSendDapp } from 'src/utils/message';
import { useState } from 'react';
import SpokesLoading from 'src/components/Loading/Spokes';
import { CommonLabel, DivFlex, SecondaryLabel } from 'src/components';
import { IFungibleToken } from 'src/pages/ImportToken';
import { LocalActivity } from 'src/components/Activities/types';
import { LoadingTitle, SpinnerWrapper } from './style';
import { renderTransactionInfo } from './Transfer';
import { Warning } from '../styles';

type Props = {
  configs: any;
  onClose: any;
  aliasContact: string;
  fungibleToken: IFungibleToken;
  estimateUSDAmount?: number | null;
  kdaUSDPrice?: number;
};

const PopupConfirm = (props: Props) => {
  const { configs, onClose, aliasContact, fungibleToken, kdaUSDPrice, estimateUSDAmount } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  // const { setCrossChainRequest, getCrossChainRequestsAsync } = useContext(CrossChainContext);
  const { sendTransaction, sendCrossChainTransaction } = useLedgerContext();
  const goHome = useGoHome();
  const {
    senderName,
    senderChainId,
    senderPrivateKey,
    receiverName,
    receiverExists,
    receiverChainId,
    gasLimit,
    gasPrice,
    isCrossChain,
    senderPublicKey,
    receiverPred,
    receiverKeys,
    selectedNetwork,
    domain,
    dappAmount,
    estimateFee,
  } = configs;
  const amount = domain ? dappAmount : configs.amount;

  const validAmount = parseFloat(amount);
  const validGasPrice = parseFloat(gasPrice);
  const validGasLimit = parseFloat(gasLimit);

  const getCmd = async () => {
    const decimals = getFloatPrecision(Number.parseFloat(amount)) || 2;
    let pactCode = `(${fungibleToken.contractAddress}.transfer${receiverExists ? '' : '-create'} "${senderName}" "${receiverName}" ${
      receiverExists ? '' : '(read-keyset "ks")'
    } ${Number.parseFloat(amount).toFixed(decimals)})`;
    if (isCrossChain) {
      pactCode = `(${
        fungibleToken.contractAddress
      }.transfer-crosschain "${senderName}" "${receiverName}" (read-keyset "ks") "${receiverChainId}" ${Number.parseFloat(amount).toFixed(
        decimals,
      )})`;
    }
    const crossKeyPairs: any = {
      publicKey: senderPublicKey,
    };
    const interfaces = await fetchLocal(
      `(at 'interfaces (describe-module "${fungibleToken.contractAddress}"))`,
      selectedNetwork.url,
      selectedNetwork.networkId,
      senderChainId.toString(),
    );
    if (interfaces?.result?.data && Array.isArray(interfaces?.result?.data)) {
      if (interfaces?.result?.data?.some((moduleInterface) => moduleInterface === 'fungible-xchain-v1')) {
        crossKeyPairs.clist = [
          Pact.lang.mkCap('gas', 'pay gas', 'coin.GAS').cap,
          Pact.lang.mkCap('transfer', 'transfer coin', `${fungibleToken.contractAddress}.TRANSFER_XCHAIN`, [
            senderName,
            receiverName,
            validAmount,
            `${receiverChainId}`,
          ]).cap,
        ];
      }
    }
    const normalKeyPairs = {
      publicKey: senderPublicKey,
      clist: [
        Pact.lang.mkCap('gas', 'pay gas', 'coin.GAS').cap,
        Pact.lang.mkCap('transfer', 'transfer coin', `${fungibleToken.contractAddress}.TRANSFER`, [senderName, receiverName, validAmount]).cap,
      ],
    };
    const keyPairs: any = isCrossChain ? crossKeyPairs : normalKeyPairs;
    if (senderPrivateKey.length === 64) {
      keyPairs.secretKey = senderPrivateKey;
    }
    const cmd = {
      keyPairs,
      pactCode,
      envData: {
        ks: {
          keys: receiverKeys,
          pred: receiverPred,
        },
      },
      meta: Pact.lang.mkMeta(senderName, senderChainId.toString(), validGasPrice, validGasLimit, getTimestamp(), CONFIG.X_CHAIN_TTL),
      networkId: selectedNetwork.networkId,
    };
    return cmd;
  };

  const addRecent = (createdTime) => {
    const newRecent = {
      aliasName: aliasContact,
      createdTime,
      accountName: receiverName,
      chainId: receiverChainId,
      pred: receiverPred,
      keys: receiverKeys,
    };
    getLocalRecent(
      selectedNetwork.networkId,
      (data) => {
        const recent = data;
        recent[`${receiverChainId}`] = recent[`${receiverChainId}`] || {};
        recent[`${receiverChainId}`][`${receiverName}`] = newRecent;
        setLocalRecent(selectedNetwork.networkId, recent);
        setRecent(convertRecent(recent));
      },
      () => {
        const recent = {};
        recent[`${receiverChainId}`] = {};
        recent[`${receiverChainId}`][`${receiverName}`] = newRecent;
        setLocalRecent(selectedNetwork.networkId, recent);
        setRecent(convertRecent(recent));
      },
    );
  };

  const onListenTransaction = async (reqKey) => {
    const pollRes = await pollRequestKey(reqKey, getApiUrl(selectedNetwork.url, selectedNetwork.networkId, senderChainId));
    const status = pollRes?.result?.status || 'failure';
    if (pollRes) {
      if (status === 'success') {
        toast.success(<Toast type="success" content="Transfer Successfully" />);
      } else if (status === 'failure') {
        toast.error(<Toast type="fail" content="Transfer Fail" />);
      }
    } else {
      toast.error(<Toast type="fail" content="Transfer Fail" />);
    }
  };

  const onSend = async () => {
    if (!isSending) {
      const cmd = await getCmd();
      const meta = Pact.lang.mkMeta(senderName, senderChainId.toString(), validGasPrice, validGasLimit, getTimestamp(), CONFIG.X_CHAIN_TTL);
      let sendCmd: any = Pact.api.prepareExecCmd(
        cmd.keyPairs,
        `"${ECKO_WALLET_SEND_TX_NONCE}-${new Date().toISOString()}"`,
        cmd.pactCode,
        cmd.envData,
        meta,
        selectedNetwork.networkId,
      );
      setIsSending(true);
      const newCreatedTime = new Date();
      const createdTime = newCreatedTime.toString();
      if (configs?.type === AccountType.LEDGER) {
        try {
          const ledgerSendTxParams = {
            recipient: receiverName,
            namespace: fungibleToken.contractAddress !== 'coin' ? fungibleToken.contractAddress?.split('.')[0] ?? undefined : undefined,
            module: fungibleToken.contractAddress !== 'coin' ? fungibleToken.contractAddress?.split('.')[1] ?? undefined : undefined,
            amount,
            chainId: Number(senderChainId),
            network: selectedNetwork.networkId,
            gasPrice: humanReadableNumber(gasPrice, 12),
            gasLimit: gasLimit.toString(),
            nonce: `${ECKO_WALLET_SEND_TX_NONCE}-${new Date().toISOString()}`,
          };
          if (isCrossChain) {
            const ledgerSignCrosschainRes = await sendCrossChainTransaction({
              ...ledgerSendTxParams,
              recipient_chainId: Number(receiverChainId),
            });
            // eslint-disable-next-line no-console
            console.log('ledgerSignCrosschainRes', ledgerSignCrosschainRes);
            toast.success(<Toast type="success" content="Ledger Sign Success" />);
            sendCmd = ledgerSignCrosschainRes?.pact_command;
          } else {
            const ledgerSignRes = await sendTransaction(ledgerSendTxParams);
            // eslint-disable-next-line no-console
            console.log('ledgerSignRes', ledgerSignRes);
            toast.success(<Toast type="success" content="Ledger Sign Success" />);
            sendCmd = ledgerSignRes?.pact_command;
          }
        } catch (error) {
          toast.error(<Toast type="fail" content="Ledger Sign Failed or Rejected" />);
          // eslint-disable-next-line no-console
          console.error('Ledger Sign Error', error);
          return;
        }
      } else if (senderPrivateKey.length > 64) {
        const signature = getSignatureFromHash(sendCmd.hash, senderPrivateKey);
        const sigs = [{ sig: signature }];
        sendCmd.sigs = sigs;
      }

      setIsLoading(true);
      Pact.wallet
        .sendSigned(sendCmd, getApiUrl(selectedNetwork.url, selectedNetwork.networkId, senderChainId))
        .then(async (data) => {
          const requestKey = data.requestKeys[0];
          addRecent(createdTime);
          const activity: LocalActivity = {
            symbol: fungibleToken.symbol,
            module: fungibleToken.contractAddress,
            requestKey,
            senderChainId: senderChainId.toString(),
            receiverChainId: receiverChainId.toString(),
            receiver: receiverName,
            createdTime,
            amount,
            gasPrice,
            sender: senderName,
            domain,
            aliasName: configs?.aliasName,
            status: 'pending',
            transactionType: 'TRANSFER',
          };
          addLocalActivity(selectedNetwork.networkId, senderName, activity);
          if (senderChainId.toString() !== receiverChainId.toString()) {
            await addPendingCrossChainRequestKey({
              requestKey,
              sourceChainId: senderChainId.toString(),
              targetChainId: receiverChainId.toString(),
              networkId: selectedNetwork.networkId,
            });
          }
          if (domain) {
            const newData = {
              status: 'success',
              message: 'Transfer successfully',
              requestKey,
            };
            updateSendDapp(newData);
            setTimeout(() => {
              window.close();
            }, 500);
          }
          onListenTransaction(requestKey);
          setIsLoading(false);
          toast.success(<Toast type="success" content="Transaction sent successfully! Please check the transaction status in the history tab" />);
          goHome();
        })
        .catch(() => {
          if (domain) {
            const newData = {
              status: 'fail',
              message: 'Transfer failed',
            };
            updateSendDapp(newData);
          }
          toast.error(<Toast type="fail" content="Network Error." />);
          setIsLoading(false);
        });
    }
  };

  const info = {
    sender: senderName,
    senderChainId,
    receiver: receiverName,
    receiverChainId,
    aliasName: configs?.aliasName,
  };
  if (isLoading) {
    return (
      <div>
        <LoadingTitle isTop>Please don’t close this view</LoadingTitle>
        <SpinnerWrapper>
          <SpokesLoading />
        </SpinnerWrapper>
        <LoadingTitle>You will be redirected when the transaction ends</LoadingTitle>
      </div>
    );
  }

  const isVanityAccount = !receiverName?.startsWith('k:');

  return (
    <div style={{ padding: '0 20px 20px 20px', marginTop: -15 }}>
      {renderTransactionInfo(info, { borderTop: ' none', margin: '0px -20px 20px' })}
      <div style={{ textAlign: 'center' }}>
        {configs.aliasName && (
          <DivFlex margin="10px 0 0 0" justifyContent="space-between" alignItems="center">
            <SecondaryLabel uppercase>receiver</SecondaryLabel>
            <SecondaryLabel>{shortenAddress(receiverName)}</SecondaryLabel>
          </DivFlex>
        )}
        <DivFlex margin="10px 0px" justifyContent="space-between" alignItems="flex-start">
          <SecondaryLabel uppercase fontSize={16}>
            amount
          </SecondaryLabel>
          <DivFlex flexDirection="column" alignItems="flex-end">
            <SecondaryLabel uppercase fontSize={16}>
              {amount} {fungibleToken.symbol}
            </SecondaryLabel>
            <CommonLabel fontSize={12} fontWeight={600} lineHeight="8px">
              {estimateUSDAmount && `${humanReadableNumber(estimateUSDAmount)} USD`}
            </CommonLabel>
          </DivFlex>
        </DivFlex>
        <DivFlex margin="10px 0 0 0" justifyContent="space-between" alignItems="center">
          <SecondaryLabel uppercase>gas limit</SecondaryLabel>
          <SecondaryLabel uppercase>{gasLimit}</SecondaryLabel>
        </DivFlex>
        <DivFlex margin="1px 0px" justifyContent="space-between" alignItems="flex-start">
          <SecondaryLabel uppercase>gas price</SecondaryLabel>
          <DivFlex flexDirection="column" alignItems="flex-end">
            <SecondaryLabel uppercase>{gasPrice} KDA</SecondaryLabel>
          </DivFlex>
        </DivFlex>
        <DivFlex justifyContent="space-between" alignItems="flex-start">
          <SecondaryLabel uppercase>gas fee</SecondaryLabel>
          <DivFlex flexDirection="column" alignItems="flex-end">
            <SecondaryLabel uppercase>{gasPrice * gasLimit} KDA</SecondaryLabel>
            <CommonLabel fontSize={12} fontWeight={600} lineHeight="8px">
              {kdaUSDPrice ? humanReadableNumber(gasPrice * gasLimit * kdaUSDPrice) : '--'} USD
            </CommonLabel>
          </DivFlex>
        </DivFlex>
        {estimateUSDAmount ? (
          <DivFlex margin="10px 0px" justifyContent="space-between" alignItems="center">
            <CommonLabel fontWeight={600} uppercase>
              total
            </CommonLabel>
            <CommonLabel fontWeight={600}>{humanReadableNumber(Number(estimateUSDAmount) + Number(estimateFee))} USD</CommonLabel>
          </DivFlex>
        ) : null}
      </div>
      {isCrossChain && (
        <Warning margin="10px 0" style={{ justifyContent: 'center' }}>
          <AlertIconSVG />
          <div>
            <span>You are about to do a cross chain transfer</span>
            <br />
            <span>This operation usually takes more time</span>
          </div>
        </Warning>
      )}
      {isVanityAccount && (
        <Warning margin="10px 0" style={{ justifyContent: 'center' }}>
          <AlertIconSVG />
          <div>
            <span>You are sending to a non “k:account”!</span>
            <br />
            <span>Are you sure you want to proceed?</span>
          </div>
        </Warning>
      )}
      <DivFlex margin={isCrossChain ? '10px 0' : '30px 0'} gap="5px">
        <Button label="Cancel" size="full" variant="secondary" onClick={() => onClose()} />
        <Button label="Confirm" size="full" onClick={onSend} />
      </DivFlex>
    </div>
  );
};

export default PopupConfirm;
