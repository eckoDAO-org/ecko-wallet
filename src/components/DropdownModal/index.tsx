/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext } from 'react';
import styled from 'styled-components';
import { ModalContext } from 'src/contexts/ModalContext';
import { ReactComponent as ArrowDropdown } from 'src/images/arrow-dropdown.svg';

const DropdownContainer = styled.div`
  border: 1px solid ${({ theme }) => theme?.text?.secondary || 'rgba(65, 31, 84, 0.15)'};
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
  svg.arrowDropdown {
    path {
      fill: ${({ theme }) => theme?.text?.secondary || 'rgba(65, 31, 84, 0.15)'};
    }
  }
`;

const DropdownImg = styled.img`
  width: 10px;
`;

const DropdownTitle = styled.span`
  padding: 2px 10px;
  color: ${({ theme }) => theme?.text?.primary};
`;

export const DropdownModal = ({
  title,
  modalTitle,
  modalContent,
  modalFooter,
  iconComponent,
  iconSrc,
  containerStyle,
  titleStyle,
  iconContainerStyle,
  onClick,
  onClickIcon,
}: DropdownModalProps) => {
  const { openModal } = useContext(ModalContext);

  const onOpenModal = () => {
    openModal({ title: modalTitle, content: modalContent, footer: modalFooter });
  };

  return (
    <DropdownContainer onClick={onClick || onOpenModal} style={containerStyle}>
      <DropdownTitle style={{ ...titleStyle }}>{title}</DropdownTitle>
      <div
        style={{ padding: '2px 10px', ...iconContainerStyle }}
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
        {iconComponent || (iconSrc ? <DropdownImg src={iconSrc} /> : <ArrowDropdown className="arrowDropdown" />)}
      </div>
    </DropdownContainer>
  );
};

interface DropdownModalProps {
  title: React.ReactNode;
  modalTitle: React.ReactNode;
  modalContent: React.ReactNode;
  modalFooter?: React.ReactNode;
  iconComponent?: React.ReactNode;
  iconSrc?: string;
  containerStyle?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
  iconContainerStyle?: React.CSSProperties;
  onClick?: React.MouseEventHandler;
  onClickIcon?: React.MouseEventHandler;
}
