import React from 'react';
import styled from 'styled-components';
import { useModalContext } from 'src/contexts/ModalContext';
import { SecondaryLabel } from 'src/components';
import images from 'src/images';
import Analytics from '../Analytics';

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  align-items: center;
  letter-spacing: 1.2px;
`;

export const Key = styled(SecondaryLabel)`
  text-transform: uppercase;
  line-height: 15px;
  justify-self: start;
  grid-column: 1;
  color: #A0A6AA;
`;

export const Value = styled(SecondaryLabel)`
  color: ${({ theme }) => theme.text.primary};
  line-height: 15px;
  justify-self: end;
  grid-column: 2;
`;

export const StatusValue = styled(Value)`
  color: ${({ error, theme }) => error ? theme.error.color : theme.success.color};
`;

const ButtonWrapper = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
`;

const IconContainer = styled.img`
  width: 24px;
  height: 24px;
  border: 10px solid #E6E6E626;
  border-radius: 50%;
`;

export const AnalyticsButton = () => {
  const { openModal } = useModalContext();
  const openAnalyticsModal = () => {
    openModal({
      title: 'Analytics',
      content: <Analytics />,
    });
  };

  return (
    <ButtonWrapper onClick={openAnalyticsModal}>
      <IconContainer src={images.governance.info} />
    </ButtonWrapper>
  );
};
