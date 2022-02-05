import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import CheckBox from 'src/baseComponent/CheckBox';
import images from 'src/images';
import { setIsCreateSeedPhrase } from 'src/stores/extensions';
import { TERM_LINK } from 'src/utils/config';
import { BUTTON_SIZE } from 'src/utils/constant';
import styled from 'styled-components';
import Button from '../../components/Buttons';

const Image = styled.img`
  width: 140px;
  height: 140px;
  margin-bottom: 30px;
`;
const Wrapper = styled.div`
  padding: 0 20px;
`;
const Div = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 90px;
`;
const DivBody = styled.div`
  width: 100%;
  text-align: left;
  font-size: 16px;
  line-height: 25px;
  display: flex;
  align-items: center;
  margin: 60px 0 0;
`;
const ButtonWrapper = styled.div`
  @media screen and (max-width: 480px) {
    margin-top: 15px;
  }
`;
const Restore = styled.div`
  margin-top: 30px;
  color: ${(props) => (props.isDisabled ? '#A187AB' : '#461A57')};
  font-weight: 700;
  cursor: pointer;
  text-align: center;
  font-size: 16px;
  @media screen and (max-width: 480px) {
    margin-top: 20px;
  }
`;
const SLabel = styled.div`
  font-size: 16px;
`;
const Label = styled.span``;
const Term = styled.span`
  color: #461a57;
  font-weight: bold;
  padding-left: 5px;
  a {
    color: #461a57;
    text-decoration: none;
    :hover {
      color: #461a57;
    }
  }
`;

const getCheckboxLabel = () => (
  <SLabel>
    <Label>I have read and agree to the</Label>
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
    <Wrapper>
      <Div>
        <Image src={images.logoDapps} alt="logo" />
      </Div>
      <DivBody>
        <CheckBox isChecked={isChecked} onChange={(value) => setIsChecked(value)} label={getCheckboxLabel()} />
      </DivBody>
      <ButtonWrapper>
        <Button onClick={() => goToCreatePassword(false)} isDisabled={!isChecked} size={BUTTON_SIZE.FULL} label="Create New Wallet" />
        <Restore onClick={() => goToCreatePassword(true)} isDisabled={!isChecked}>
          Restore from recovery phrase
        </Restore>
      </ButtonWrapper>
    </Wrapper>
  );
};
export default InitSeedPhrase;
