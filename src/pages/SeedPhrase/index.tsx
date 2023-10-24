import { useHistory } from 'react-router-dom';
import images from 'src/images';
import styled from 'styled-components';
import Button from 'src/components/Buttons';
import { ReactComponent as AlertIconSVG } from 'src/images/icon-alert.svg';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Radio } from 'src/components/Radio';
import { toast } from 'react-toastify';
import { NavigationHeader } from 'src/components/NavigationHeader';
import Toast from 'src/components/Toast/Toast';
import { DivFlex, SecondaryLabel } from 'src/components';
import { generateSeedPhrase, getKeyPairsFromSeedPhrase } from 'src/utils/chainweb';
import { setIsHaveSeedPhrase } from 'src/stores/slices/extensions';
import { encryptKey } from 'src/utils/security';
import { getLocalWallets, setLocalSeedPhrase, setLocalSelectedWallet, setLocalWallets } from 'src/utils/storage';
import { setCurrentWallet, setWallets } from 'src/stores/slices/wallet';
import { Warning } from '../SendTransactions/styles';
import { SPWrapper } from '../Setting/ExportSeedPhrase';

const Footer = styled.div`
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
`;
const Wrapper = styled.div`
  padding: 0 24px;
  text-align: center;
  font-size: 16px;
  word-break: break-word;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
`;

const SPBlackDrop = styled.div`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  align-items: center;
  position: absolute;
  cursor: pointer;
  justify-content: center;
`;
const Title = styled.div`
  font-weight: 700;
  font-size: 24px;
  line-height: 25px;
  text-align: left;
  text-align: center;
  margin: 30px 0;
`;
const Text = styled.div`
  margin-bottom: ${(props) => (props.isLast ? '0' : '30px')};
`;
const LockImage = styled.img`
  width: 28px;
  height: 35px;
`;
const CheckboxWrapper = styled.div`
  margin-top: 40px;
`;
const VerifyWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-content: space-between;
  justify-content: space-between;
  margin-top: 40px;
`;
const ItemWrapper = styled.div`
  text-align: center;
  width: 22%;
`;
const SInput = styled.input`
  text-align: center;
  width: 100%;
  font-size: 16px;
  border: 1px solid #44444444;
  padding: 13px 0;
  border-radius: 8px;
  margin: 10px 0 25px 0;
  outline: none;

  background: none;
`;
const SPText = styled.div`
  ${(props) => (props.isBlur ? 'filter: blur(4px);' : '')};
  font-weight: 400;
  line-height: 40px;
  font-size: 24px;
  font-family: monospace;
