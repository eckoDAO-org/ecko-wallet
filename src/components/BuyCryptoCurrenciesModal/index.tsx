import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useAppThemeContext } from 'src/contexts/AppThemeContext';
import images from 'src/images';
import { AppThemeEnum } from 'src/themes';

const Container = styled.div`
  margin: 0 24px;
`;

const Button = styled.button`
  width: 100%;
  margin: 0 auto;
  margin-bottom: 16px;
  padding: 18px;
  box-sizing: border-box;
  background-color: transparent;
  border: ${({ theme }) => `1px solid ${theme.button.secondary}`};
  border-radius: 16px;
  cursor: pointer;
`;

const Image = styled.img`
  width: auto;
  height: 24px;
`;

const BuyCryptoCurrenciesModal = () => {
  const history = useHistory();
  const { selectedTheme } = useAppThemeContext();

  const key = selectedTheme === AppThemeEnum.LIGHT ? 'light' : 'dark';
  const [simplexImage, topperImage] = [
    images.cryptoProviders.simplex[key],
    images.cryptoProviders.topper[key],
  ];

  const handleSimplex = () => {
    const url = history.createHref({ pathname: 'buy/simplex' });
    window.open(url, '_blank');
  };

  const handleTopper = () => {
    const url = history.createHref({ pathname: 'buy/topper' });
    window.open(url, '_blank');
  };

  return (
    <Container>
      <Button onClick={handleSimplex}>
        <Image src={simplexImage} />
      </Button>
      <Button onClick={handleTopper}>
        <Image src={topperImage} />
      </Button>
    </Container>
  );
};

export default BuyCryptoCurrenciesModal;
