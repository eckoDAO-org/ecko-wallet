import { useEffect, useState } from 'react';
import { BaseSelect, BaseTextInput } from 'src/baseComponent';
import { useSelector } from 'react-redux';
import { hideLoading, showLoading } from 'src/stores/extensions';
import { fetchLocal, getBalanceFromChainwebApiResponse } from 'src/utils/chainweb';
import { getLocalContacts, getExistContacts } from 'src/utils/storage';
import ModalCustom from 'src/components/Modal/ModalCustom';
import PopupConfirm from 'src/pages/SendTransactions/views/PopupConfirm';
import { toast } from 'react-toastify';
import Toast from 'src/components/Toast/Toast';
import { Controller, useForm } from 'react-hook-form';
import { BUTTON_SIZE, BUTTON_TYPE, GAS_PAYER } from 'src/utils/constant';
import { ESTIMATE_KDA_TO_USD_API, GAS_CONFIGS, NUMBER_DECIMAL_AFTER_DOT } from 'src/utils/config';
import { get } from 'lodash';
import images from 'src/images';
import { BigNumberConverter, shortenAddress } from 'src/utils';
import Button from 'src/components/Buttons';
import Tooltip from 'src/components/Tooltip';
import {
  ButtonSend,
  Warning,
  Footer,
  LabelMax,
  Item,
  Error,
  Label,
  TransferWrapper,
  GasOptions,
  GasOptionsWrapper,
  GasItem,
  ErrorWrapper,
  TransactionTitle,
} from '../styles';
import {
  TransferButton,
  SendTransaction,
  TransferItem,
  TransferName,
  TransferDetails,
  AccountDetails,
  ImageSpace,
  TransactionImage,
  ImageWrapper,
  TransferImage,
  AddImage,
  AmountWrapper,
  Balance,
  KadenaImage,
  SpaceDiv,
  TooltipImage,
  TransferHr,
} from './style';
import AddContact from './AddContact';

