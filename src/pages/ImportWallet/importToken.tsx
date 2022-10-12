import { BaseTextInput } from 'src/baseComponent';
import images from 'src/images';
import styled from 'styled-components';

const Title = styled.div`
  margin-left: 0;
  height: 50px;
  font-style: normal;
  font-weight: 400;
  font-size: 30px;
  line-height: 25px;
  text-align: left;
  float: left;
  margin-top: 1em;
  width: 100%;
`;
const DivBody = styled.div`
  width: 100%;
  text-align: left;
  font-size: 20px;
  line-height: 40px;
  display: flex;
  align-items: center;
  margin: 2em 0;
`;
const Footer = styled.div`
  width: 100%;
  text-align: center;
  height: 3em;
  margin-top: 3em;
`;
const ButtonAdd = styled.button`
  width: 100%;
  height: 44px;
  background: #461a57;
  border-radius: 20px;
  border: none;
  color: #ffffff;
  margin: 0 auto;
  font-size: 16px;
`;
const Img = styled.img`
  height: 15px;
  width: 15px;
  margin-right: 10px;
`;
const ConditionWrapper = styled.div`
  padding: 0 20px;
  width: 62vw;
  min-height: 82vh;
  box-shadow: 0 0 7px 0 #461a57;
  position: absolute;
  text-align: center;
`;
const Body = styled.div`
  height: auto;
  width: 100%;
`;
const importToken = () => {
  const textImport = 'Add Custom token';
  return (
    <div className="main-container-wrapper">
      <ConditionWrapper>
        <Title>
          <Img src={images.back} />
          Back
        </Title>
        <Body>
          <Title>Import Tokens</Title>
          <DivBody>
            <BaseTextInput title="Token Contract Address " />
          </DivBody>
          <DivBody>
            <BaseTextInput title="Token Symbol" />
          </DivBody>
          <DivBody>
            <BaseTextInput title="Token Decimal " />
          </DivBody>
        </Body>
        <Footer>
          <ButtonAdd>{textImport}</ButtonAdd>
        </Footer>
      </ConditionWrapper>
    </div>
  );
};
export default importToken;
