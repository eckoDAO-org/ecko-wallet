import React from 'react';
import { useHistory } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import images from 'src/images';

const scale = (factor) => keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(${factor});
  }
  100% {
    transform: scale(1);
  }
`;

const Button = styled.div`
  width: 100%;
  height: 48px;
  margin: 0 auto;
  margin-bottom: 16px;
  padding: 0px 32px 0px 24px;
  box-sizing: border-box;
  background: transparent url('${images.governance.governanceMiningBg}') 0% 0% / 100% 100% no-repeat;
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
`;

const Icon = styled.img`
  width: 56px;
  height: 56px;
  ${({ animate }) => animate && css`
    animation: 0.5s ease-in-out ${scale(0.71)};
  `}
`;

const Label = styled.span`
  text-align: center;
  font-size: 12px;
  line-height: 15px;
  font-weight: bold;
  letter-spacing: 1.2px;
  color: #FFFFFF;
  text-transform: uppercase;
  ${({ animate }) => animate && css`
    animation: 0.6s linear ${scale(0.91)};
  `}
`;

interface GovernanceMiningButtonProps {
  onClick?: () => any
}

const GovernanceMiningButton = ({ onClick }: GovernanceMiningButtonProps) => {
  const history = useHistory();
  const KDXLogo = images.governance.governanceMiningKdx;
  const [isAnimating, setIsAnimating] = React.useState(false);

  const handleClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(triggerClick, 1100);
  };

  const triggerClick = () => {
    setIsAnimating(false);
    history.push('governance-mining');
    onClick?.();
  };

  return (
    <Button onClick={handleClick}>
      <Icon src={KDXLogo} animate={isAnimating} />
      <Label animate={isAnimating}>Governance Mining</Label>
    </Button>
  );
};

export default GovernanceMiningButton;
