import { SecondaryLabel } from 'src/components';
import images from 'src/images';
import { CloseIcon, ToastContent, ToastWrapper } from './Toast';

type SimpleToastProps = {
  content: any;
};

const SimpleToast = ({ content }: SimpleToastProps) => (
  <ToastWrapper>
    <ToastContent>
      <SecondaryLabel fontSize={11}>{content}</SecondaryLabel>
    </ToastContent>
    <CloseIcon src={images.toast.closeWhite} alt="close-white" />
  </ToastWrapper>
);

export default SimpleToast;
