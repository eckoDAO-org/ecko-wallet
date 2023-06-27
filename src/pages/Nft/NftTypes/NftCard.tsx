import React from 'react';
import { useModalContext } from 'src/contexts/ModalContext';
import styled from 'styled-components';

export const NftCardContainer = styled.div`
  flex-basis: 50%;
  flex-grow: 0;
  margin-bottom: 15px;
  display: flex;
  cursor: pointer;
  justify-content: center;
  div {
    background-image: url('${({ src }) => src}');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    position: relative;
    width: 140px;
    height: 140px;
    border-radius: 10px;
    @media (min-width: 500px) {
      width: 200px;
      height: 200px;
    }
    @media (min-width: 700px) {
      width: 300px;
      height: 300px;
    }
  }
  .categoryNft {
    color: ${({ theme }) => theme.text.primary};
    background: ${({ theme }) => theme.background};
    border-radius: 100px;
    padding: 1px 7px;
    text-align: left;
    font-weight: 500;
    font-size: 11px;
    position: absolute;
    left: 10px;
    bottom: 6px;
    span {
      font-weight: 300;
    }
    @media (min-width: 500px) {
      font-size: 12px;
    }
    @media (min-width: 700px) {
      font-size: 15px;
      bottom: 10px;
    }
  }
`;

const NftCard = ({
  src,
  label,
  modalTitle,
  modalContent,
  onClick,
  style,
}: {
  src: string;
  label: React.ReactNode;
  modalTitle?: string;
  modalContent?: React.ReactNode;
  onClick?: any;
  style?: any;
}) => {
  const { openModal } = useModalContext();

  const onClickCard = () => {
    if (onClick) {
      onClick();
    } else if (modalTitle && modalContent) {
      openModal({
        title: modalTitle,
        content: modalContent,
      });
    }
  };

  return (
    <NftCardContainer src={src} onClick={onClickCard}>
      <div style={style}>
        <span className="categoryNft">{label}</span>
      </div>
    </NftCardContainer>
  );
};

export default NftCard;
