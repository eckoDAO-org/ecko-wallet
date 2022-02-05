import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import styled from 'styled-components';
import { useWindowResizeMobile } from 'src/hooks/useWindowResizeMobile';
import images from 'src/images';

const Div = styled.div`
  font-size: 16px;
  color: #461a57;
  word-break: break-word;
`;
const Img = styled.img`
  margin-top: 5px;
`;
const TitleHeader = styled.div`
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: #461a57;
  margin-bottom: 15px;
`;

const Hr = styled.hr`
  height: 2px;
  background: linear-gradient(90deg, #d2ab72 0%, #b66e84 35.42%, #b2579b 64.06%, #9ee9e4 99.48%);
  transform: matrix(1, 0, 0, -1, 0, 0);
  border: none;
  width: 120%;
  margin-left: -1.2rem;
`;
const ModalWrapper = styled.div`
  .react-responsive-modal-containerCenter::-webkit-scrollbar {
    width: 2px;
  }

  .react-responsive-modal-containerCenter::-webkit-scrollbar-track {
    background: rgb(226, 226, 226);
  }

  .react-responsive-modal-containerCenter::-webkit-scrollbar-thumb {
    background-color: rgb(54, 54, 54);
    border-radius: 2px;
  }
`;

const ModalCustom = (props: Props) => {
  const { isOpen, onCloseModal, closeOnOverlayClick, title, showCloseIcon, children } = props;
  const [isMobile] = useWindowResizeMobile(420);
  return (
    <ModalWrapper>
      <Modal
        open={isOpen}
        onClose={onCloseModal}
        closeIcon={<Img src={images.close} alt="close" />}
        center
        styles={{
          modal: {
            minWidth: isMobile ? '260px' : '350px',
            minHeight: '200px',
            fontFamily: 'Play',
            background: 'linear-gradient(90deg, #E6FEFE 0%, #FDF6E6 100%)',
            overflowX: 'hidden',
          },
        }}
        closeOnOverlayClick={closeOnOverlayClick}
        showCloseIcon={showCloseIcon}
      >
        {title && (
          <>
            <Div>
              <TitleHeader>{title}</TitleHeader>
            </Div>
            <Hr />
          </>
        )}
        <Div>{children}</Div>
      </Modal>
    </ModalWrapper>
  );
};
type Props = {
  isOpen: boolean;
  onCloseModal?: any;
  closeOnOverlayClick?: boolean;
  title?: string;
  showCloseIcon?: boolean;
  children?: any;
};
export default ModalCustom;
