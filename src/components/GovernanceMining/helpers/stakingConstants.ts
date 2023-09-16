import { getSelectedNetwork } from 'src/stores/extensions';
import { useAppSelector } from 'src/stores/hooks';

export const useStakingConstants = () => {
  const selectedNetwork = useAppSelector(getSelectedNetwork);
  const environment = selectedNetwork.networkId;
  return stakingConfiguration[environment] || stakingConfiguration.mainnet;
};

type StakingEnvConfiguration = {
  rewardsPenaltyDaysToWait: number;
  rewardsPenaltyHoursToWait: number;
  // rewardsClaimDaysToWait: () => number;
  rewardsClaimHoursToWait: number;
  percentagePenaltyHours: number;
  dynamicPenaltyDays: number;
  maxPowerVoting: number;
};

type StakingConfiguration = {
  [key: string]: StakingEnvConfiguration;
};

const stakingConfiguration: StakingConfiguration = {
  stage: {
    rewardsPenaltyDaysToWait: 0,
    rewardsPenaltyHoursToWait: 6,
    // rewardsClaimDaysToWait: () => 0,
    rewardsClaimHoursToWait: 2,
    percentagePenaltyHours: 1,
    dynamicPenaltyDays: 0,
    maxPowerVoting: 2.5,
  },
  development: {
    rewardsPenaltyDaysToWait: 0,
    rewardsPenaltyHoursToWait: 6,
    // rewardsClaimDaysToWait: () => 0,
    rewardsClaimHoursToWait: 2,
    percentagePenaltyHours: 1,
    dynamicPenaltyDays: 0,
    maxPowerVoting: 2.5,
  },
  mainnet: {
    rewardsPenaltyDaysToWait: 60,
    rewardsPenaltyHoursToWait: 1440,
    // rewardsClaimDaysToWait: () => (lastRewardsClaim) => 7 - moment().diff(getTimeByBlockchain(lastRewardsClaim), 'days'),
    rewardsClaimHoursToWait: 168,
    percentagePenaltyHours: 72,
    dynamicPenaltyDays: 60,
    maxPowerVoting: 2.5,
  },
};
