import React from 'react';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import styled from 'styled-components';
import images from 'src/images';

const Img = styled.img`
  width: 10px;
  height: 10px;
  &:focus-visible {
    outline: none !important;
  }
`;
const DivBody = styled.div`
  &::-webkit-scrollbar {
    width: 2px;
  }
  &::-webkit-scrollbar-track {
    background: rgb(226, 226, 226);
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgb(186, 186, 186);
    border-radius: 2px;
  }
`;
const TitleHeader = styled.div`
  text-align: center;
  font-weight: 700;
  margin-bottom: 15px;
  font-size: 16px;
  padding: 27px 0px;
  border-bottom: 1px solid #dfdfed;
  word-break: break-word;
`;

const ModalWrapper = styled.div`
  .react-responsive-modal-modal::-webkit-scrollbar {
    display: none !important;
  }
`;

const ModalCustom = (props: Props) => {
  const { isOpen, onCloseModal, closeOnOverlayClick, title, showCloseIcon, roundIcon, children } = props;

  return (
    <ModalWrapper>
      <Modal
        open={isOpen}
        onClose={onCloseModal}
        closeIcon={<Img src={images.close} alt="close" />}
        center
        styles={{
          modal: {
            padding: 0,
            margin: 0,
            paddingBottom: 0,
            fontFamily: 'Montserrat',
            width: '100%',
            position: 'absolute',
            bottom: -20,
            left: 0,
            borderTopRightRadius: 25,
            borderTopLeftRadius: 25,
            overflowX: 'hidden',
          },
          closeButton: {
            marginRight: 20,
            top: 32,
          },
        }}
        closeOnOverlayClick={closeOnOverlayClick}
        showCloseIcon={showCloseIcon}
      >
        {title && <TitleHeader>{title}</TitleHeader>}
        <DivBody
          style={{
            padding: '1rem',
            marginBottom: 30,
            maxHeight: window.innerHeight * 0.7,
            overflowX: 'hidden',
            overflowY: 'auto',
          }}
        >
          {children}
        </DivBody>
      </Modal>
    </ModalWrapper>
  );
};
type Props = {
  isOpen: boolean;
  onCloseModal?: any;
  closeOnOverlayClick?: boolean;
  title?: React.ReactNode;
  roundIcon?: React.ReactNode;
  showCloseIcon?: boolean;
  children?: React.ReactNode;
};
export default ModalCustom;
