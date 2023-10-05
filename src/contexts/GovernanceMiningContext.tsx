import React, { createContext, useContext } from 'react';
// import { useGetLastDayData } from 'src/components/GovernanceMining/api/analytics';
import { useGetAccountData } from 'src/components/GovernanceMining/api/kaddex.dao';
import { StakerInspection, createPendingStakeActivity, createPendingUnstakeActivity, useInspectStaker, useStake, useRollupAndUnstake } from 'src/components/GovernanceMining/api/kaddex.staking';
import { PoolState, StakeRewards, StakeStatus } from 'src/components/GovernanceMining/types';
import { getTimeByBlockchain } from 'src/components/GovernanceMining/helpers/stringUtils';

export interface GovernanceMiningContextValue {
  stakeStatus: StakeStatus;
  poolState: PoolState;
  fetch: () => void;
  requestStake: (amount: number) => Promise<string|undefined>;
  requestUnstake: (amount: number, claimRewards: boolean) => Promise<string|undefined>;
}

const emptyStakeStatus: StakeStatus = {
  stakedTokens: 0,
  pendingTokens: 0,
  rewards: {
    collectedTokens: 0,
    effectiveStartDate: '',
    penaltyTokens: 0,
  },
  votingPower: 0,
};

const emptyPoolState: PoolState = {
  dailyVolumeInUsd: 0,
  stakingRewardsInPercentual: 0,
  burnedTokens: 0,
  totalStakedTokens: 0,
};

const defaultStatGovernanceMiningValue: GovernanceMiningContextValue = {
  stakeStatus: emptyStakeStatus,
  poolState: emptyPoolState,
  fetch: () => {},
  requestStake: async () => undefined,
  requestUnstake: async () => undefined,
};

const GovernanceMiningContext = createContext<GovernanceMiningContextValue>(defaultStatGovernanceMiningValue);

interface GovernanceMiningContextProviderProps {
  children: React.ReactNode;
}

export const GovernanceMiningContextProvider: React.FC<GovernanceMiningContextProviderProps> = ({ children }) => {
  const [stakeStatus, setStakeStatus] = React.useState(emptyStakeStatus);
  const [poolState, setPoolState] = React.useState(emptyPoolState);

  const [accountData, setAccountData] = React.useState<any>();
  const [stakerInspection, setStakerInspection] = React.useState<StakerInspection>();
  // const [lastDayData, setLastDayData] = React.useState<any>();
  const getAccountData = useGetAccountData();
  const inspectStaker = useInspectStaker();
  const stake = useStake();
  const unstake = useRollupAndUnstake();
  // const getLastDayData = useGetLastDayData();

  const getStakeStatus = () => {
    if (!accountData || !stakerInspection) {
      setStakeStatus(emptyStakeStatus);
      return;
    }

    const rewards: StakeRewards = {
      collectedTokens: stakerInspection['reward-accrued'],
      effectiveStartDate: getTimeByBlockchain(stakerInspection['stake-record']['effective-start']),
      penaltyTokens: stakerInspection['reward-penalty'],
    };

    const newStakeStatus: StakeStatus = {
      stakedTokens: accountData['staked-amount'],
      pendingTokens: stakerInspection['stake-record']['pending-add'],
      rewards,
      votingPower: accountData.vp,
    };

    setStakeStatus(newStakeStatus);
  };

  const getPoolState = () => {
    if (!stakerInspection) {
      setStakeStatus(emptyStakeStatus);
      return;
    }

    const dailyVolumeInUsd = 0;

    const newPoolState: PoolState = {
      dailyVolumeInUsd,
      stakingRewardsInPercentual: 0.5,
      burnedTokens: 10,
      totalStakedTokens: 100,
    };

    setPoolState(newPoolState);
  };

  const fetch = async () => {
    const newAccountData = await getAccountData();
    const newStakerInpsection = await inspectStaker();
    // const newLastDayData = [{ _id: '65025b14b9c3fa2a9d899238', communitySale: 49999981.92906779, liquidityMining: 378640486.4958971, daoTreasury: { amount: 247364000, lpPositions: [{ tokenAIdentifier: 'coin', tokenBIdentifier: 'kaddex.kdx', amountTokenA: 125133.03927029687, amountTokenB: 5881165.292362267, poolShare: 0.2117510098 }] }, burn: { tokenBurn: 99028327.76270387, stakingBurn: 208371.46149860538 }, circulatingSupply: { totalSupply: 224758815.79520985, lockedAmount: 69808635.07271297, stakedAmount: 136853384.06067222, vaultedAmount: 69808635.07271297 }, chain: 2, dayString: '2023-09-14', day: '2023-09-14T00:00:00.951Z', __v: 0 }, { _id: '6503ac93b9c3fa2a9d8a0c88', communitySale: 49999981.92906779, liquidityMining: 378640484.98058766, daoTreasury: { amount: 247364000, lpPositions: [{ tokenAIdentifier: 'coin', tokenBIdentifier: 'kaddex.kdx', amountTokenA: 124870.67662051246, amountTokenB: 5893564.337268905, poolShare: 0.2117775243 }] }, burn: { tokenBurn: 99028327.76270387, stakingBurn: 208371.46149860538 }, circulatingSupply: { totalSupply: 224758815.79520985, lockedAmount: 69808635.07271297, stakedAmount: 138502655.85213962, vaultedAmount: 69808635.07271297 }, chain: 2, dayString: '2023-09-15', day: '2023-09-15T00:00:00.367Z', __v: 0 }];
    /* await getLastDayData(); */

    newAccountData.status === 'success' && setAccountData(newAccountData?.data);
    newStakerInpsection.status === 'success' && setStakerInspection(newStakerInpsection.data);
    // setLastDayData(newLastDayData);
  };

  const requestStake = async (amount: number) => {
    const result = await stake(amount);
    const requestKey = result.response.requestKeys[0];

    if (!requestKey) {
      return undefined;
    }

    createPendingStakeActivity(result);

    return requestKey;
  };

  const requestUnstake = async (amount: number, claimRewards: boolean) => {
    const result = await unstake(amount, claimRewards);
    const requestKey = result.response.requestKeys[0];

    if (!requestKey) {
      return undefined;
    }

    createPendingUnstakeActivity(result);

    return requestKey;
  };

  const contextValue: GovernanceMiningContextValue = {
    stakeStatus,
    poolState,
    fetch,
    requestStake,
    requestUnstake,
  };

  React.useEffect(() => {
    fetch();
  }, []);

  React.useEffect(() => {
    getStakeStatus();
    getPoolState();
  }, [accountData, stakerInspection]);

  return (
    <GovernanceMiningContext.Provider value={contextValue}>
      {children}
    </GovernanceMiningContext.Provider>
  );
};

export const useGovernanceMining = () => {
  const context = useContext(GovernanceMiningContext);
  return context;
};
