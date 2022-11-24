import React, { useEffect, useState } from 'react';
import { BaseTextInput } from 'src/baseComponent';
import { useSelector } from 'react-redux';
import { hideLoading, showLoading } from 'src/stores/extensions';
import { ReactComponent as AddIconSVG } from 'src/images/add-round.svg';
import { ReactComponent as AlertIconSVG } from 'src/images/icon-alert.svg';
import { ReactComponent as GearIconSVG } from 'src/images/gear-icon.svg';
import { fetchListLocal, fetchLocal, getBalanceFromChainwebApiResponse } from 'src/utils/chainweb';
import { getLocalContacts, getExistContacts } from 'src/utils/storage';
import ModalCustom from 'src/components/Modal/ModalCustom';
import { CommonLabel, DivBottomShadow, DivFlex, PaddedBodyStickyFooter, PrimaryLabel, SecondaryLabel, StickyFooter } from 'src/components';
import { JazzAccount } from 'src/components/JazzAccount';
import { SInput } from 'src/baseComponent/BaseTextInput';
import PopupConfirm from 'src/pages/SendTransactions/views/PopupConfirm';
import { toast } from 'react-toastify';
import Toast from 'src/components/Toast/Toast';
import { useSettingsContext } from 'src/contexts/SettingsContext';
import { useModalContext } from 'src/contexts/ModalContext';
import { useAccountBalanceContext } from 'src/contexts/AccountBalanceContext';
import { useForm } from 'react-hook-form';
import { CONFIG, GAS_CONFIGS, NUMBER_DECIMAL_AFTER_DOT } from 'src/utils/config';
import { get } from 'lodash';
import images from 'src/images';
import { BigNumberConverter, humanReadableNumber, shortenAddress, toFixedDown } from 'src/utils';
import { IFungibleToken } from 'src/pages/ImportToken';
import Button from 'src/components/Buttons';
import AddContact from './AddContact';
import { Warning, Footer, Error, GasItem, ErrorWrapper } from '../styles';
import { TransferImage, AmountWrapper, AccountTransferDetail } from './style';

type Props = {
  isDappTransfer?: boolean;
  sourceChainId: any;
  destinationAccount: any;
  fungibleToken: IFungibleToken | null;
};

interface Wallet {
  accountName: string;
  coinBalance: number;
  tokenBalance: number;
  publicKey: string;
  chainId: string | number;
  secretKey: string;
}
const defaultWallet: Wallet = {
  accountName: '',
  coinBalance: 0,
  tokenBalance: 0,
  publicKey: '',
  chainId: '0',
  secretKey: '',
};

interface TransactionInfo {
  sender: string;
  senderChainId: string;
  receiver: string;
  receiverChainId: string;
}

export const renderTransactionInfo = (info: TransactionInfo, containerStyle?: React.CSSProperties) => (
  <AccountTransferDetail justifyContent="space-between" alignItems="center" style={containerStyle}>
    <div>
      <JazzAccount
        account={info.sender}
        renderAccount={(acc) => (
          <DivFlex flexDirection="column">
            <span style={{ fontWeight: 500, fontSize: 12 }}>{shortenAddress(acc)}</span>
            <SecondaryLabel uppercase>chain {info.senderChainId}</SecondaryLabel>
          </DivFlex>
        )}
      />
    </div>
    <TransferImage src={images.wallet.arrowTransfer} />
    <div>
      <JazzAccount
        account={info.receiver}
        renderAccount={(acc) => (
          <DivFlex flexDirection="column">
            <span style={{ fontWeight: 500, fontSize: 12 }}>{shortenAddress(acc)}</span>
            <SecondaryLabel uppercase>chain {info.receiverChainId}</SecondaryLabel>
          </DivFlex>
        )}
      />
    </div>
  </AccountTransferDetail>
);

