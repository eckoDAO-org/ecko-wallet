import React from 'react';
import styled, { css } from 'styled-components';

interface CircledButtonProps {
  label?: string;
  iconUrl: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'brand';
}

const ButtonWrapper = styled.button`
  width: 50px;
  height: fit-content;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Circle = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ theme, variant }) => variant === "primary" && css`
    background-color: ${theme.button.primary}
  `}

  ${({ theme, variant }) => variant === "secondary" && css`
    background-color: ${theme.button.secondary}
  `}

  ${({ theme, variant }) => variant === "brand" && css`
    outline: 1px solid ${theme.brand}
  `}
`;

const Icon = styled.img`
  width: 16px;
  height: 16px;
`;

const Label = styled.span`
  margin-top: 4px;
  font-family: 'Montserrat';
  font-weight: 700;
  font-size: 14px;
  color: ${({ theme }) => theme.text.primary}
`;

const CircledButton: React.FC<CircledButtonProps> = ({
  label,
  iconUrl,
  onClick,
  variant = 'primary',
}) => (
  <ButtonWrapper onClick={onClick}>
    <Circle variant={variant}>
      <Icon src={iconUrl} alt="Icon" />
    </Circle>
    {label && <Label>{label}</Label>}
  </ButtonWrapper>
);

export default CircledButton;
