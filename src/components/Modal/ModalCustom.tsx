import React from 'react';
import 'react-responsive-modal/styles.css';
import styled from 'styled-components';
import images from 'src/images';

const Modal = styled.div`
  position: fixed;
  bottom: -150vh;
  background-color: #fff;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  width: 100%;
  box-shadow: 0 0 4px 0px rgba(0, 0, 0, 0.15);
  left: 0;
  z-index: 10;
  transition: all 0.3s ease-out;
  &.show {
    bottom: 0;
  }
`;

const Overlay = styled.div`
  background-color: rgba(0, 0, 0, 0.55);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  display: none;
  z-index: 5;
  &.show {
    display: block;
  }
`;

const Img = styled.img`
  width: 10px;
  height: 10px;
  &:focus-visible {
    outline: none !important;
  }
`;
const DivBody = styled.div`
  margin-bottom: 30;
  overflow-x: hidden;
  overflow-y: auto;
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
const DivFooter = styled.div`
  border-top: 1px solid #dfdfed;
  padding: 1rem;
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

const CloseIcon = styled.img`
  position: absolute;
  right: 25px;
  width: 12px;
`;

const ModalCustom = (props: Props) => {
  const { isOpen, onCloseModal, closeOnOverlayClick, title, showCloseIcon, roundIcon, children, footer } = props;

  return (
    <>
      <Modal className={isOpen && 'show'} closeOnOverlayClick={closeOnOverlayClick} showCloseIcon={showCloseIcon}>
        {title && (
          <TitleHeader>
            {title}
            <CloseIcon src={images.close} alt="close" onClick={onCloseModal} />
          </TitleHeader>
        )}
        <DivBody style={{ maxHeight: window.innerHeight * 0.6 }}>
          <div>{children}</div>
          <div>{footer && <DivFooter>{footer}</DivFooter>}</div>
        </DivBody>
      </Modal>
      <Overlay className={isOpen ? 'show' : ''} onClick={onCloseModal} />
    </>
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
  footer?: React.ReactNode;
};
export default ModalCustom;
