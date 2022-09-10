import { useContext, useMemo } from 'react';
import { BaseSelect, BaseTextInput, InputError } from 'src/baseComponent';
import { useSelector } from 'react-redux';
import { hideLoading, showLoading } from 'src/stores/extensions';
import { setCurrentWallet, setWallets } from 'src/stores/wallet';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import Back from 'src/components/Back';
import images from 'src/images';
import styled from 'styled-components';
import { TxSettingsContext } from 'src/contexts/TxSettingsContext';
import { useForm, Controller } from 'react-hook-form';
import Pact from 'pact-lang-api';
import { getTimestamp } from 'src/utils';
import { getApiUrl } from 'src/utils/chainweb';
import { getLocalPassword, getLocalWallets, setLocalSelectedWallet, setLocalWallets } from 'src/utils/storage';
import { encryptKey } from 'src/utils/security';
import useChainIdOptions from 'src/hooks/useChainIdOptions';
import Toast from 'src/components/Toast/Toast';

const Title = styled.div`
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  display: flex;
  cursor: pointer;
  line-height: 25px;
  text-align: left;
  width: fit-content;
`;
const Header = styled.div`
  margin: 1.5em 0;
`;
const DivBody = styled.div`
  width: 100%;
  text-align: left;
  font-size: 20px;
  display: flex;
  align-items: center;
  margin-top: 20px;
  flex-wrap: wrap;
`;
const Footer = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 90px;
  display: flex;
  justify-content: space-between;
`;
const Warning = styled.div`
  margin-top: 3em;
  text-align: left;
  background: #eee6f3;
  padding: 20px 15px;
  color: #461a57;
  margin-bottom: 25px;
  font-size: 16px;
`;
const ButtonDiv = styled.button`
  width: 100%;
  height: 44px;
  background: #461a57;
  border-radius: 10px;
  font-family: 'Play', sans-serif;
  font-weight: 700;
  border: none;
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ConditionWrapper = styled.div`
  padding: 0 20px;
`;
const Body = styled.div`
  height: auto;
  width: 100%;
`;

const INPUT_TYPE = {
  ACCOUNT_NAME: 'accountName',
  PUBLIC_KEY: 'publicKey',
  SECRET_KEY: 'secretKey',
};

const GenerateAccount = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const { data: txSettings } = useContext(TxSettingsContext);

  const history = useHistory();
  const rootState = useSelector((state) => state);
  const { wallets } = rootState.wallet;
  const { selectedNetwork, isLoading } = rootState.extensions;
  const keyPairs = useMemo(() => Pact.crypto.genKeyPair(), []);
  const { publicKey, secretKey } = keyPairs;
  const accountName = `k:${publicKey}`;

  const optionsChain = useChainIdOptions();
  const onCreateWallet = (formData) => {
    if (isLoading) return;
    const { chainId } = formData;
    const chainIdValue = chainId.value;
    const cmd = {
      keyPairs: [],
      pactCode: `(coin.create-account "${accountName}" (read-keyset "k"))`,
      envData: {
        k: [publicKey],
      },
      meta: Pact.lang.mkMeta(
        txSettings?.xChainGasStation,
        chainIdValue.toString(),
        txSettings?.xChainGasPrice,
        txSettings?.xChainGasLimit,
        getTimestamp(),
        txSettings?.xChainTTL,
      ),
      networkId: selectedNetwork.networkId,
    };

    showLoading();
    Pact.fetch
      .send(cmd, getApiUrl(selectedNetwork.url, selectedNetwork.networkId, chainIdValue))
      .then((data) => {
        const requestKey = data.requestKeys[0];
        const listenCmd = {
          listen: requestKey,
        };
        Pact.fetch
          .listen(listenCmd, getApiUrl(selectedNetwork.url, selectedNetwork.networkId, chainIdValue))
          .then(() => {
            hideLoading();
            getLocalPassword(
              (accountPassword) => {
                const wallet = {
                  account: encryptKey(accountName, accountPassword),
                  publicKey: encryptKey(publicKey, accountPassword),
                  secretKey: encryptKey(secretKey, accountPassword),
                  chainId: chainId.value,
                  connectedSites: [],
                };
                getLocalWallets(
                  selectedNetwork.networkId,
                  (item) => {
                    const newData = [...item, wallet];
                    setLocalWallets(selectedNetwork.networkId, newData);
                  },
                  () => {
                    setLocalWallets(selectedNetwork.networkId, [wallet]);
                  },
                );
                const newStateWallet = {
                  chainId: chainId.value,
                  account: accountName,
                  publicKey,
                  secretKey,
                  connectedSites: [],
                };
                const newWallets = [...wallets, newStateWallet];
                setWallets(newWallets);
                setLocalSelectedWallet(wallet);
                setCurrentWallet(newStateWallet);
                toast.success(<Toast type="success" content="Generate account successfully!" />);
                history.push('/');
              },
              () => {},
            );
          })
          .catch(() => {
            hideLoading();
            toast.error(<Toast type="fail" content="Network error" />);
          });
      })
      .catch(() => {
        hideLoading();
        toast.error(<Toast type="fail" content="Network error" />);
      });
  };

  const goBack = () => {
    history.push('/init');
  };

  const onCopyName = (inputName) => {
    let copyText = accountName;
    if (inputName === INPUT_TYPE.PUBLIC_KEY) {
      copyText = publicKey;
    } else if (inputName === INPUT_TYPE.SECRET_KEY) {
      copyText = secretKey;
    }
    navigator.clipboard.writeText(copyText);
    toast.success(<Toast type="success" content="Copied!" />);
  };

  return (
    <ConditionWrapper>
      <Header>
        <Back title="Back" onBack={goBack} />
      </Header>
      <Body>
        <form onSubmit={handleSubmit(onCreateWallet)} id="create-new-account">
          <Title>Generate new account</Title>
          <DivBody>
            <Controller
              control={control}
              name="chainId"
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
                  options={optionsChain}
                  title="Chain ID"
                  height="auto"
                />
              )}
            />
            {errors.chainId && <InputError>{errors.chainId.message}</InputError>}
          </DivBody>
          <DivBody>
            <BaseTextInput
              inputProps={{
                readOnly: true,
                value: accountName,
              }}
              title="Your account name "
              height="auto"
              image={{
                width: '12px',
                height: '12px',
                src: images.generateAccount.copy,
                callback: () => onCopyName(INPUT_TYPE.ACCOUNT_NAME),
              }}
            />
            {errors.accountName && <InputError>{errors.accountName.message}</InputError>}
          </DivBody>
          <DivBody>
            <BaseTextInput
              inputProps={{ readOnly: true, value: keyPairs.publicKey }}
              title="Your public key"
              height="auto"
              image={{
                width: '12px',
                height: '12px',
                src: images.generateAccount.copy,
                callback: () => onCopyName(INPUT_TYPE.PUBLIC_KEY),
              }}
            />
          </DivBody>
          <DivBody>
            <BaseTextInput
              inputProps={{ readOnly: true, value: keyPairs.secretKey }}
              title="Your private key"
              height="auto"
              image={{
                width: '12px',
                height: '12px',
                src: images.generateAccount.copy,
                callback: () => onCopyName(INPUT_TYPE.SECRET_KEY),
              }}
            />
          </DivBody>
        </form>
      </Body>
      <Footer>
        <ButtonDiv form="create-new-account" width={176}>
          Generate
        </ButtonDiv>
      </Footer>
      <Warning>Warning: Never disclose this key. Anyone with your private key can steal any assets held in your account.</Warning>
    </ConditionWrapper>
  );
};
export default GenerateAccount;
