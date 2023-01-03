import { useState, useContext, useEffect } from 'react';
import { hideLoading, showLoading } from 'src/stores/extensions';
import { extractDecimal, fetchListLocal } from 'src/utils/chainweb';
import { BaseSelect, BaseTextInput, BaseModalSelect, InputError } from 'src/baseComponent';
import { useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import QrReader from 'react-qr-reader';
import images from 'src/images';
import { toast } from 'react-toastify';
import { ReactComponent as AlertIconSVG } from 'src/images/icon-alert.svg';
import { SInput, SLabel } from 'src/baseComponent/BaseTextInput';
import { useModalContext } from 'src/contexts/ModalContext';
import { JazzAccount } from 'src/components/JazzAccount';
import { NON_TRANSFERABLE_TOKENS } from 'src/utils/constant';
import { useAccountBalanceContext } from 'src/contexts/AccountBalanceContext';
import { SettingsContext } from 'src/contexts/SettingsContext';
import { useWindowResizeMobile } from 'src/hooks/useWindowResizeMobile';
import Toast from 'src/components/Toast/Toast';
import { humanReadableNumber, shortenAddress } from 'src/utils';
import ModalCustom from 'src/components/Modal/ModalCustom';
import { get } from 'lodash';
import { CommonLabel, DivBottomShadow, DivFlex, SecondaryLabel, StickyFooter } from 'src/components';
import useChainIdOptions from 'src/hooks/useChainIdOptions';
import Button from 'src/components/Buttons';
import { IFungibleToken } from 'src/pages/ImportToken';
import { BodyModal, TitleModal, DivChild, InputWrapper, Warning } from '../styles';
import { KeyWrapper, KeyItemWrapper, KeyRemove, ContactSuggestion } from './style';

type Props = {
  goToTransfer: any;
  sourceChainId: any;
  fungibleToken: IFungibleToken | null;
};

const predList = [
  {
    label: 'All keys',
    value: 'keys-all',
  },
  {
    label: 'Any single key',
    value: 'keys-any',
  },
];

const SelectReceiver = ({ goToTransfer, sourceChainId, fungibleToken }: Props) => {
  const rootState = useSelector((state) => state);
  const { contacts, recent, selectedNetwork } = rootState.extensions;
  const sortedContacts = [...(contacts || [])]?.sort((a, b) => a?.aliasName?.localeCompare(b?.aliasName));
  const { wallet } = rootState;
  const history = useHistory();
  const optionsChain = useChainIdOptions();
  const { data: settings } = useContext(SettingsContext);
  const txSettings = settings?.txSettings;
  const { selectedAccountBalance, usdPrices } = useAccountBalanceContext();
  const { openModal, closeModal } = useModalContext();

  const [isMobile] = useWindowResizeMobile(420);
  const [isSearching, setIsSearching] = useState(false);
  const [isScanSearching, setIsScanSearching] = useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [account, setAccount] = useState<any>({});
  const [pKeys, setPKeys] = useState<any>([]);
  const [isOpenContactSuggestion, setIsOpenContactSuggestion] = useState<boolean>(true);

  const getSourceChainBalance = (chainId: number) => {
    if (selectedAccountBalance) {
      return selectedAccountBalance[chainId] && extractDecimal(selectedAccountBalance[chainId][fungibleToken?.contractAddress as any]);
    }
    return 0;
  };

  const [selectedChainBalance, setSelectedChainBalance] = useState(0);

  useEffect(() => {
    setSelectedChainBalance(getSourceChainBalance(sourceChainId));
  }, [fungibleToken?.contractAddress]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    clearErrors,
    getValues,
    setError,
  } = useForm({
    defaultValues: {
      accountName: '',
      chainId: { value: null, label: null },
      sourceChainId: !Number.isNaN(sourceChainId) ? { value: Number(sourceChainId), label: `Chain ${sourceChainId}` } : { label: null, value: null },
      pred: { label: null, value: null },
      publicKey: '',
    },
  });

  const accountName = getValues('accountName');

  const onNext = () => {
    const receiver: string = getValues('accountName');
    const chainId: any = getValues('chainId')?.value;
    const sourceChainIdValue: any = getValues('sourceChainId')?.value;
    if (chainId === null) {
      setError('chainId', { type: 'required', message: 'Please select the Target Chain ID' });
      return;
    }
    const isDuplicated = receiver === wallet?.account && chainId.toString() === sourceChainIdValue.toString();
    if (isDuplicated) {
      toast.error(<Toast type="fail" content="Can not send to yourself" />);
    } else {
      showLoading();
      const code = `(coin.details "${receiver}")`;
      fetchListLocal(code, selectedNetwork.url, selectedNetwork.networkId, chainId, txSettings?.gasPrice, txSettings?.gasLimit)
        .then((res) => {
          hideLoading();
          setIsSearching(false);
          const status = get(res, 'result.status');
          const exist = status === 'success';
          const pred = get(res, 'result.data.guard.pred');
          const keys = get(res, 'result.data.guard.keys');
          if (exist) {
            const destinationAccount = {
              accountName: receiver,
              chainId,
              pred,
              keys,
            };
            goToTransferAccount(destinationAccount, sourceChainIdValue);
          } else if (receiver.startsWith('k:')) {
            const destinationAccount = {
              accountName: receiver,
              chainId,
              pred: predList[0].value,
              keys: [receiver.substring(2)],
            };
            goToTransferAccount(destinationAccount, sourceChainIdValue);
          } else {
            setAccount({
              accountName: receiver,
              chainId,
            });
            openModal({
              title: 'Warning',
              content: (
                <DivFlex flexDirection="column" alignItems="center" justifyContent="space-evenly" padding="15px" style={{ textAlign: 'center' }}>
                  <CommonLabel fontWeight={600} fontSize={14}>
                    You are sending to a non “k:account”! <br /> <br /> Are you sure you want to proceed?
                  </CommonLabel>
                  <DivFlex gap="10px" style={{ width: '90%', marginTop: 40 }}>
                    <Button
                      onClick={() => {
                        setValue('accountName', '');
                        closeModal();
                      }}
                      variant="secondary"
                      label="Cancel"
                      size="full"
                    />
                    <Button
                      onClick={() => {
                        closeModal();
                        setIsOpenConfirmModal(true);
                      }}
                      label="Continue"
                      size="full"
                    />
                  </DivFlex>
                </DivFlex>
              ),
            });
          }
        })
        .catch(() => {
          toast.error(<Toast type="fail" content="Network error" />);
          hideLoading();
          setIsSearching(false);
        });
    }
  };

  const goToTransferAccount = (destAccount, sourceChainIdValue) => {
    goToTransfer(destAccount, sourceChainIdValue);
    if (isOpenConfirmModal) {
      setIsOpenConfirmModal(false);
    }
  };

  const handleScanSearching = (data) => {
    if (data) {
      clearErrors('accountName');
      setValue('accountName', data);
      setIsScanSearching(false);
    }
  };

  const onAddPublicKey = () => {
    const publicKey = getValues('publicKey');
    if (publicKey.length === 64) {
      if (pKeys.includes(publicKey)) {
        setError('publicKey', { type: 'match', message: 'The public key already in list' });
      } else {
        const newPKeys = [...pKeys, publicKey];
        setPKeys(newPKeys);
        setValue('publicKey', '');
      }
    } else {
      setError('publicKey', { type: 'match', message: 'Key has unexpected length.' });
    }
  };

  const onRemoveKey = (key) => {
    const newKeys = pKeys.filter((k) => k !== key) || [];
    setPKeys(newKeys);
  };

  const renderKeys = () => (
    <KeyWrapper>
      <SecondaryLabel fontWeight={700}>KEYS</SecondaryLabel>
      {pKeys.map((key) => (
        <KeyItemWrapper key={key}>
          {key}
          <KeyRemove src={images.close} alt="remove" onClick={() => onRemoveKey(key)} />
        </KeyItemWrapper>
      ))}
    </KeyWrapper>
  );

  const getTabContent = (data) =>
    data
      ?.filter((value, index, self) => index === self.findIndex((t) => t.accountName === value.accountName))
      .map((contact: any) => (
        <JazzAccount
          account={contact.accountName}
          renderAccount={
            contact.aliasName &&
            ((acc) => (
              <DivFlex flexDirection="column">
                <CommonLabel color="#20264E" fontWeight={700} fontSize={14}>
                  {contact.aliasName}
                </CommonLabel>
                <SecondaryLabel fontWeight={500}>{shortenAddress(acc)}</SecondaryLabel>
              </DivFlex>
            ))
          }
          onClick={() => {
            setValue('accountName', contact.accountName);
            setIsOpenContactSuggestion(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ));

  const onCreateAccount = () => {
    if (errors.publicKey) return;
    const pred = getValues('pred').value;
    const publicKey = getValues('publicKey');
    let keys: any = [];
    if (pKeys.length > 0) {
      keys = pKeys;
    } else if (publicKey) {
      if (publicKey.length === 64) {
        keys = [publicKey];
      } else {
        setError('publicKey', { type: 'match', message: 'Key has unexpected length.' });
        return;
      }
    } else {
      setError('publicKey', { type: 'match', message: 'This field is required.' });
      return;
    }
    const newAccount = { ...account, pred, keys };
    setValue('publicKey', '');
    setPKeys([]);
    goToTransferAccount(newAccount, getValues('sourceChainId') && getValues('sourceChainId').value);
  };

  const isNonTransferable = NON_TRANSFERABLE_TOKENS.some((nonTransf) => nonTransf === fungibleToken?.contractAddress);

  return (
    <>
      <div>
        <form>
          {isNonTransferable ? (
            <Warning type="danger" margin="-20px 0px 10px 0px">
              <AlertIconSVG />
              <div>
                <span>{fungibleToken?.contractAddress} is not transferable!</span>
              </div>
            </Warning>
          ) : null}
          <DivBottomShadow justifyContent="center" flexDirection="column" padding="20px" margin="0 -20px">
            <InputWrapper>
              <Controller
                control={control}
                name="sourceChainId"
                rules={{
                  required: {
                    value: true,
                    message: 'This field is required.',
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <BaseModalSelect
                    value={value}
                    onChange={(chain) => {
                      setSelectedChainBalance(getSourceChainBalance(chain.value));
                      onChange(chain);
                    }}
                    options={optionsChain}
                    title="Source Chain ID"
                  />
                )}
              />
              {errors.sourceChainId && <InputError>{(errors.sourceChainId as any).message}</InputError>}
            </InputWrapper>
            <InputWrapper>
              <SLabel uppercase>{fungibleToken?.symbol} Chain balance</SLabel>
              <SInput value={selectedChainBalance} />
              {usdPrices && fungibleToken && usdPrices[fungibleToken?.contractAddress] ? (
                <SecondaryLabel>{humanReadableNumber(usdPrices[fungibleToken?.contractAddress] * selectedChainBalance)} USD</SecondaryLabel>
              ) : null}
            </InputWrapper>
            <InputWrapper style={{ borderTop: '1px solid #DFDFED', paddingTop: 10, marginTop: 30, position: 'relative' }}>
              <BaseTextInput
                inputProps={{
                  ...register('accountName', {
                    required: {
                      value: true,
                      message: 'This field is required.',
                    },
                    validate: {
                      required: (val) => val.trim().length > 0 || 'Invalid data',
                    },
                    maxLength: {
                      value: 1000,
                      message: 'Destination account should be maximum 1000 characters.',
                    },
                  }),
                }}
                title="Destination Account"
                height="auto"
                image={{
                  width: '20px',
                  height: '20px',
                  src: images.initPage.qrcode,
                  callback: () => setIsScanSearching(true),
                }}
                onChange={(e) => {
                  clearErrors('accountName');
                  setIsOpenContactSuggestion(true);
                  setValue('accountName', e.target.value);
                }}
              />
              {errors.accountName && <InputError>{errors.accountName.message}</InputError>}
              {isOpenContactSuggestion && accountName ? (
                <ContactSuggestion className="lightScrollbar">
                  {getTabContent(sortedContacts?.filter((c) => c.aliasName?.includes(accountName)))}
                </ContactSuggestion>
              ) : null}
            </InputWrapper>
            <InputWrapper>
              <Controller
                control={control}
                name="chainId"
                rules={{
                  required: {
                    value: true,
                    message: 'This field is required.',
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <BaseModalSelect value={value} onChange={onChange} options={optionsChain} title="Target Chain ID" />
                )}
              />
              {errors.chainId && <InputError>{(errors.chainId as any).message}</InputError>}
            </InputWrapper>
          </DivBottomShadow>
        </form>
      </div>
      {isSearching ? (
        <div />
      ) : (
        <div style={{ margin: '30px 0 70px 0' }}>
          <div>
            {recent.length > 0 && (
              <div>
                <SecondaryLabel>RECENT</SecondaryLabel>
                {getTabContent(recent.filter((r, i) => i < 5))}
              </div>
            )}
            {contacts.length > 0 && (
              <div>
                <SecondaryLabel>CONTACTS</SecondaryLabel>
                {getTabContent(sortedContacts)}
              </div>
            )}
          </div>
        </div>
      )}
      <StickyFooter>
        <Button onClick={handleSubmit(onNext)} label="Continue" size="full" style={{ width: '90%', maxWidth: 890 }} />
      </StickyFooter>

      {isScanSearching && (
        <ModalCustom isOpen={isScanSearching} onCloseModal={() => setIsScanSearching(false)}>
          <BodyModal>
            <TitleModal>Scan QR Code</TitleModal>
            <QrReader
              delay={1000}
              onError={() => {
                if (isMobile) {
                  (window as any)?.chrome?.tabs?.create({ url: `/index.html#${history?.location?.pathname}` });
                }
              }}
              onScan={handleScanSearching}
              style={{ width: '100%' }}
            />
            <DivChild>Place the QR code in front of your camera</DivChild>
          </BodyModal>
        </ModalCustom>
      )}
      {isOpenConfirmModal && (
        <ModalCustom isOpen={isOpenConfirmModal} title="Warning" onCloseModal={() => setIsOpenConfirmModal(false)} closeOnOverlayClick={false}>
          <div style={{ padding: '0 24px' }}>
            <DivFlex justifyContent="center">
              <JazzAccount
                diameter={50}
                account={account.accountName}
                renderAccount={
                  account.accountName &&
                  ((acc) => (
                    <DivFlex flexDirection="column">
                      <CommonLabel color="#20264E" fontWeight={700} fontSize={14}>
                        {acc}
                      </CommonLabel>
                      <SecondaryLabel fontWeight={500}>CHAIN {account.chainId}</SecondaryLabel>
                    </DivFlex>
                  ))
                }
              />
            </DivFlex>

            <DivFlex justifyContent="center" marginTop="20px" style={{ textAlign: 'center' }}>
              <CommonLabel fontWeight={600} fontSize={14}>
                Receiving account does not exist. <br />
                You must specify a keyset to create this account.
              </CommonLabel>
            </DivFlex>
            <form onSubmit={handleSubmit(onCreateAccount)} id="create-account-form">
              <InputWrapper>
                <BaseTextInput
                  inputProps={{
                    placeholder: 'Input public key',
                    ...register('publicKey', {
                      required: false,
                    }),
                  }}
                  image={{
                    width: '20px',
                    height: '20px',
                    src: images.transfer.violetAdd,
                    callback: () => onAddPublicKey(),
                  }}
                  title="Public Key"
                  height="auto"
                  onChange={(e) => {
                    clearErrors('publicKey');
                    setValue('publicKey', e.target.value);
                  }}
                />
                {errors.publicKey && <InputError>{errors.publicKey.message}</InputError>}
              </InputWrapper>
              {pKeys.length > 0 && renderKeys()}
              <InputWrapper>
                <Controller
                  control={control}
                  name="pred"
                  rules={{
                    required: {
                      value: true,
                      message: 'This field is required.',
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <BaseSelect
                      selectProps={{
                        onChange,
                        onBlur,
                        value,
                      }}
                      options={predList}
                      title="Predicate"
                      height="auto"
                      placeholder="Predicate"
                    />
                  )}
                />
                {errors.pred && !getValues('pred') && <InputError>{errors.pred}</InputError>}
              </InputWrapper>
            </form>
            <DivFlex justifyContent="space-between" alignItems="center" margin="24px 0px" gap="10px">
              <Button size="full" variant="disabled" label="Cancel" onClick={() => setIsOpenConfirmModal(false)} />
              <Button size="full" variant="primary" label="Continue" form="create-account-form" />
            </DivFlex>
          </div>
        </ModalCustom>
      )}
    </>
  );
};

export default SelectReceiver;
