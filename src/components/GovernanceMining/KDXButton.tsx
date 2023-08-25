import React from 'react';
import styled from 'styled-components';
import images from 'src/images';

const Button = styled.div`
  width: 100%;
  height: 48px;
  margin: 0;
  margin-bottom: 16px;
  padding: 0px 32px;
  box-sizing: border-box;
  border: none;
  border-radius: 16px;
  background: linear-gradient(to right, #774669, #76465a, #6b3e4a, #5b6158, #346565);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Icon = styled.img`
  width: 56px;
  height: 56px;
`;

const Label = styled.span`
  flex-grow: 1;
  text-align: center;
  font-size: 12px;
  line-height: 15px;
  font-weight: bold;
  letter-spacing: 1.2px;
  color: #FFFFFF;
  text-transform: uppercase;
`;

const DeadSpace = styled.div`
  width: 56px;
`;

interface GovernanceMiningButtonProps {
  onClick?: () => any
}

const GovernanceMiningButton = ({ onClick }: GovernanceMiningButtonProps) => {
  const history = useHistory();
  const KDXLogo = images.wallet.tokens['kaddex.kdx'];

  const handleClick = () => {
    onClick?.();
  };

  return (
    <Button onClick={handleClick}>
      <Icon src={KDXLogo} />
      <Label>Governance Mining</Label>
      <DeadSpace />
    </Button>
  );
};

export default GovernanceMiningButton;
