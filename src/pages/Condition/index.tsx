import { useHistory } from 'react-router-dom';
import images from 'src/images';
import styled from 'styled-components';
import Back from 'src/components/Back';
import Button from 'src/components/Buttons';
import { BUTTON_SIZE } from 'src/utils/constant';

const DivBody = styled.div`
  width: 100%;
  text-align: left;
  font-size: 20px;
  line-height: 25px;
  display: flex;
  margin-bottom: 10px;
`;
const Footer = styled.div`
  margin-top: 200px;
  @media screen and (max-width: 1024px) {
    margin-top: 180px;
  }
`;
const Img = styled.img`
  height: 20px;
  width: 20px;
`;
const ConditionWrapper = styled.div`
  padding: 0 20px;
  padding: 0px 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 85%;
`;
const Body = styled.div`
  height: 100%;
  width: 100%;
  margin-top: 30px;
`;
const TextRight = styled.div`
  width: calc(100% - 2em);
  float: right;
  height: 100%;
  font-size: 16px;
`;
const Icon = styled.div`
  width: 2em;
  height: 100%;
  float: left;
`;
const Condition = () => {
  const history = useHistory();
  const goBack = () => {
    history.push('/home-page');
  };
  const onNext = () => {
    history.push('/init-seed-phrase');
  };
  return (
    <ConditionWrapper>
      <Back title="Back" onBack={goBack} />
      <Body>
        <DivBody>
          <Icon>
            <Img src={images.wallet.checkedViolet} alt="check-box" />
          </Icon>
          <TextRight>We never collect keys, addresses, transactions, balances, hashes, or any personal information</TextRight>
        </DivBody>
        <DivBody>
          <Icon>
            <Img src={images.wallet.checkedViolet} alt="check-box" />
          </Icon>
          <TextRight>We never collect your full IP address</TextRight>
        </DivBody>
        <DivBody>
          <Icon>
            <Img src={images.wallet.checkedViolet} alt="check-box" />
          </Icon>
          <TextRight>We never sell data for profit. Ever!</TextRight>
        </DivBody>
      </Body>
      <Footer>
        <Button onClick={onNext} label="Next" size="full" />
      </Footer>
    </ConditionWrapper>
  );
};
export default Condition;
