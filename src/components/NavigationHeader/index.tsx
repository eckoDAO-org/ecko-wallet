import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { CommonLabel, DivFlex } from 'src/components';
import { ReactComponent as ArrowDown } from 'src/images/arrow-down-black.svg';

const NavigatorWrapper = styled(DivFlex)`
  height: 75px;
`;

const NavigatorIcon = styled.div`
  svg {
    rotate: 90deg;
    width: 18px;
    height: auto;
    fill: ${({ theme }) => theme.text.primary};
  }
  cursor: pointer;
`;

export const NavigationHeader = ({ title, back, onBack }: { title: string; back?: string; onBack?: any }) => {
  const history = useHistory();
  return (
    <NavigatorWrapper justifyContent="space-between" alignItems="center" onClick={onBack || (() => history.push(back || '/'))}>
      <NavigatorIcon>
        <ArrowDown />
      </NavigatorIcon>
      <CommonLabel fontSize={18} fontWeight={500}>
        {title}
      </CommonLabel>
      <div />
    </NavigatorWrapper>
  );
};
