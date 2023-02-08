import { useHistory } from 'react-router-dom';
import { DivFlex, SecondaryLabel, StickyFooter } from 'src/components';
import images from 'src/images';
import styled from 'styled-components';
import Button from '../../components/Buttons';

const Image = styled.img<{ size: string; top: string; width: string }>`
  height: ${($props) => $props.size};
  width: ${($props) => ($props.width ? $props.width : $props.size)};
  margin: auto;
  cursor: ${(props) => props.cursor};
  margin-top: ${(props) => props.marginTop};
`;

const Wrapper = styled.div`
  text-align: center;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  @media screen and (max-width: 1024px) {
    height: auto;
    margin-top: 100px;
  }
`;
export const StartBackground = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
  background-image: url('/image/init-background.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
`;
const DivImage = styled.div`
  font-size: ${(props) => props.fontSize};
  color: ${(props) => props.color};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: ${(props) => props.fontWeight};
  margin-top: ${(props) => props.marginTop};
  margin-bottom: ${(props) => props.marginBottom};
`;
const HomePage = () => {
  const history = useHistory();
  const goToTermsCondition = () => {
    history.push('/term-condition');
  };
  return (
    <StartBackground>
      <Wrapper>
        <DivImage marginBottom="120px">
          <Image src={images.eckoWalletLogo} size={200} width={200} alt="logo" />
          <SecondaryLabel>The evolution of DeFi on Kadena</SecondaryLabel>
        </DivImage>
      </Wrapper>
      <StickyFooter style={{ background: 'transparent', padding: '20px 0px' }}>
        <Button size="full" variant="disabled" onClick={goToTermsCondition} label="Start Now" style={{ width: '90%', maxWidth: 890 }} />
      </StickyFooter>
    </StartBackground>
  );
};
export default HomePage;
