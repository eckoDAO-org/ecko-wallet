import React from 'react';
import moment from 'moment';
import { useStakingConstants } from '../constants/staking';
import { AnalyticsButton, Container, Key, StatusValue, Value } from './UI';

type DetailsProps = {
  collected: number;
  effectiveStartDate: string;
  rewardPenalty: number;
  votingPower: number;
};

const Details = ({ collected, effectiveStartDate, rewardPenalty, votingPower }: DetailsProps) => {
  const [hasPenalty, waitingTime] = getWaitingTimeRewardsPenalty(effectiveStartDate);
  return (
    <Container>
      <Key>Analytics</Key>
      <Value>
        <AnalyticsButton />
      </Value>

      <Key>KDX collected</Key>
      <Value>{collected.toFixed(6)} KDX</Value>

      <Key>Waiting time</Key>
      <StatusValue error={!!hasPenalty}>{waitingTime}</StatusValue>

      <Key>Reward penalty</Key>
      <StatusValue error={!!hasPenalty}>{rewardPenalty ? rewardPenalty.toFixed(6) : 'None'}</StatusValue>

      <Key>Voting Power</Key>
      <Value>{votingPower}</Value>
    </Container>
  );
};

const getWaitingTimeRewardsPenalty = (effectiveStartDate: string) => {
  const STAKING_CONSTANTS = useStakingConstants();

  const daysToWait = STAKING_CONSTANTS.rewardsPenaltyDaysToWait - moment().diff(effectiveStartDate, 'days');
  const hoursToWait = STAKING_CONSTANTS.rewardsPenaltyHoursToWait - moment().diff(effectiveStartDate, 'hours');
  const minutesToWait = STAKING_CONSTANTS.rewardsPenaltyHoursToWait * 60 - moment().diff(effectiveStartDate, 'minutes');

  if (daysToWait > 1) {
    return [true, `${daysToWait} Days`];
  }

  if (hoursToWait > 1) {
    return [true, `${hoursToWait} Hours`];
  }

  if (minutesToWait > 1) {
    return [true, `${minutesToWait} Minutes`];
  }

  if (minutesToWait === 1) {
    return [true, `${minutesToWait} Minute`];
  }

  return [false, '0 Seconds'];
};

export default Details;