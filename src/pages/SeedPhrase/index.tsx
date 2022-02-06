import { useHistory } from 'react-router-dom';
import images from 'src/images';
import styled from 'styled-components';
import Back from 'src/components/Back';
import Button from 'src/components/Buttons';
import { BUTTON_SIZE } from 'src/utils/constant';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CheckBox from 'src/baseComponent/CheckBox';
import { toast } from 'react-toastify';
import Toast from 'src/components/Toast/Toast';
import { generateSeedPhrase, getKeyPairsFromSeedPhrase } from 'src/utils/chainweb';
import { setIsHaveSeedPhrase } from 'src/stores/extensions';
import { encryptKey } from 'src/utils/security';
import { getLocalWallets, setLocalSeedPhrase, setLocalSelectedWallet, setLocalWallets } from 'src/utils/storage';
import { setCurrentWallet, setWallets } from 'src/stores/wallet';

const Footer = styled.div`
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
`;
const CLabel = styled.span`
  font-size: 16px;
`;
const Wrapper = styled.div`
  padding: 0 20px;
  color: #461a57;
  font-size: 16px;
  word-break: break-word;
`;
const SPWrapper = styled.div`
  padding: 16px;
  font-size: 16px;
  position: relative;
  border: 1px solid #b3b3b3;
  border-radius: 8px;
  box-sizing: border-box;
  margin-top: 30px;
  text-align: center;
  background: linear-gradient(90deg, rgba(230, 254, 254, 0.9) 0%, rgba(253, 246, 230, 0.9) 100%);
`;
const SPBlackDrop = styled.div`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, rgba(230, 254, 254, 0.9) 0%, rgba(253, 246, 230, 0.9) 100%);
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
const SPDropText = styled.div`
  text-align: center;
  text-transform: uppercase;
  margin-top: 12px;
  font-weight: 700;
`;
const LockImage = styled.img`
  width: 28px;
  height: 35px;
`;
const Description = styled.div`
  text-align: center;
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
const CustomButton = styled.div`
  margin-top: 20px;
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
  color: #461a57;
  font-family: 'Play', sans-serif;
  background: none;
`;
const SPContent = styled.div`
  text-align: center;
  background: #eee6f3;
  padding: 18px 15px;
  margin-top: 20px;
  font-size: 16px;
  border: 1px solid #461a57;
  border-radius: 8px;
  align-items: center;
`;
const SPText = styled.div`
  ${(props) => (props.isBlur ? 'filter: blur(4px);' : '')};
  font-weight: 400;
  line-height: 40px;
  font-size: 24px;
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
    toast.success(<Toast type="success" content="Verify Secret Recovery Phrase Successfully!" />);
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
      <SInput type="text" onChange={(e) => onChangeSP(e.target.value, index)} />
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
      <SPContent>
        <Text>In the next step you will record your 12 word recovery phrase.</Text>
        <Text>Your recovery phrase makes it easy to restore your wallet on a new device.</Text>
        <Text>Anyone with this phrase can take control of your wallet, keep this phrase private.</Text>
        <Text isLast>Kadena cannot access your recovery phrase if lost, please store it safely.</Text>
      </SPContent>
      <CheckboxWrapper>
        <CheckBox
          isChecked={isChecked}
          onChange={(value) => setIsChecked(value)}
          label={<CLabel>I understand that if I lose my recovery phrase, I will not be able to restore my wallet.</CLabel>}
        />
      </CheckboxWrapper>
      <Footer>
        <Button onClick={onNext} isDisabled={!isChecked} label="Continue" size={BUTTON_SIZE.FULL} />
      </Footer>
    </>
  );
  const renderStep2 = () => (
    <>
      <Back title="Back" onBack={goBack} />
      <Title step={step}>Secret Recovery Phrase</Title>
      <SPWrapper>
        <SPText isBlur={isHiddenSP}>{sP}</SPText>
        {isHiddenSP && (
          <SPBlackDrop onClick={showSP}>
            <LockImage src={images.settings.lockImg} alt="lock" />
            <SPDropText>Click here to reveal secret words</SPDropText>
          </SPBlackDrop>
        )}
      </SPWrapper>
      <SPContent>
        <Text>Your Secret Recovery Phrase makes it easy to back up and restore your account.</Text>
        <Text isLast>Warning: Never disclose your Secret Recovery Phrase. Anyone with this phrase cane take your wallet forever.</Text>
      </SPContent>
      <CustomButton>
        <Button onClick={onDownload} label="Download" size={BUTTON_SIZE.FULL} />
      </CustomButton>
      <Footer>
        <Button onClick={onNext} isDisabled={isHiddenSP} label="Continue" size={BUTTON_SIZE.FULL} />
      </Footer>
    </>
  );
  const renderStep3 = () => (
    <>
      <Back title="Back" onBack={goBack} />
      <Title>Verify Recovery Phrase</Title>
      <Description>Please confirm your recovery phrase by typing the words in the correct order.</Description>
      {renderVerifySP()}
      <Footer>
        <Button onClick={onNext} isDisabled={!enable} label="Continue" size={BUTTON_SIZE.FULL} />
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
