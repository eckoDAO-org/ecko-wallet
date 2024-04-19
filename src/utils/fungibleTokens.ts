import { LocalActivity } from 'src/components/Activities/types';
import { IFungibleToken } from 'src/pages/ImportToken';

export const inferTokenFromContractAddress = (contractAddress: string, tokens: IFungibleToken[]) => (
  tokens.find((t) => t.contractAddress === contractAddress)
);

export const inferTokenFromSymbol = (symbol: string, tokens: IFungibleToken[]) => (
  tokens.find((t) => t.symbol === symbol)
);

export const inferTokenFromLocalActivity = (localActivity: LocalActivity, tokens: IFungibleToken[]) => {
  if (localActivity.module) {
    return inferTokenFromContractAddress(localActivity.module, tokens);
  }

  return inferTokenFromSymbol(localActivity.symbol, tokens);
};
