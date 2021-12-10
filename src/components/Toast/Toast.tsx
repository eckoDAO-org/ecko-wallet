import images from 'src/images';
import styled from 'styled-components';

const ToastWrapper = styled.div`
  color: white;
  position: relative;
  font-family: 'Play', sans-serif;
`;
const ToastLabel = styled.div`
  font-weight: 700;
  font-size: 16px;
`;
const ToastContent = styled.div`
  display: flex;
  align-items: center;
`;
const ToastDescription = styled.div`
  font-size: 12px;
  word-break: break-word;
  margin-top: 5px;
`;
const ToastBody = styled.div``;
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
        <ToastBody>
          <ToastLabel>{isSuccess ? 'Success' : 'Fail'}</ToastLabel>
          <ToastDescription>{content}</ToastDescription>
        </ToastBody>
      </ToastContent>
      <CloseIcon src={images.toast.closeWhite} alt="close-white" />
    </ToastWrapper>
  );
};

export default Toast;
