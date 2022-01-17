import Button from 'src/components/Buttons';
import Pact from 'pact-lang-api';
import { get } from 'lodash';
import { ACTIVE_TAB, BUTTON_SIZE, BUTTON_TYPE } from 'src/utils/constant';
import { useHistory } from 'react-router-dom';
import { convertRecent, getTimestamp } from 'src/utils';
import { getApiUrl, getSignatureFromHash } from 'src/utils/chainweb';
import { CONFIG } from 'src/utils/config';
import { toast } from 'react-toastify';
import BigNumber from 'bignumber.js';
import Toast from 'src/components/Toast/Toast';
import { setActiveTab, setRecent } from 'src/stores/extensions';
import {
  getLocalActivities,
  getLocalCrossRequests,
  getLocalRecent,
  setLocalActivities,
  setLocalCrossRequests,
  setLocalRecent,
} from 'src/utils/storage';
import { updateSendDapp } from 'src/utils/message';
import images from 'src/images';
import { useState } from 'react';
import SpokesLoading from 'src/components/Loading/Spokes';
import Tooltip from 'src/components/Tooltip';
import { IFungibleToken } from 'src/pages/ImportToken';
import {
  PageConfirm, BodyContent, ButtonWrapper,
  LabelConfirm, FormItemConfirm, LabelBold, TooltipImage,
  GasFee, GasFeeText, LoadingTitle, SpinnerWrapper, TransferHr,
} from './style';
import { Footer, TransactionTitle } from '../styles';
import { renderTransactionInfo } from './Transfer';

type Props = {
  configs: any;
  onClose: any;
  aliasContact: string;
  fungibleToken: IFungibleToken|null;
}

const PopupConfirm = (props: Props) => {
  const {
    configs,
    onClose,
    aliasContact,
    fungibleToken,
  } = props;
  const [isLoading, setIsLoading] = useState(false);
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

  const total = (validAmount + (validGasPrice * validGasLimit));
  const getCmd = () => {
    let pactCode = `(${fungibleToken?.contractAddress}.transfer-create "${senderName}" "${receiverName}" (read-keyset "ks") ${Number.parseFloat(amount).toFixed(8)})`;
    if (isCrossChain) {
      pactCode = `(${fungibleToken?.contractAddress}.transfer-crosschain "${senderName}" "${receiverName}" (read-keyset "ks") "${receiverChainId}" ${Number.parseFloat(amount).toFixed(8)})`;
    }
    const crossKeyPairs = {
      publicKey: senderPublicKey,
    };
    const normalKeyPairs = {
      publicKey: senderPublicKey,
      clist: [
        Pact.lang.mkCap('gas', 'pay gas', 'coin.GAS').cap,
        Pact.lang.mkCap('transfer', 'transfer coin', `${fungibleToken?.contractAddress}.TRANSFER`, [
          senderName,
          receiverName,
          validAmount,
        ]).cap,
      ],
    };
    const keyPairs:any = isCrossChain ? crossKeyPairs : normalKeyPairs;
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
      meta: Pact.lang.mkMeta(
        senderName,
        senderChainId.toString(),
        validGasPrice,
        validGasLimit,
        getTimestamp(),
        CONFIG.X_CHAIN_TTL,
      ),
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
    getLocalRecent(selectedNetwork.networkId, (data) => {
      const recent = data;
      recent[`${receiverChainId}`] = recent[`${receiverChainId}`] || {};
      recent[`${receiverChainId}`][`${receiverName}`] = newRecent;
      setLocalRecent(selectedNetwork.networkId, recent);
      setRecent(convertRecent(recent));
    }, () => {
      const recent = {};
      recent[`${receiverChainId}`] = {};
      recent[`${receiverChainId}`][`${receiverName}`] = newRecent;
      setLocalRecent(selectedNetwork.networkId, recent);
      setRecent(convertRecent(recent));
    });
  };

  const onListenTransaction = (listenCmd) => {
    Pact.fetch
      .listen(listenCmd, getApiUrl(selectedNetwork.url, selectedNetwork.networkId, senderChainId))
      .then((data) => {
        // setIsLoading(false);
        const status = get(data, 'result.status');
        if (status === 'success') {
          toast.success(<Toast type="success" content="Transfer Successfully" />);
        } else if (status === 'failure') {
          toast.error(<Toast type="fail" content="Transfer Fail" />);
        }
        // history.push('/');
        // setActiveTab(ACTIVE_TAB.HOME);
      })
      .catch(() => {
        // setIsLoading(false);
        // history.push('/');
        // setActiveTab(ACTIVE_TAB.HOME);
      });
  };

  const onSend = () => {
    const newCreatedTime = new Date();
    const createdTime = newCreatedTime.toString();
    const cmd = getCmd();
    const meta = Pact.lang.mkMeta(
      senderName,
      senderChainId.toString(),
      validGasPrice,
      validGasLimit,
      getTimestamp(),
      CONFIG.X_CHAIN_TTL,
    );
    const sendCmd:any = Pact.api.prepareExecCmd(
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
      .then((data) => {
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
        getLocalActivities(selectedNetwork.networkId, senderChainId, senderName, (activities) => {
          const newActivities = [...activities];
          newActivities.push(activity);
          setLocalActivities(selectedNetwork.networkId, senderChainId, senderName, newActivities);
        }, () => {
          const newActivities:any[] = [];
          newActivities.push(activity);
          setLocalActivities(selectedNetwork.networkId, senderChainId, senderName, newActivities);
        });
        if (senderChainId.toString() !== receiverChainId.toString()) {
          getLocalCrossRequests(selectedNetwork.networkId, (crossChainRequests) => {
            const requests = [...crossChainRequests];
            requests.push(activity);
            setLocalCrossRequests(selectedNetwork.networkId, requests);
          }, () => {
            const requests = [activity];
            setLocalCrossRequests(selectedNetwork.networkId, requests);
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
        <LoadingTitle isTop>
          Please don’t close this view
        </LoadingTitle>
        <SpinnerWrapper>
          <SpokesLoading />
        </SpinnerWrapper>
        <LoadingTitle>
          You will be redirected when the transaction ends
        </LoadingTitle>
      </PageConfirm>
    );
  }
  return (
    <PageConfirm>
      <BodyContent>
        {renderTransactionInfo(info)}
        <TransactionTitle>Transaction</TransactionTitle>
        <FormItemConfirm>
          <LabelConfirm>Amount</LabelConfirm>
          <LabelBold isRight>{`${validAmount} ${fungibleToken?.symbol.toUpperCase()}`}</LabelBold>
        </FormItemConfirm>
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
      {fungibleToken?.contractAddress === 'coin'
        && (
        <BodyContent>
          <FormItemConfirm>
            <LabelBold>Total</LabelBold>
            <LabelBold isRight>{`${new BigNumber(total).decimalPlaces(12).toString()} KDA`}</LabelBold>
          </FormItemConfirm>
        </BodyContent>
        )}
      <Footer>
        <ButtonWrapper>
          <Button label="Reject" type={BUTTON_TYPE.DISABLE} onClick={(() => onClose())} size={BUTTON_SIZE.FULL} />
        </ButtonWrapper>
        <ButtonWrapper>
          <Button label="Confirm" onClick={onSend} size={BUTTON_SIZE.FULL} />
        </ButtonWrapper>
      </Footer>
    </PageConfirm>
  );
};

export default PopupConfirm;