`;
const defaultArr = ['', '', '', '', '', '', '', '', '', '', '', ''];
const SeedPhrase = () => {
  const history = useHistory();
  const rootState = useSelector((state) => state);
  const { passwordHash, selectedNetwork } = rootState.extensions;
  const [keyPairs, setKeyPairs] = useState<any>();
  const [step, setStep] = useState(1);
  const [sPMap, setSPMap] = useState<string[]>(defaultArr);
  const [isChecked, setIsChecked] = useState(false);
  const [enable, setEnable] = useState(false);
  const [isHiddenSP, setIsHiddenSP] = useState(true);
  const [sP, setSP] = useState('');

  useEffect(() => {
    const seedPhrase = generateSeedPhrase();
    setSP(seedPhrase);
    const newKeyPairs = getKeyPairsFromSeedPhrase(seedPhrase, 0);
    setKeyPairs(newKeyPairs);
  }, []);

  const goToSignIn = () => {
    toast.success(<Toast type="success" content="Secret Recovery Phrase verified successfully" />);
    history.push('/sign-in');
  };

  const onNext = () => {
    if (step === 1) {
      if (isChecked) {
        setStep(2);
      }
    } else if (step === 2) {
      if (!isHiddenSP) {
        setStep(3);
      }
    } else if (enable) {
      const newSP = sPMap.join(' ');
      if (newSP.trim() === sP) {
        const { publicKey, secretKey } = keyPairs;
        const accountName = `k:${publicKey}`;
        const wallet = {
          account: encryptKey(accountName, passwordHash),
          publicKey: encryptKey(publicKey, passwordHash),
          secretKey: encryptKey(secretKey, passwordHash),
          chainId: '0',
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
        getLocalWallets(
          'testnet04',
          (item) => {
            const newData = [...item, wallet];
            setLocalWallets('testnet04', newData);
          },
          () => {
            setLocalWallets('testnet04', [wallet]);
          },
        );
        const newStateWallet = {
          chainId: '0',
          account: accountName,
          publicKey,
          secretKey,
          connectedSites: [],
        };
        const newWallets = [newStateWallet];
        setWallets(newWallets);
        setLocalSelectedWallet(wallet);
        setCurrentWallet(newStateWallet);
        const seedPhraseHash = encryptKey(sP, passwordHash);
        setIsHaveSeedPhrase(true);
        setLocalSeedPhrase(seedPhraseHash);
        goToSignIn();
      } else {
        toast.error(<Toast type="fail" content="Invalid Secret Recovery Phrase!" />);
      }
    }
  };

  const goBack = () => {
    setStep(step - 1);
  };

  const showSP = () => {
    setIsHiddenSP(false);
  };

  const onDownload = () => {
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(sP)}`);
    element.setAttribute('download', 'secret-recovery-phrase');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const isFullSP = (arr) => {
    let isFull = true;
    for (let i = 0; i < 12; i += 1) {
      if (!arr[i]) {
        isFull = false;
      }
    }
    return isFull;
  };

  const onChangeSP = (value, index) => {
    const newSP = [...sPMap];
    newSP[index - 1] = value.trim();
    setSPMap(newSP);
    if (isFullSP(newSP)) {
      setEnable(true);
    } else {
      setEnable(false);
    }
  };

  const renderItem = (index) => (
    <ItemWrapper key={index}>
      {index}
      <SInput type="text" onChange={(e) => onChangeSP(e.target.value, index)} style={{ fontFamily: 'monospace' }} />
    </ItemWrapper>
  );

  const renderVerifySP = () => {
    const result: any[] = [];
    for (let i = 1; i < 13; i += 1) {
      const item = renderItem(i);
      result.push(item);
    }
    return <VerifyWrapper>{result}</VerifyWrapper>;
  };

  const renderStep1 = () => (
    <>
      <Title>Secret Recovery Phrase</Title>
      <Warning>
        <AlertIconSVG />
        <div style={{ flex: 1 }}>
          In the next step you will record your 12 word recovery phrase.
          <br />
          Your recovery phrase makes it easy to restore your wallet on a new device.
          <br />
          Anyone with this phrase can take control of your wallet, keep this phrase private.
          <br />
          Kadena cannot access your recovery phrase if lost, please store it safely.
        </div>
      </Warning>
      <CheckboxWrapper>
        <Radio
          isChecked={isChecked}
          label={<SecondaryLabel>I understand that if I lose my recovery phrase, I will not be able to restore my wallet.</SecondaryLabel>}
          onClick={() => setIsChecked((prev) => !prev)}
        />
      </CheckboxWrapper>
      <Footer style={{ marginTop: 50 }}>
        <Button size="full" onClick={onNext} isDisabled={!isChecked} label="Continue" />
      </Footer>
    </>
  );
  const renderStep2 = () => (
    <>
      <NavigationHeader title="Secret Recovery Phrase" onBack={goBack} />
      <SPWrapper>
        <SPText isBlur={isHiddenSP}>{sP}</SPText>
        {isHiddenSP && (
          <SPBlackDrop onClick={showSP}>
            <LockImage src={images.settings.iconLockOpen} alt="lock" />
            <SecondaryLabel fontWeight={500}>Click here to reveal secret words</SecondaryLabel>
          </SPBlackDrop>
        )}
      </SPWrapper>
      <Warning>
        <AlertIconSVG />
        <div style={{ flex: 1 }}>
          <Text>Your Secret Recovery Phrase makes it easy to back up and restore your account.</Text>
          <Text isLast>Warning: Never disclose your Secret Recovery Phrase. Anyone with this phrase can take your wallet forever.</Text>
        </div>
      </Warning>
      <DivFlex gap="10px" padding="24px 0">
        <Button size="full" variant="primary" onClick={onDownload} label="Download" />
        <Button size="full" onClick={onNext} isDisabled={isHiddenSP} label="Continue" />
      </DivFlex>
    </>
  );
  const renderStep3 = () => (
    <>
      <NavigationHeader title="Verify Recovery Phrase" onBack={goBack} />
      <SecondaryLabel>Please confirm your recovery phrase by typing the words in the correct order.</SecondaryLabel>
      {renderVerifySP()}
      <Footer>
        <Button size="full" onClick={onNext} isDisabled={!enable} label="Continue" />
      </Footer>
    </>
  );
  return (
    <Wrapper>
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </Wrapper>
  );
};
export default SeedPhrase;
