import styled from 'styled-components';
import images from 'src/images';
import { useHistory } from 'react-router-dom';

const CreateInitPageWrapper = styled.div`
  padding: 0 20px;
  text-align: center;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 1024px){
    height: auto;
    margin-top: 100px;
  }
`;
const Body = styled.div`
  font-family: 'Play', sans-serif;
  font-size: 16px;
`;
const TextContent = styled.div`
  text-align: center;
  padding: 0 20px;
  margin-bottom: 5px;
`;
const TextFooter = styled.div`
  color: #461A57;
  text-align: center;
  font-weight: 700;
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
    <CreateInitPageWrapper>
      <Body>
        <TextContent>
          I have an existing private key.
        </TextContent>
        <TextContent>
          Import your existing private key
        </TextContent>
        <DivChild>
          <Image src={images.initPage.importPrivateKey} alt="icon-import" onClick={goToImport} />
        </DivChild>
        <TextFooter>Import</TextFooter>
      </Body>
    </CreateInitPageWrapper>
  );
};

export default InitPage;