const Transfer = (props: Props) => {
  const { destinationAccount, fungibleToken, sourceChainId, isDappTransfer } = props;
  const { data: txSettings } = useSettingsContext();
  const { usdPrices } = useAccountBalanceContext();
  const { openModal } = useModalContext();
  const [wallet, setWallet] = useState(defaultWallet);
  const [selectedGas, setSelectedGas] = useState({ ...GAS_CONFIGS.NORMAL });
  const [amount, setAmount] = useState('0.0');
  const [isNewContact, setIsNewContact] = useState(true);
  const [aliasContact, setAliasContact] = useState('');
  const [isDestinationChainTokenError, setIsDestinationChainTokenError] = useState(false);
  const [isOpenTransferModal, setIsOpenTransferModal] = useState(false);
  const [isOpenAddContactModal, setIsOpenAddContactModal] = useState(false);
  const [isOpenGasOptionsModal, setIsOpenGasOptionsModal] = useState(false);

  const checkTokenExists = async () => {
    showLoading();
    const pactCode = `(${fungibleToken?.contractAddress}.details "${destinationAccount?.accountName}")`;
    const res = await fetchListLocal(
      pactCode,
      selectedNetwork.url,
      selectedNetwork.networkId,
      destinationAccount?.chainId,
      txSettings?.gasPrice,
      txSettings?.gasLimit,
    );
    if (res?.result?.error?.message?.includes('Cannot resolve') || res?.result?.error?.message?.includes('Database error')) {
      setIsDestinationChainTokenError(true);
    } else {
      setIsDestinationChainTokenError(false);
    }
  };

  useEffect(() => {
    setSelectedGas({
      ...selectedGas,
      GAS_LIMIT: txSettings?.gasLimit || CONFIG.GAS_LIMIT,
    });
  }, [txSettings]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm();
  const rootState = useSelector((state) => state);
  const { selectedNetwork } = rootState.extensions;
  useEffect(() => {
    initData();
    checkTokenExists();
    initContact();
  }, [selectedNetwork.networkId]);

  const initContact = () => {
    getLocalContacts(
      selectedNetwork.networkId,
      (data) => {
        const aliasName = getExistContacts(destinationAccount.accountName, data);
        if (aliasName && aliasName.length) {
          setIsNewContact(false);
          setAliasContact(aliasName);
        }
      },
      () => {},
    );
  };

  const initData = () => {
    const { account, publicKey, secretKey } = rootState.wallet;
    const pactCodeCoin = `(coin.details "${account}")`;
    const pactCodeToken = `(${fungibleToken?.contractAddress}.details "${account}")`;
    showLoading();
    fetchLocal(pactCodeCoin, selectedNetwork.url, selectedNetwork.networkId, sourceChainId)
      .then((resCoin) => {
        fetchLocal(pactCodeToken, selectedNetwork.url, selectedNetwork.networkId, sourceChainId).then((resToken) => {
          hideLoading();
          const status = get(resToken, 'result.status');
          if (status === 'success') {
            const coinBalance = getBalanceFromChainwebApiResponse(resCoin);
            const tokenBalance = getBalanceFromChainwebApiResponse(resToken);
            setWallet({
              accountName: account,
              coinBalance,
              tokenBalance,
              publicKey,
              secretKey,
              chainId: sourceChainId,
            });
          }
        });
      })
      .catch(() => {
        hideLoading();
      });
  };

  const onNext = () => {
    if (destinationAccount?.accountName === rootState.wallet.account && destinationAccount?.chainId === sourceChainId) {
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

  const estimateFee = `${BigNumberConverter(Number(selectedGas?.GAS_LIMIT) * Number(selectedGas?.GAS_PRICE) * Number(usdPrices?.coin))}`;
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

  const setPrefilledBalance = (type: 'max' | 'half') => {
    const gasFee = BigNumberConverter(Number(selectedGas?.GAS_PRICE) * Number(selectedGas?.GAS_LIMIT));
    let amountValue = BigNumberConverter(wallet?.tokenBalance);
    if (type === 'half') {
      amountValue /= 2;
    }
    if (fungibleToken?.contractAddress === 'coin') {
      amountValue -= gasFee;
    }
    const amountCustom = amountValue > 0 ? toFixedDown(amountValue, 12) : '0';
    setAmount(amountCustom);
    setValue('amount', amountCustom);
  };

  const estimateUSDAmount =
    fungibleToken?.contractAddress && Object.prototype.hasOwnProperty.call(usdPrices, fungibleToken?.contractAddress)
      ? (usdPrices[fungibleToken?.contractAddress as any] || 0) * Number(amount)
      : null;

  const getInputFontSize = (length: number) => {
    if (length < 5) {
      return 40;
    }
    if (length < 12) {
      return 40 - amount.toString().length;
    }
    return 22;
  };

  const gasOptions = (
    <>
      {/* gas option */}
      <DivFlex justifyContent="space-evenly" margin="10px 0" gap="10px" padding="0px 24px">
        {Object.keys(GAS_CONFIGS).map((config) => {
          const gas = GAS_CONFIGS[config];
          return (
            <GasItem
              key={gas.LABEL}
              isActive={selectedGas.LABEL === gas.LABEL}
              onClick={() => {
                setSelectedGas(gas);
                clearErrors('gasLimit');
                clearErrors('gasPrice');
                setValue('gasLimit', gas?.GAS_LIMIT);
                setValue('gasPrice', gas.GAS_PRICE);
              }}
            >
              {gas.LABEL}
            </GasItem>
          );
        })}
      </DivFlex>
      <DivFlex gap="10px" padding="24px">
        <div style={{ flex: 1 }}>
          {/* gas limit */}
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
            title="gas limit"
            height="auto"
            onChange={handleChangeGasLimit}
          />
          {errors.gasLimit && errors.gasLimit.type === 'required' && (
            <ErrorWrapper>
              <DivFlex>
                <Error>This field is required</Error>
              </DivFlex>
            </ErrorWrapper>
          )}
          {errors.gasLimit && errors.gasLimit.type === 'positive' && (
            <ErrorWrapper>
              <DivFlex>
                <Error>Invalid gas limit</Error>
              </DivFlex>
            </ErrorWrapper>
          )}
          {errors.gasLimit && errors.gasLimit.type === 'isInteger' && (
            <ErrorWrapper>
              <DivFlex>
                <Error>Gas limit must be integer</Error>
              </DivFlex>
            </ErrorWrapper>
          )}
        </div>
        <div style={{ flex: 1 }}>
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
            title="gas price"
            height="auto"
            onChange={handleChangeGasPrice}
            onWheel={(event) => event.currentTarget.blur()}
          />
          {errors.gasPrice && errors.gasPrice.type === 'required' && (
            <ErrorWrapper>
              <DivFlex>
                <Error>This field is required</Error>
              </DivFlex>
            </ErrorWrapper>
          )}
          {errors.gasPrice && errors.gasPrice.type === 'positive' && (
            <ErrorWrapper>
              <DivFlex>
                <Error>Invalid gas price</Error>
              </DivFlex>
            </ErrorWrapper>
          )}
        </div>
      </DivFlex>
    </>
  );

  return (
    <PaddedBodyStickyFooter paddingBottom={!isDappTransfer && 50}>
      <AccountTransferDetail justifyContent="space-between" alignItems="center">
        <div>
          <JazzAccount
            account={rootState.wallet.account}
            renderAccount={(acc) => (
              <DivFlex flexDirection="column">
                <span style={{ fontWeight: 500, fontSize: 12 }}>{shortenAddress(acc)}</span>
                <SecondaryLabel uppercase>chain {sourceChainId}</SecondaryLabel>
              </DivFlex>
            )}
          />
        </div>
        <TransferImage src={images.wallet.arrowTransfer} />
        <div>
          <JazzAccount
            account={destinationAccount.accountName}
            renderAccount={(acc) => (
              <DivFlex flexDirection="column">
                <span style={{ fontWeight: 500, fontSize: 12 }}>{shortenAddress(acc)}</span>
                <SecondaryLabel uppercase>chain {destinationAccount.chainId}</SecondaryLabel>
              </DivFlex>
            )}
          />
        </div>
      </AccountTransferDetail>
      {isNewContact && !destinationAccount.domain && (
        <Warning isContact onClick={openAddContact}>
          <AddIconSVG />
          New address detected! Add to your contacts
        </Warning>
      )}
      <form onSubmit={handleSubmit(onNext, onErrors)} id="send-transaction" noValidate>
        <DivFlex justifyContent="space-between" margin="10px 0" alignItems="center">
          <SecondaryLabel uppercase fontWeight={700} style={{ flex: 1 }}>
            Amount to send
          </SecondaryLabel>
          {!isDappTransfer && (
            <DivFlex justifyContent="flex-end" style={{ flex: 1, gap: 5 }}>
              <Button
                type="button"
                onClick={() => setPrefilledBalance('half')}
                label="HALF"
                size="full"
                variant="grey"
                style={{ height: 28, fontSize: 10, maxWidth: 60 }}
              />
              <Button
                type="button"
                onClick={() => setPrefilledBalance('max')}
                label="MAX"
                size="full"
                variant="grey"
                style={{ height: 28, fontSize: 10, maxWidth: 60 }}
              />
            </DivFlex>
          )}
        </DivFlex>
        {/* amount */}
        <AmountWrapper alignItems="center" justifyContent="space-between">
          {destinationAccount?.dappAmount ? (
            <SInput
              readOnly
              style={{
                flex: 1,
                fontSize: 45,
                fontWeight: 500,
                padding: '0px 5px 0px 13px',
              }}
              value={destinationAccount?.dappAmount}
              {...register('amount', {
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
                    const balance = Number(wallet.tokenBalance);
                    const gasFee = BigNumberConverter(Number(selectedGas.GAS_PRICE) * Number(selectedGas.GAS_LIMIT));
                    let amountValue = BigNumberConverter(balance);
                    if (fungibleToken?.contractAddress === 'coin') {
                      amountValue -= gasFee;
                    }
                    return value > 0 && value <= amountValue;
                  },
                },
              })}
              title=""
              height="auto"
            />
          ) : (
            <SInput
              autoComplete="off"
              type="number"
              value={amount}
              style={{
                flex: 1,
                fontSize: getInputFontSize(amount?.toString().length || 40),
                fontWeight: 500,
                padding: '0px 5px 0px 0px',
              }}
              onWheel={(event) => event.currentTarget.blur()}
              {...register('amount', {
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
                    const balance = Number(wallet.tokenBalance);
                    const gasFee = BigNumberConverter(Number(selectedGas.GAS_PRICE) * Number(selectedGas.GAS_LIMIT));
                    let amountValue = BigNumberConverter(balance);
                    if (fungibleToken?.contractAddress === 'coin') {
                      amountValue -= gasFee;
                    }
                    return value > 0 && value <= amountValue;
                  },
                },
              })}
              onFocus={(event) => event.target.select()}
              onChange={changeAmount}
            />
          )}
          {/** TODO: make dynamic length text <TextScaling /> */}
          <PrimaryLabel fontSize={40} uppercase>
            {fungibleToken?.symbol?.substring(0, 3)}
          </PrimaryLabel>
        </AmountWrapper>
        {errors.amount && errors.amount.type === 'required' && (
          <ErrorWrapper>
            <DivFlex>
              <Error>This field is required</Error>
            </DivFlex>
          </ErrorWrapper>
        )}
        {errors.amount && errors.amount.type === 'positive' && (
          <ErrorWrapper>
            <DivFlex>
              <Error>Insufficient funds</Error>
            </DivFlex>
          </ErrorWrapper>
        )}
        {errors.amount && errors.amount.type === 'isZero' && (
          <ErrorWrapper>
            <DivFlex>
              <Error>Invalid amount</Error>
            </DivFlex>
          </ErrorWrapper>
        )}
        <DivFlex justifyContent="space-between" alignItems="center" margin="0px">
          {!isDappTransfer && (
            <CommonLabel fontSize={12} fontWeight={600}>
              {estimateUSDAmount && `${humanReadableNumber(estimateUSDAmount)} USD`}
            </CommonLabel>
          )}
          <SecondaryLabel fontSize={12} fontWeight={600}>
            {`Balance: ${BigNumberConverter(wallet?.tokenBalance)} ${fungibleToken?.symbol.toUpperCase()}`}
          </SecondaryLabel>
        </DivFlex>
        {isDestinationChainTokenError && (
          <Warning type="danger" margin="10px 0">
            <AlertIconSVG />
            <div>
              <span>
                {fungibleToken?.contractAddress} could not exists on <b>CHAIN {destinationAccount?.chainId}</b>!
              </span>
            </div>
          </Warning>
        )}
        <DivBottomShadow margin="0 -20px 20px 0" />
        <DivFlex justifyContent="space-between">
          <SecondaryLabel fontSize={12} fontWeight={600} uppercase>
            transaction parameters
          </SecondaryLabel>
          <GearIconSVG style={{ cursor: 'pointer' }} onClick={() => setIsOpenGasOptionsModal(true)} />
        </DivFlex>
        <DivFlex justifyContent="space-between" alignItems="center" margin="20px 0">
          <SecondaryLabel fontSize={12} fontWeight={600} uppercase>
            Estimated gas {configs.gasLimit * configs.gasPrice}
            <br />
            <SecondaryLabel fontWeight={200} uppercase>
              {selectedGas.LABEL} SPEED
            </SecondaryLabel>
          </SecondaryLabel>
          <CommonLabel fontSize={12} fontWeight={600} uppercase>
            {humanReadableNumber(usdPrices?.coin * configs.gasLimit * configs.gasPrice)} USD
          </CommonLabel>
        </DivFlex>
        <Footer>
          {destinationAccount.domain ? (
            <DivFlex margin="30px 0" gap="5px">
              <Button size="full" variant="disabled" label="Reject" onClick={() => window.close()} />
              <Button size="full" label="Next" form="send-transaction" />
            </DivFlex>
          ) : (
            <StickyFooter>
              <Button form="send-transaction" label="Next" size="full" style={{ width: '90%', maxWidth: 890 }} />
            </StickyFooter>
          )}
        </Footer>
      </form>
      {isOpenTransferModal && (
        <ModalCustom isOpen={isOpenTransferModal} title="Confirm Send Transaction" onCloseModal={onCloseTransfer} closeOnOverlayClick={false}>
          <PopupConfirm
            configs={configs}
            onClose={onCloseTransfer}
            aliasContact={aliasContact}
            fungibleToken={fungibleToken}
            estimateUSDAmount={estimateUSDAmount}
            kdaUSDPrice={usdPrices?.coin}
          />
        </ModalCustom>
      )}
      <ModalCustom
        closeOnOverlayClick
        isOpen={isOpenGasOptionsModal}
        title="Transaction Parameters"
        onCloseModal={() => setIsOpenGasOptionsModal(false)}
      >
        {gasOptions}
      </ModalCustom>
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
    </PaddedBodyStickyFooter>
  );
};

export default Transfer;
