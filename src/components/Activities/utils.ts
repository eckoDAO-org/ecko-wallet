import { IFungibleToken } from 'src/pages/ImportToken';
import { shortenAddress } from 'src/utils';
import { LocalActivity } from './types';

export const inferSymbolFromLocalActivity = (activity: LocalActivity, tokens: IFungibleToken[]) => {
  const inferredSymbol = (
    // First, try to retrieve from local tokens (user added tokens)
    tokens.find((t) => t.contractAddress === activity.module)?.symbol
  ) || (
    // Then try to user ticker from DEX, then symbol previously stored i local activity, else use module address
    activity.ticker || activity.symbol || activity.module
  );

  const inferredToken = inferredSymbol === activity.module ? shortenAddress(activity.module) : inferredSymbol;
  return inferredToken;
};

export const generateActivityWithId = (activity: Omit<LocalActivity, 'id'>): LocalActivity => ({
  ...activity,
  id: generateActivityId(activity),
});

export const generateActivityId = (activity: Omit<LocalActivity, 'id'>): string => (
  `${activity.requestKey}${activity.direction}${activity.sender}${activity.receiver}${activity.module}`
);
