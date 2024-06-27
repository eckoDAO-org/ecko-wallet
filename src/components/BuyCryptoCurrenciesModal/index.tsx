import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

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
  color: ${({ theme }) => theme.text.primary};
  font-weight: bold;
  cursor: pointer;
  text-align: center;
  font-size: 16px;
`;

const BuyCryptoCurrenciesModal = () => {
  const history = useHistory();

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
      <Button onClick={handleSimplex}>simplex</Button>
      <Button onClick={handleTopper}>topper</Button>
    </Container>
  );
};

export default BuyCryptoCurrenciesModal;
