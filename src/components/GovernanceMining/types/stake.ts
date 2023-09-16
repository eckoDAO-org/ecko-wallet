export interface StakeStatus {
  stakedTokens: number;
  rewards: StakeRewards;
  votingPower: number;
}

export interface StakeRewards {
  collectedTokens: number;
  effectiveStartDate: string;
  penaltyTokens: number;
}
