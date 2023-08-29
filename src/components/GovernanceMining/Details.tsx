import React from 'react';
import styled from 'styled-components';
import { SecondaryLabel } from 'src/components';
import images from 'src/images';

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  align-items: center;
  letter-spacing: 1.2px;
`;

const Key = styled(SecondaryLabel)`
  text-transform: uppercase;
  line-height: 15px;
  justify-self: start;
  grid-column: 1;
`;

const Value = styled(SecondaryLabel)`
  color: ${({ error, theme }) => error ? theme.error.color : theme.text.primary};
  line-height: 15px;
  justify-self: end;
  grid-column: 2;
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
  border: 10px solid #E6E6E626;
  border-radius: 50%;
`;

type DetailsProps = {
  hasPosition: false;
  symbol: string;
  collected?: number;
  waitingDays?: number;
  rewardPenalty?: number;
  votingPower?: number;
} | {
  hasPosition: true;
  collected: number;
  waitingDays: number;
  rewardPenalty: number;
  votingPower: number;
};

const Details = ({ ...props }: DetailsProps) => {
  const [
    collected,
    waitingDays,
    rewardPenalty,
    votingPower,
  ] = props.hasPosition ? [
    `${props.collected.toFixed(2)} KDX`,
    `${props.waitingDays} Days`,
    props.rewardPenalty || 'None',
    props.votingPower,
  ] : [
    '—', '—', '—', '—',
  ];

  return (
    <Container>
      <Key>Analytics</Key>
      <Value>
        <Icon src={images.governance.info} />
      </Value>

      <Key>KDX collected</Key>
      <Value>{collected}</Value>

      <Key>Waiting time</Key>
      <Value error={props.hasPosition}>{waitingDays}</Value>

      <Key>Reward penalty</Key>
      <Value error={props.hasPosition}>{rewardPenalty}</Value>

      <Key>Voting Power</Key>
      <Value>{votingPower}</Value>
    </Container>
  );
};

export default Details;
