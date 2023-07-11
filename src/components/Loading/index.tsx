import ReactLoading, { LoadingType } from 'react-loading';
import { useAppThemeContext } from 'src/contexts/AppThemeContext';
import styled from 'styled-components';

type Props = {
  type?: LoadingType;
  color?: string;
};

const LoadingWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #00000018;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Loading = (props: Props) => {
  const { theme } = useAppThemeContext();
  const { type = 'spin', color = theme.footer?.primary ?? '#20264e' } = props;

  return (
    <LoadingWrapper id="loading">
      <ReactLoading type={type} color={color} />
    </LoadingWrapper>
  );
};

export default Loading;
