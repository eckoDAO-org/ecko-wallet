/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext } from 'react';
import styled from 'styled-components';
import images from 'src/images';
import { ModalContext } from 'src/contexts/ModalContext';

const DropdownContainer = styled.div`
  border: 1px solid rgba(65, 31, 84, 0.15);
  height: 32px;
  border-radius: 60px;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  padding: 0px;
  line-height: 30px;
  min-width: 120px;
`;

const DropdownImg = styled.img`
  width: 10px;
`;

export const DropdownModal = ({
  title,
  modalTitle,
  modalContent,
  iconComponent,
  iconSrc,
  containerStyle,
  onClick,
  onClickIcon,
}: DropdownModalProps) => {
  const { openModal } = useContext(ModalContext);

  const onOpenModal = () => {
    openModal({ title: modalTitle, content: modalContent });
  };

  return (
    <DropdownContainer onClick={onClick || onOpenModal} style={containerStyle}>
      <span style={{ padding: '3px 10px' }}>{title}</span>
      <div
        style={{ padding: '2px 10px' }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (onClickIcon) {
            onClickIcon(e);
            onOpenModal();
          } else {
            onOpenModal();
          }
        }}
      >
        {iconComponent || <DropdownImg src={iconSrc || images.wallet.arrayDropdown} />}
      </div>
    </DropdownContainer>
  );
};

interface DropdownModalProps {
  title: React.ReactNode;
  modalTitle: React.ReactNode;
  modalContent: React.ReactNode;
  iconComponent?: React.ReactNode;
  iconSrc?: string;
  containerStyle?: React.CSSProperties;
  onClick?: React.MouseEventHandler;
  onClickIcon?: React.MouseEventHandler;
}
