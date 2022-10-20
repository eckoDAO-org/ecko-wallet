import styled from 'styled-components';
import images from 'src/images';
import { useHistory } from 'react-router-dom';
import { CommonLabel, DivFlex } from '..';

const NavigatorWrapper = styled(DivFlex)`
  height: 75px;
`;

const NavigatorIcon = styled.div`
  img {
    rotate: 90deg;
    width: 18px;
  }
  cursor: pointer;
`;

export const NavigationHeader = ({ title, back, onBack }: { title: string; back?: string; onBack?: any }) => {
  const history = useHistory();
  return (
    <NavigatorWrapper justifyContent="space-between" alignItems="center" onClick={onBack || (() => history.push(back || '/'))}>
      <NavigatorIcon>
        <img src={images.wallet.arrowDownBlack} />
      </NavigatorIcon>
      <CommonLabel fontSize={18} fontWeight={500}>
        {title}
      </CommonLabel>
      <div />
    </NavigatorWrapper>
  );
};
