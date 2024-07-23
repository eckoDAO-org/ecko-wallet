import { IFungibleToken, IFungibleTokensByNetwork, LOCAL_DEFAULT_FUNGIBLE_TOKENS, LOCAL_KEY_FUNGIBLE_TOKENS } from 'src/pages/ImportToken';
import useLocalStorage from 'src/hooks/useLocalStorage';
import { KNOWN_TOKENS } from 'src/utils/constant';
import { useAppSelector } from 'src/stores/hooks';
import { getSelectedNetwork } from 'src/stores/slices/extensions';
import { useMemo } from 'react';

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
  const selectedNetwork = useAppSelector(getSelectedNetwork);
  const [allLocalFungibleTokens] = useLocalStorage<IFungibleTokensByNetwork>(LOCAL_KEY_FUNGIBLE_TOKENS, LOCAL_DEFAULT_FUNGIBLE_TOKENS);

  const fungibleTokensList = useMemo(() => {
    const localFungibleTokens = allLocalFungibleTokens?.[selectedNetwork.networkId];

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
  }, [allLocalFungibleTokens, selectedNetwork]);

  return fungibleTokensList;
};
