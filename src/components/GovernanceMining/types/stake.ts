export interface StakeStatus {
  stakedTokens: number;
  pendingTokens: number;
  rewards: StakeRewards;
  votingPower: number;
}

export interface StakeRewards {
  collectedTokens: number;
  lastStakeDate: string;
  effectiveStartDate: string;
  rewardPenaltyTokens: number;
  canClaim: boolean;
  lastClaimDate: string;
}
