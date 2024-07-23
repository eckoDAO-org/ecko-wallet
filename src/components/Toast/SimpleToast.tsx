import { SecondaryLabel } from 'src/components';
import { useAppThemeContext } from 'src/contexts/AppThemeContext';
import images from 'src/images';
import { CloseIcon, ToastContent, ToastWrapper } from './Toast';

type SimpleToastProps = {
  content: any;
};

const SimpleToast = ({ content }: SimpleToastProps) => {
  const { theme } = useAppThemeContext();
  const closeImage = theme.isDark ? images.toast.closeWhite : images.toast.closeBlack;

  return (
    <ToastWrapper>
      <ToastContent>
        <SecondaryLabel fontSize={11}>{content}</SecondaryLabel>
      </ToastContent>
      <CloseIcon src={closeImage} />
    </ToastWrapper>
  );
};

export default SimpleToast;
