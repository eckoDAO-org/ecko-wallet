import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CommonLabel, DivFlex, SecondaryLabel } from 'src/components';
import { Radio } from 'src/components/Radio';
import images from 'src/images';
import { setIsCreateSeedPhrase } from 'src/stores/extensions';
import { TERM_LINK } from 'src/utils/config';
import styled from 'styled-components';

export const WelcomeBackground = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  color: white;
  background-image: url('/image/background-welcome.svg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
`;

const Image = styled.img`
  width: 140px;
  height: 140px;
  margin-bottom: 30px;
`;
const Div = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 90px;
`;
const DivBody = styled.div`
  width: 100%;
  font-size: 16px;
  line-height: 25px;
  display: flex;
  align-items: center;
  margin: 60px 10px 0;
  padding: 20px;
`;
const SLabel = styled.div`
  font-size: 16px;
`;
const Term = styled.span`
  font-weight: bold;
  padding-left: 5px;
  a {
    text-decoration: none;
    color: #ffffff;
    :hover {
    }
  }
`;
const StartButton = styled(DivFlex)`
  background: linear-gradient(114.43deg, #293445 5.17%, #292a45 65.62%);
  justify-content: center;
  align-items: flex-start;
  border-radius: 25px;
  padding: 32px 0px;
  gap: 13px;
  img {
    width: 22px;
  }
`;

const getCheckboxLabel = () => (
  <SLabel>
    <span>I have read and agree to the</span>
    <br />
    <Term>
      <a href={TERM_LINK} target="_blank" rel="noreferrer">
        Terms of Use
      </a>
    </Term>
  </SLabel>
);

const InitSeedPhrase = () => {
  const history = useHistory();
  const [isChecked, setIsChecked] = useState(false);
  const goToCreatePassword = (isHaveSP) => {
    if (isChecked) {
      setIsCreateSeedPhrase(isHaveSP);
      history.push('/create-password');
    }
  };
  return (
    <WelcomeBackground>
      <Div>
        <Image src={images.xWalletLogoSquare} size={200} width={200} alt="logo" />
      </Div>
      <DivBody>
        <Radio isChecked={isChecked} label={getCheckboxLabel()} onClick={() => setIsChecked((prev) => !prev)} />
      </DivBody>
      <div style={{ padding: 30, opacity: isChecked ? 1 : 0.2 }}>
        <StartButton onClick={() => goToCreatePassword(false)} style={{ cursor: isChecked ? 'pointer' : 'default' }}>
          <img src={images.wallet.startUser} />
          <DivFlex flexDirection="column">
            <CommonLabel color="#fff" fontWeight={600} fontSize={18}>
              Create New Wallet
            </CommonLabel>
            <SecondaryLabel>Setup new xWallet account</SecondaryLabel>
          </DivFlex>
        </StartButton>
        <StartButton onClick={() => goToCreatePassword(true)} marginTop="20px" style={{ cursor: isChecked ? 'pointer' : 'default' }}>
          <img src={images.wallet.arrowTransfer} />
          <DivFlex flexDirection="column">
            <CommonLabel color="#fff" fontWeight={600} fontSize={18}>
              Restore Wallet
            </CommonLabel>
            <SecondaryLabel>Restore from recovery phrase</SecondaryLabel>
          </DivFlex>
        </StartButton>
      </div>
    </WelcomeBackground>
  );
};
export default InitSeedPhrase;
