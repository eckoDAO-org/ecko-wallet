import { IFungibleToken, LOCAL_KEY_FUNGIBLE_TOKENS } from 'src/pages/ImportToken';
import useLocalStorage from 'src/hooks/useLocalStorage';
import { KNOWN_TOKENS } from 'src/utils/constant';

const coinToken: IFungibleToken = {
  contractAddress: 'coin',
  symbol: 'KDA',
};

type TKnownToken = Record<string, {
  symbol: string,
  image: unknown,
  coingeckoId?: string,
}>;

const knownTokens = Object.keys(KNOWN_TOKENS as TKnownToken).map(
  (contractAddress) => ({
    contractAddress,
    symbol: KNOWN_TOKENS[contractAddress].symbol.toUpperCase(),
  } as IFungibleToken),
);

export const useFungibleTokensList = () => {
  const [localFungibleTokens] = useLocalStorage<IFungibleToken[]>(LOCAL_KEY_FUNGIBLE_TOKENS, []);
  const localFungibleTokensParsed = (localFungibleTokens || []).map((token) => ({
    contractAddress: token.contractAddress,
    symbol: token.symbol.toUpperCase(),
  }));

  const allTokens = [
    coinToken,
    ...localFungibleTokensParsed,
    ...knownTokens,
  ];

  const withoutDuplicates = allTokens.reduce((acc, token) => {
    if (!acc[token.contractAddress]) {
      acc[token.contractAddress] = token;
    }

    return acc;
  }, {} as Record<string, IFungibleToken>);

  return Object.values(withoutDuplicates);
};
