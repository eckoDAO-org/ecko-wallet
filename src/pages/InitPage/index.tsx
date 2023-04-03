import styled from 'styled-components';
import images from 'src/images';
import { useHistory } from 'react-router-dom';
import { Header } from 'src/components/Header';
import { PrimaryLabel, SecondaryLabel } from 'src/components';

const CreateInitPageWrapper = styled.div`
  padding: 0 20px;
  text-align: center;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 1024px) {
    height: auto;
    margin-top: 100px;
  }
`;
const Body = styled.div`
  font-size: 16px;
`;
const Image = styled.img`
  height: 155px;
  width: 155px;
  cursor: pointer;
`;
const DivChild = styled.div`
  margin-top: 50px;
  margin-bottom: 20px;
`;
const InitPage = () => {
  const history = useHistory();
  const goToImport = () => {
    history.push('/import-wallet');
  };
  return (
    <>
      <Header hideAccounts />
      <CreateInitPageWrapper>
        <Body>
          <SecondaryLabel fontSize={14}>I have an existing private key.</SecondaryLabel>
          <br />
          <SecondaryLabel fontSize={14}>Import your existing private key</SecondaryLabel>
          <DivChild>
            <Image src={images.initPage.importPrivateKey} alt="icon-import" onClick={goToImport} />
          </DivChild>
          <PrimaryLabel>Import</PrimaryLabel>
        </Body>
      </CreateInitPageWrapper>
    </>
  );
};

export default InitPage;
