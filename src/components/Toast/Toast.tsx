import images from 'src/images';
import styled from 'styled-components';
import { SecondaryLabel } from '..';

const ToastWrapper = styled.div`
  font-family: Montserrat;
  color: black;
  font-weight: 500;
  position: relative;
`;
const ToastLabel = styled.div`
  color: ${({ theme }) => theme.text.primary};
  font-weight: 700;
  font-size: 12px;
`;
const ToastContent = styled.div`
  display: flex;
  align-items: center;
`;
const ToastIcon = styled.img`
  width: ${(props) => (props.isSuccess ? '16px' : '24px')};
  height: ${(props) => (props.isSuccess ? '12px' : '24px')};
  margin-left: 5px;
  margin-right: 15px;
`;
const CloseIcon = styled.img`
  position: absolute;
  top: 0;
  right: 0;
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;
type Props = {
  type: string;
  content: any;
};

const Toast = (props: Props) => {
  const { type, content } = props;
  const isSuccess = type === 'success';
  return (
    <ToastWrapper>
      <ToastContent>
        <ToastIcon src={isSuccess ? images.toast.successToast : images.toast.failToast} />
        <div>
          <ToastLabel>{isSuccess ? 'Success' : 'Fail'}</ToastLabel>
          <SecondaryLabel fontSize={11}>{content}</SecondaryLabel>
        </div>
      </ToastContent>
      <CloseIcon src={images.toast.closeWhite} alt="close-white" />
    </ToastWrapper>
  );
};

export default Toast;
