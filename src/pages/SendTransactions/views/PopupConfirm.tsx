import Button from 'src/components/Buttons';
import Pact from 'pact-lang-api';
import { get } from 'lodash';
import { ACTIVE_TAB, BUTTON_SIZE, BUTTON_TYPE } from 'src/utils/constant';
import { useHistory } from 'react-router-dom';
import { convertRecent, getTimestamp } from 'src/utils';
import { getApiUrl, getSignatureFromHash, fetchLocal } from 'src/utils/chainweb';
import { CONFIG } from 'src/utils/config';
import { toast } from 'react-toastify';
import BigNumber from 'bignumber.js';
import Toast from 'src/components/Toast/Toast';
import { CrossChainContext } from 'src/contexts/CrossChainContext';
import { setActiveTab, setRecent } from 'src/stores/extensions';
import { getLocalActivities, getLocalRecent, setLocalActivities, setLocalRecent } from 'src/utils/storage';
import { updateSendDapp } from 'src/utils/message';
import images from 'src/images';
import { useContext, useState } from 'react';
import SpokesLoading from 'src/components/Loading/Spokes';
import Tooltip from 'src/components/Tooltip';
import { IFungibleToken } from 'src/pages/ImportToken';
import {
  PageConfirm,
  BodyContent,
  ButtonWrapper,
  LabelConfirm,
  FormItemConfirm,
  LabelBold,
  TooltipImage,
  GasFee,
  GasFeeText,
  LoadingTitle,
  SpinnerWrapper,
  TransferHr,
} from './style';
import { Footer, TransactionTitle } from '../styles';
import { renderTransactionInfo } from './Transfer';

type Props = {
  configs: any;
  onClose: any;
  aliasContact: string;
  fungibleToken: IFungibleToken | null;
  kdaUSDPrice?: number;
};