type Props = {
  destinationAccount: any;
}
export const renderTransactionInfo = (info) => (
  <SendTransaction>
    <TransferItem isTop>
      <TransferName>
        Sender Account
      </TransferName>
      <TransferDetails>
        <AccountDetails>
          {shortenAddress(info.sender)}
          <ImageSpace>
            <TransactionImage
              cursor="pointer"
              src={images.wallet.copyGray}
              alt="copy-gray"
              onClick={() => {
                navigator.clipboard.writeText(info.sender);
                toast.success(<Toast type="success" content="Copied!" />);
              }}
            />
          </ImageSpace>
        </AccountDetails>
        <span>{`Chain ID ${info.senderChainId}`}</span>
      </TransferDetails>
    </TransferItem>
    <ImageWrapper>
      <TransferImage src={images?.transfer?.arrowDownViolet} width="100%" size="auto" alt="down-arrow" />
    </ImageWrapper>
    <TransferItem>
      <TransferName>
        Destination Account
      </TransferName>
      <TransferDetails>
        <AccountDetails>
          {shortenAddress(info.receiver)}
          <ImageSpace>
            <TransactionImage
              cursor="pointer"
              src={images.wallet.copyGray}
              alt="copy-gray"
              onClick={() => {
                navigator.clipboard.writeText(info.receiver);
                toast.success(<Toast type="success" content="Copied!" />);
              }}
            />
          </ImageSpace>
        </AccountDetails>
        <span>{`Chain ID ${info.receiverChainId}`}</span>
      </TransferDetails>
    </TransferItem>
  </SendTransaction>
);
interface Wallet {
  accountName: string;
  balance: number,
  publicKey: string,
  chainId: string | number,
  secretKey: string,
}
const defaultWallet:Wallet = {
  accountName: '',
  balance: 0,
  publicKey: '',
  chainId: '0',
  secretKey: '',
};
const Transfer = (props: Props) => {
  const { destinationAccount } = props;
  const [wallet, setWallet] = useState(defaultWallet);
  const [selectedGas, setSelectedGas] = useState(GAS_CONFIGS.NORMAL);
  const [amount, setAmount] = useState('');
  const [isNewContact, setIsNewContact] = useState(true);
  const [aliasContact, setAliasContact] = useState('');
  const [isOpenTransferModal, setIsOpenTransferModal] = useState(false);
  const [isOpenAddContactModal, setIsOpenAddContactModal] = useState(false);
  const [KDApriceEstimate, setKDApriceEstimate] = useState(1);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    clearErrors,
  } = useForm();
  const rootState = useSelector((state) => state);
  const { selectedNetwork } = rootState.extensions;
  useEffect(() => {
    initData();
    initContact();
  }, [selectedNetwork.networkId]);
  useEffect(() => {
    fetch(ESTIMATE_KDA_TO_USD_API)
      .then((res) => res.json())
      .then(
        (result) => {
          setKDApriceEstimate(result?.kadena?.usd);
        },
        () => {},
      );
  }, []);
  const initContact = () => {
    getLocalContacts(selectedNetwork.networkId, (data) => {
      const aliasName = getExistContacts(destinationAccount.accountName, destinationAccount.chainId, data);
      if (aliasName && aliasName.length) {
        setIsNewContact(false);
        setAliasContact(aliasName);
      }
    }, () => {});
  };

  const initData = () => {
    const {
      account,
      chainId,
      publicKey,
      secretKey,
    } = rootState.wallet;
    const pactCode = `(coin.details "${account}")`;
    showLoading();
    fetchLocal(pactCode, selectedNetwork.url, selectedNetwork.networkId, chainId).then((res) => {
      hideLoading();
      const status = get(res, 'result.status');
      if (status === 'success') {
        const balance = getBalanceFromChainwebApiResponse(res);
        setWallet({
          accountName: account,
          balance,
          publicKey,
          secretKey,
          chainId,
        });
      }
    })
      .catch(() => {
        hideLoading();
      });
  };

  const onNext = () => {
    if (destinationAccount?.accountName === rootState.wallet.account && destinationAccount?.chainId === rootState.wallet.chainId) {
      toast.error(<Toast type="fail" content="Can not send to yourself" />);
    } else {
      setIsOpenTransferModal(true);
    }
  };
  const openAddContact = () => {
    setIsOpenAddContactModal(true);
  };
  const onErrors = () => {};

  const handleChangeGasPrice = (e) => {
    const { value } = e.target;
    clearErrors('gasPrice');
    let number = value
      .toString()
      .replace(/[^0-9.]/g, '')
      .replace(/(\..*?)\..*/g, '$1');
    if (number.includes('.')) {
      const numString = number.toString().split('.');
      if (numString[1].length > NUMBER_DECIMAL_AFTER_DOT) {
        number = number.substring(0, number.length - 1);
      }
    }
    setSelectedGas({ ...selectedGas, GAS_PRICE: number });
    setValue('gasPrice', number);
  };
  const handleChangeGasLimit = (e) => {
    const { value } = e.target;
    clearErrors('gasLimit');
    setSelectedGas({ ...selectedGas, GAS_LIMIT: value });
    setValue('gasLimit', value);
  };

  const changeAmount = (e) => {
    const { value } = e.target;
    clearErrors('amount');
    let number = value
      .toString()
      .replace(/[^0-9.]/g, '')
      .replace(/(\..*?)\..*/g, '$1');
    if (number.includes('.')) {
      const numString = number.toString().split('.');
      if (numString[1].length > NUMBER_DECIMAL_AFTER_DOT) {
        number = number.substring(0, number.length - 1);
      }
    }
    setAmount(number);
    setValue('amount', number);
  };

  const estimateFee = `${BigNumberConverter(Number(selectedGas?.GAS_LIMIT) * Number(selectedGas?.GAS_PRICE) * Number(KDApriceEstimate))}`;
  const isCrossChain = wallet?.chainId?.toString() !== destinationAccount?.chainId?.toString();
  const configs = {
    senderName: wallet?.accountName,
    senderChainId: wallet?.chainId,
    senderPublicKey: wallet?.publicKey,
    senderPrivateKey: wallet?.secretKey,
    receiverName: destinationAccount?.accountName,
    domain: destinationAccount?.domain,
    dappAmount: destinationAccount?.dappAmount,
    receiverChainId: destinationAccount?.chainId,
    receiverPred: destinationAccount?.pred,
    receiverKeys: destinationAccount?.keys,
    gasLimit: selectedGas?.GAS_LIMIT,
    gasPrice: selectedGas?.GAS_PRICE,
    amount,
    isCrossChain,
    selectedNetwork: rootState?.extensions?.selectedNetwork,
    estimateFee,
  };

  const onCloseTransfer = () => {
    setIsOpenTransferModal(false);
    initData();
  };

  const onCloseAddContact = (aliasName) => {
    if (aliasName && aliasName.length) {
      setAliasContact(aliasName);
      setIsNewContact(false);
    }
    setIsOpenAddContactModal(false);
  };
  const setMaxBalance = () => {
    const gasFee = BigNumberConverter(Number(selectedGas?.GAS_PRICE) * Number(selectedGas?.GAS_LIMIT));
    const amountValue = BigNumberConverter(wallet?.balance - gasFee);
    const amountCustom = amountValue > 0 ? amountValue.toString() : '0';
    setAmount(amountCustom);
    setValue('amount', amountCustom);
  };
  const renderAmountLabel = () => (
    <AmountWrapper>
      Amount
      <Balance>{`Balance: ${BigNumberConverter(wallet?.balance)} KDA`}</Balance>
    </AmountWrapper>
  );
  const renderTitle = (title, tooltip) => (
    <AmountWrapper>
      {title}
      <Tooltip tooltipText={tooltip}>
        <TooltipImage src={images.transfer.info} alt="info" />
      </Tooltip>
    </AmountWrapper>
  );
  const info = {
    sender: rootState.wallet.account,
    senderChainId: rootState.wallet.chainId,
    receiver: destinationAccount.accountName,
    receiverChainId: destinationAccount.chainId,
  };

  return (
    <TransferWrapper>
      {renderTransactionInfo(info)}
      {isNewContact && !destinationAccount.domain && (
        <Warning isContact onClick={openAddContact}>
          <AddImage src={images.transfer.violetAdd} alt="add" />
          New address detected! Add to your contacts
        </Warning>
      )}
      <TransferHr />
      <TransactionTitle>Transaction</TransactionTitle>
      <form onSubmit={handleSubmit(onNext, onErrors)} id="send-transaction" noValidate>
        {/* amount */}
        <SpaceDiv>
          {destinationAccount?.dappAmount ? (
            <BaseTextInput
              inputProps={{
                readOnly: true,
                value: destinationAccount?.dappAmount,
                ...register('amount', {
                  required: {
                    value: true,
                    message: 'This field is required.',
                  },
                  validate: {
                    isZero: (v) => {
                      const value = Number(v);
                      return value !== 0;
                    },
                    positive: (v) => {
                      const value = Number(v);
                      const balance = Number(wallet.balance);
                      const gasFee = BigNumberConverter(Number(selectedGas.GAS_PRICE) * Number(selectedGas.GAS_LIMIT));
                      const amountValue = BigNumberConverter(balance - gasFee);
                      return (value > 0 && value <= amountValue);
                    },
                  },
                }),
              }}
              title={renderAmountLabel()}
              height="auto"
            />
          ) : (
            <BaseTextInput
              inputProps={{
                type: 'number',
                value: amount,
                placeholder: '0.0',
                ...register('amount', {
                  required: {
                    value: true,
                    message: 'This field is required.',
                  },
                  validate: {
                    isZero: (v) => {
                      const value = Number(v);
                      return value !== 0;
                    },
                    positive: (v) => {
                      const value = Number(v);
                      const balance = Number(wallet.balance);
                      const gasFee = BigNumberConverter(Number(selectedGas.GAS_PRICE) * Number(selectedGas.GAS_LIMIT));
                      const amountValue = BigNumberConverter(balance - gasFee);
                      return (value > 0 && value <= amountValue);
                    },
                  },
                }),
              }}
              title={renderAmountLabel()}
              height="auto"
              onChange={changeAmount}
              onWheel={(event) => event.currentTarget.blur()}
              numberOptions={{
                content: (
                  <Item>
                    <LabelMax onClick={setMaxBalance}>MAX</LabelMax>
                    <KadenaImage src={images.wallet.iconKadenaToken} alt="logo" />
                    <Label>KDA</Label>
                  </Item>
                ),
              }}
            />
          )}
          {errors.amount && errors.amount.type === 'required' && (
            <ErrorWrapper>
              <GasOptions>
                <Error>This field is required</Error>
              </GasOptions>
            </ErrorWrapper>
          )}
          {errors.amount && errors.amount.type === 'positive' && (
            <ErrorWrapper>
              <GasOptions>
                <Error>Insufficient funds</Error>
              </GasOptions>
            </ErrorWrapper>
          )}
          {errors.amount && errors.amount.type === 'isZero' && (
            <ErrorWrapper>
              <GasOptions>
                <Error>Invalid amount</Error>
              </GasOptions>
            </ErrorWrapper>
          )}
        </SpaceDiv>
        {isCrossChain && (
          <SpaceDiv>
            <Controller
              control={control}
              name="gasPayer"
              render={({ field: { onChange, onBlur } }) => (
                <BaseSelect
                  selectProps={{
                    onChange,
                    onBlur,
                    value: GAS_PAYER[0],
                  }}
                  options={GAS_PAYER}
                  title={`Gas Payer For Chain ${destinationAccount?.chainId}`}
                  height="auto"
                />
              )}
            />
          </SpaceDiv>
        )}
        {/* gas limit */}
        <SpaceDiv>
          <BaseTextInput
            inputProps={{
              type: 'number',
              placeholder: '0',
              value: selectedGas?.GAS_LIMIT,
              ...register('gasLimit', {
                required: {
                  value: true,
                  message: 'This field is required.',
                },
                validate: {
                  positive: (v) => {
                    const value = Number(v);
                    return value > 0;
                  },
                  isInteger: (v) => {
                    const reg = /^\d+$/;
                    return reg.test(v);
                  },
                },
              }),
            }}
            onWheel={(event) => event.currentTarget.blur()}
            title={renderTitle('Gas Limit', 'Gas limit is the maximum amount of units of gas you are willing to spend.')}
            height="auto"
            onChange={handleChangeGasLimit}
          />
          {errors.gasLimit && errors.gasLimit.type === 'required' && (
            <ErrorWrapper>
              <GasOptions>
                <Error>This field is required</Error>
              </GasOptions>
            </ErrorWrapper>
          )}
          {errors.gasLimit && errors.gasLimit.type === 'positive' && (
            <ErrorWrapper>
              <GasOptions>
                <Error>Invalid gas limit</Error>
              </GasOptions>
            </ErrorWrapper>
          )}
          {errors.gasLimit && errors.gasLimit.type === 'isInteger' && (
            <ErrorWrapper>
              <GasOptions>
                <Error>Gas limit must be integer</Error>
              </GasOptions>
            </ErrorWrapper>
          )}
        </SpaceDiv>
        {/* gas price */}
        <BaseTextInput
          inputProps={{
            type: 'number',
            placeholder: '0',
            value: selectedGas.GAS_PRICE,
            ...register('gasPrice', {
              required: {
                value: true,
                message: 'This field is required.',
              },
              validate: {
                positive: (v) => {
                  const value = Number(v);
                  return value > 0;
                },
              },
            }),
          }}
          title={renderTitle('Gas Price', 'Gas price specifies the amount of Kadena you are willing to pay for each unit of gas.')}
          height="auto"
          onChange={handleChangeGasPrice}
          onWheel={(event) => event.currentTarget.blur()}
        />
        {errors.gasPrice && errors.gasPrice.type === 'required' && (
          <ErrorWrapper>
            <GasOptions>
              <Error>This field is required</Error>
            </GasOptions>
          </ErrorWrapper>
        )}
        {errors.gasPrice && errors.gasPrice.type === 'positive' && (
          <ErrorWrapper>
            <GasOptions>
              <Error>Invalid gas price</Error>
            </GasOptions>
          </ErrorWrapper>
        )}
        {/* gas option */}
        <GasOptionsWrapper>
          <GasOptions>
            {Object.keys(GAS_CONFIGS).map((config) => {
              const gas = GAS_CONFIGS[config];
              return (
                <GasItem
                  key={gas.LABEL}
                  isActive={selectedGas.LABEL === gas.LABEL}
                  onClick={() => { setSelectedGas(gas); clearErrors('gasLimit'); clearErrors('gasPrice'); setValue('gasLimit', gas?.GAS_LIMIT); setValue('gasPrice', gas.GAS_PRICE); }}
                >
                  {gas.LABEL}
                </GasItem>
              );
            })}
          </GasOptions>
        </GasOptionsWrapper>
        {isCrossChain && (
          <Warning>
            {`You are about to do a cross chain transfer from chain ${wallet?.chainId} on which you are currently operating to chain ${destinationAccount?.chainId}. This operation may take up to 4 minutes and may result in failure depending on a Public Gas Station faucet operation or selected account availability. Don’t close extension while it’s processing the operation. The initial request key will be in log file.`}
          </Warning>
        )}
        <Footer>
          {destinationAccount.domain ? (
            <>
              <TransferButton>
                <Button type={BUTTON_TYPE.DISABLE} size={BUTTON_SIZE.FULL} label="Reject" onClick={() => window.close()} />
              </TransferButton>
              <TransferButton>
                <ButtonSend form="send-transaction">Next</ButtonSend>
              </TransferButton>
            </>
          ) : (
            <ButtonSend form="send-transaction">Next</ButtonSend>
          )}
        </Footer>
      </form>
      {isOpenTransferModal && (
        <ModalCustom
          isOpen={isOpenTransferModal}
          title="Confirm Send Transaction"
          onCloseModal={onCloseTransfer}
          closeOnOverlayClick={false}
        >
          <PopupConfirm configs={configs} onClose={onCloseTransfer} aliasContact={aliasContact} />
        </ModalCustom>
      )}
      {isOpenAddContactModal && (
        <ModalCustom
          isOpen={isOpenAddContactModal}
          title="Add To Address Book"
          onCloseModal={() => setIsOpenAddContactModal(false)}
          closeOnOverlayClick={false}
        >
          <AddContact onClose={onCloseAddContact} contact={destinationAccount} networkId={selectedNetwork.networkId} />
        </ModalCustom>
      )}
    </TransferWrapper>
  );
};

export default Transfer;