const PopupConfirm = (props: Props) => {
  const { configs, onClose, aliasContact, fungibleToken, kdaUSDPrice } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { setCrossChainRequest, getCrossChainRequestsAsync } = useContext(CrossChainContext);
  const history = useHistory();
  const {
    senderName,
    senderChainId,
    senderPrivateKey,
    receiverName,
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

  const total = validAmount + validGasPrice * validGasLimit;

  const getCmd = async () => {
    let pactCode = `(${fungibleToken?.contractAddress}.transfer-create "${senderName}" "${receiverName}" (read-keyset "ks") ${Number.parseFloat(
      amount,
    )})`;
    if (isCrossChain) {
      pactCode = `(${
        fungibleToken?.contractAddress
      }.transfer-crosschain "${senderName}" "${receiverName}" (read-keyset "ks") "${receiverChainId}" ${Number.parseFloat(amount)})`;
    }
    const crossKeyPairs: any = {
      publicKey: senderPublicKey,
    };
    const interfaces = await fetchLocal(
      `(at 'interfaces (describe-module "${fungibleToken?.contractAddress}"))`,
      selectedNetwork.url,
      selectedNetwork.networkId,
      senderChainId.toString(),
    );
    if (interfaces?.result?.data && Array.isArray(interfaces?.result?.data)) {
      if (interfaces?.result?.data?.some((moduleInterface) => moduleInterface === 'fungible-xchain-v1')) {
        crossKeyPairs.clist = [
          Pact.lang.mkCap('gas', 'pay gas', 'coin.GAS').cap,
          Pact.lang.mkCap('transfer', 'transfer coin', `${fungibleToken?.contractAddress}.TRANSFER_XCHAIN`, [
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
        Pact.lang.mkCap('transfer', 'transfer coin', `${fungibleToken?.contractAddress}.TRANSFER`, [senderName, receiverName, validAmount]).cap,
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

  const onListenTransaction = (listenCmd, attempt = 1) => {
    Pact.fetch
      .listen(listenCmd, getApiUrl(selectedNetwork.url, selectedNetwork.networkId, senderChainId))
      .then(async (data) => {
        const status = get(data, 'result.status');
        if (status === 'success') {
          toast.success(<Toast type="success" content="Transfer Successfully" />);
        } else if (status === 'failure') {
          toast.error(<Toast type="fail" content="Transfer Fail" />);
        }
        if (senderChainId.toString() !== receiverChainId.toString()) {
          const activity = {
            symbol: fungibleToken?.symbol,
            requestKey: data.reqKey,
            senderChainId: senderChainId.toString(),
            receiverChainId: receiverChainId.toString(),
            receiver: receiverName,
            createdTime: new Date(data.metaData?.blockTime / 1000).toString(),
            amount,
            gasPrice,
            sender: senderName,
            domain,
            status,
          };
          const asyncCrossChainRequests = await getCrossChainRequestsAsync();
          const newCrossRequests = [...(asyncCrossChainRequests?.filter((ccr) => ccr.requestKey !== data.reqKey) || []), activity];
          setCrossChainRequest(newCrossRequests);
        }

        // history.push('/');
        // setActiveTab(ACTIVE_TAB.HOME);
      })
      .catch((err) => {
        console.log('!!! ~ err', err);
        if (attempt < 5) {
          onListenTransaction(listenCmd, attempt + 1);
          toast.error(<Toast type="fail" content="Transfer Fail, I'm trying again" />);
        } else {
          toast.error(<Toast type="fail" content="Transfer Fail" />);
        }
        // setIsLoading(false);
        // history.push('/');
        // setActiveTab(ACTIVE_TAB.HOME);
      });
  };

  const onSend = async () => {
    if (!isSending) {
      setIsSending(true);
      const newCreatedTime = new Date();
      const createdTime = newCreatedTime.toString();
      const cmd = await getCmd();
      const meta = Pact.lang.mkMeta(senderName, senderChainId.toString(), validGasPrice, validGasLimit, getTimestamp(), CONFIG.X_CHAIN_TTL);
      const sendCmd: any = Pact.api.prepareExecCmd(
        cmd.keyPairs,
        `"${new Date().toISOString()}"`,
        cmd.pactCode,
        cmd.envData,
        meta,
        selectedNetwork.networkId,
      );
      if (senderPrivateKey.length > 64) {
        const signature = getSignatureFromHash(sendCmd.hash, senderPrivateKey);
        const sigs = [{ sig: signature }];
        sendCmd.sigs = sigs;
      }
      setIsLoading(true);
      Pact.wallet
        .sendSigned(sendCmd, getApiUrl(selectedNetwork.url, selectedNetwork.networkId, senderChainId))
        .then(async (data) => {
          const requestKey = data.requestKeys[0];
          const listenCmd = {
            listen: requestKey,
          };
          addRecent(createdTime);
          const activity = {
            symbol: fungibleToken?.symbol,
            requestKey,
            senderChainId: senderChainId.toString(),
            receiverChainId: receiverChainId.toString(),
            receiver: receiverName,
            createdTime,
            amount,
            gasPrice,
            sender: senderName,
            domain,
            status: 'pending',
          };
          getLocalActivities(
            selectedNetwork.networkId,
            senderChainId,
            senderName,
            (activities) => {
              const newActivities = [...activities];
              newActivities.push(activity);
              setLocalActivities(selectedNetwork.networkId, senderChainId, senderName, newActivities);
            },
            () => {
              const newActivities: any[] = [];
              newActivities.push(activity);
              setLocalActivities(selectedNetwork.networkId, senderChainId, senderName, newActivities);
            },
          );
          if (senderChainId.toString() !== receiverChainId.toString()) {
            const asyncCrossTx = await getCrossChainRequestsAsync();
            const requests = [...(asyncCrossTx || [])];
            requests.push(activity);
            setCrossChainRequest(requests);
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
          onListenTransaction(listenCmd);
          setIsLoading(false);
          toast.success(<Toast type="success" content="Transaction sent successfully! Please check the transaction status in the history tab" />);
          history.push('/');
          setActiveTab(ACTIVE_TAB.HOME);
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
  };
  if (isLoading) {
    return (
      <PageConfirm>
        <LoadingTitle isTop>Please don’t close this view</LoadingTitle>
        <SpinnerWrapper>
          <SpokesLoading />
        </SpinnerWrapper>
        <LoadingTitle>You will be redirected when the transaction ends</LoadingTitle>
      </PageConfirm>
    );
  }
  const isKDA = fungibleToken?.symbol.toUpperCase() === 'KDA';

  return (
    <PageConfirm>
      <BodyContent>
        {renderTransactionInfo(info)}
        <TransactionTitle>Transaction</TransactionTitle>
        <FormItemConfirm>
          <LabelConfirm>Amount</LabelConfirm>
          <LabelBold isRight>{`${validAmount} ${fungibleToken?.symbol.toUpperCase()}`}</LabelBold>
        </FormItemConfirm>
        {isKDA && kdaUSDPrice && (
          <GasFee>
            <LabelConfirm>Amount $</LabelConfirm>
            <GasFeeText>{`~${(validAmount * kdaUSDPrice).toFixed(2)} USD`}</GasFeeText>
          </GasFee>
        )}
        <FormItemConfirm>
          <LabelConfirm>Gas Limit</LabelConfirm>
          <Tooltip tooltipText="Gas limit is the maximum amount of units of gas you are willing to spend.">
            <TooltipImage src={images.transfer.info} alt="info" />
          </Tooltip>
          <LabelBold isRight>{`${gasLimit}`}</LabelBold>
        </FormItemConfirm>
        <FormItemConfirm>
          <LabelConfirm>Gas Price</LabelConfirm>
          <Tooltip tooltipText="Gas price specifies the amount of Kadena you are willing to pay for each unit of gas.">
            <TooltipImage src={images.transfer.info} alt="info" />
          </Tooltip>
          <LabelBold isRight>{`${gasPrice} KDA`}</LabelBold>
        </FormItemConfirm>
        <GasFee>
          <LabelConfirm>Gas Fee $</LabelConfirm>
          <GasFeeText>{`${estimateFee} USD`}</GasFeeText>
        </GasFee>
      </BodyContent>
      <TransferHr />
      {fungibleToken?.contractAddress === 'coin' && (
        <BodyContent>
          <FormItemConfirm>
            <LabelBold>Total</LabelBold>
            <LabelBold isRight>{`${new BigNumber(total).decimalPlaces(12).toString()} KDA`}</LabelBold>
          </FormItemConfirm>
          {isKDA && kdaUSDPrice && (
            <GasFee>
              <LabelConfirm>Total $ </LabelConfirm>
              <GasFeeText>{`~${(Number(new BigNumber(total).decimalPlaces(2)) * kdaUSDPrice).toFixed(2)} USD`}</GasFeeText>
            </GasFee>
          )}
        </BodyContent>
      )}
      <Footer>
        <ButtonWrapper>
          <Button label="Reject" type={BUTTON_TYPE.DISABLE} onClick={() => onClose()} size={BUTTON_SIZE.FULL} />
        </ButtonWrapper>
        <ButtonWrapper>
          <Button label="Confirm" onClick={onSend} size={BUTTON_SIZE.FULL} />
        </ButtonWrapper>
      </Footer>
    </PageConfirm>
  );
};

export default PopupConfirm;
