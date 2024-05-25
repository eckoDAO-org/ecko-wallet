/* eslint-disable no-restricted-syntax */
import { useState, createContext, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import useLocalStorage from 'src/hooks/useLocalStorage';
import { useInterval } from 'src/hooks/useInterval';
import { IFungibleToken, IFungibleTokensByNetwork, LOCAL_DEFAULT_FUNGIBLE_TOKENS, LOCAL_KEY_FUNGIBLE_TOKENS } from 'src/pages/ImportToken';
import { useCurrentWallet } from 'src/stores/slices/wallet/hooks';
import { extractDecimal, fetchListLocal, fetchTokenList, MAINNET_NETWORK_ID } from 'src/utils/chainweb';
import { KADDEX_ANALYTICS_API } from 'src/utils/config';
import { CHAIN_COUNT } from 'src/utils/constant';
import { toast } from 'react-toastify';
import Toast from 'src/components/Toast/Toast';
import { SettingsContext } from './SettingsContext';

interface TokenBalance {
  [contractAddress: string]: number;
}

interface AccountBalanceProps {
  [account: string]: TokenBalance[];
}

interface AccountBalanceContextProps {
  selectedAccountBalance?: TokenBalance[];
  allAccountsBalance?: AccountBalanceProps;
  allAccountsBalanceUsd?: AccountBalanceProps;
  usdPrices: TokenBalance;
  isLoadingBalances: boolean;
}

const SEPARATOR = '___';

export const AccountBalanceContext = createContext<AccountBalanceContextProps>({
  selectedAccountBalance: undefined,
  allAccountsBalance: {},
  usdPrices: {},
  isLoadingBalances: false,
});

export const AccountBalanceProvider = ({ children }: any) => {
  const [isLoadingBalances, setIsLoadingBalances] = useState<boolean>(false);
  const [accountsBalanceState, setAccountBalanceState] = useState<AccountBalanceProps>();
  const [usdPrices, setUsdPrices] = useState<TokenBalance>({});

  const {
    wallet: { wallets },
    extensions: { selectedNetwork },
  } = useSelector((state) => state);

  const networkId = selectedNetwork?.networkId;

  const [fungibleTokens] = useLocalStorage<IFungibleTokensByNetwork>(LOCAL_KEY_FUNGIBLE_TOKENS, LOCAL_DEFAULT_FUNGIBLE_TOKENS);
  const fungibleTokensByNetwork = (fungibleTokens && fungibleTokens[networkId]) || [];

  const { account: selectedAccount } = useCurrentWallet();
  const { data: settings } = useContext(SettingsContext);

  const txSettings = settings?.txSettings;

  const uniqueWallets = wallets.map((w) => w.account).filter((value, index, self) => self.indexOf(value) === index);
  const sortedWallets = uniqueWallets.sort((a, b) => b.indexOf(selectedAccount));

  const fetchGroupedBalances = async (allChainTokens) => {
    let hasGasLimitError = false;
    const promiseList: any[] = [];
    for (let i = 0; i < CHAIN_COUNT; i += 1) {
      const availableChainTokens = allChainTokens && allChainTokens[i];
      let filteredAvailableFt = fungibleTokensByNetwork?.filter((t) => availableChainTokens?.includes(t.contractAddress));
      for (const localToken of LOCAL_DEFAULT_FUNGIBLE_TOKENS[networkId]) {
        if (!filteredAvailableFt?.find((t) => t.contractAddress === localToken.contractAddress)) {
          filteredAvailableFt?.push(localToken);
        }
      }

      if (i === 2) {
        filteredAvailableFt = [...(filteredAvailableFt || []), { contractAddress: 'kaddex.skdx', symbol: 'sKDX' }];
      }
      const pactCode = `
        (
          let* (
                ${sortedWallets
                  .map(
                    (account, j) => `
                  (coin_balance_${j} (try 0.0 (coin.get-balance "${account}")))
                  ${filteredAvailableFt
                    ?.map((ft) => `(${ft.contractAddress.replace(/\./g, '')}_${j} (try 0.0 (${ft.contractAddress}.get-balance "${account}")))`)
                    .join('\n')}`,
                  )
                  .join('\n')}
              )
                {${sortedWallets.map(
                  (acc, j) => `
                  "coin${SEPARATOR}${j}": coin_balance_${j}, ${filteredAvailableFt?.map(
                    (ft) => `"${ft.contractAddress}${SEPARATOR}${j}": ${ft.contractAddress.replace(/\./g, '')}_${j}`,
                  )}
                  `,
                )}}
        )`;
      const promise = fetchListLocal(pactCode, selectedNetwork.url, selectedNetwork.networkId, i.toString(), txSettings?.gasPrice, 300000);
      promiseList.push(promise);
    }
    return Promise.all(promiseList).then((allRes) => {
      const balanceProps = {};
      allRes.forEach((chainBalance, chainId) => {
        if (chainBalance?.result?.data) {
          for (const key of Object.keys(chainBalance?.result?.data)) {
            const splitted = key.split(SEPARATOR);
            const contractAddress = splitted[0];
            const accountIndex = splitted[1];
            const account = sortedWallets[accountIndex];
            balanceProps[account] = [...(balanceProps[account] || [])];
            balanceProps[account][chainId] = {
              ...(balanceProps[account][chainId] || []),
              [contractAddress]: extractDecimal(chainBalance?.result?.data[key]),
            };
          }
        } else if (chainBalance?.result?.status === 'failure') {
          // check for gasLimit error
          const regex = /Gas limit \((\d+)\) exceeded: (\d+)/;
          if (chainBalance?.result?.error?.message?.match(regex)) {
            if (!hasGasLimitError) {
              hasGasLimitError = true;
              toast.error(<Toast type="fail" content="Please try to increase GAS LIMIT in your settings" />);
            }
          }
        }
      });
      setAccountBalanceState(balanceProps);
      setIsLoadingBalances(false);
    });
  };

  const fetchSinglesBalances = async () => {
    const fts: IFungibleToken[] = [{ contractAddress: 'coin', symbol: 'KDA' }, ...fungibleTokensByNetwork];
    const chainBalance: TokenBalance[] = [];
    for (let i = 0; i < CHAIN_COUNT; i += 1) {
      const tokenBalance: TokenBalance = {};
      for (const ft of fts) {
        const pactCode = `(${ft.contractAddress}.get-balance "${selectedAccount}")`;
        // eslint-disable-next-line no-await-in-loop
        const pactResponse = await fetchListLocal(
          pactCode,
          selectedNetwork.url,
          selectedNetwork.networkId,
          i.toString(),
          txSettings?.gasPrice,
          txSettings?.gasLimit,
        );
        tokenBalance[ft.contractAddress] = extractDecimal(pactResponse?.result?.data) || 0;
      }
      chainBalance.push(tokenBalance);
    }

    setAccountBalanceState((prev) => ({
      ...prev,
      [selectedAccount]: chainBalance,
    }));
    setIsLoadingBalances(false);
  };

  const updateUsdPrices = () => {
    const promises: Promise<Response>[] = [
      fetch(
        `${KADDEX_ANALYTICS_API}/candles?dateStart=${moment().subtract(3, 'days').format('YYYY-MM-DD')}&dateEnd=${moment().format(
          'YYYY-MM-DD',
        )}&currency=USDT&asset=KDA`,
      ),
    ];
    fungibleTokensByNetwork?.forEach((tok) => {
      promises.push(
        fetch(
          `${KADDEX_ANALYTICS_API}/candles?dateStart=${moment().subtract(3, 'days').format('YYYY-MM-DD')}&dateEnd=${moment().format(
            'YYYY-MM-DD',
          )}&currency=coin&asset=${tok?.contractAddress}`,
        ),
      );
    });
    Promise.all(promises)
      .then((results) => Promise.all(results.map((r) => r.json())))
      .then((candlesData) => {
        const usdPricesData = {};
        candlesData.forEach((candleAnalytics) => {
          if (candleAnalytics.length) {
            const lastCandle = candleAnalytics?.pop();
            const asset = lastCandle?.pairName?.split('/')[0];
            usdPricesData[asset?.toLowerCase() === 'kda' ? 'coin' : asset?.toLowerCase()] =
              lastCandle?.usdPrice?.close || lastCandle?.price?.close || 0;
          }
        });
        setUsdPrices(usdPricesData);
      });
  };

  const updateAllBalances = async () => {
    if (uniqueWallets.length) {
      setIsLoadingBalances(true);
      if (selectedNetwork.networkId === MAINNET_NETWORK_ID) {
        const tokens = await fetchTokenList();
        fetchGroupedBalances(tokens);
      } else {
        fetchSinglesBalances();
      }
    }
  };

  const convertToUsd = (balanceState: AccountBalanceProps | undefined, prices: TokenBalance) => {
    const result = {};
    if (!balanceState) {
      return result;
    }
    for (const account in balanceState) {
      if (Object.prototype.hasOwnProperty.call(balanceState, account)) {
        result[account] = balanceState[account].map((balance) => {
          const usdBalance = {};
          for (const token in balance) {
            if (Object.prototype.hasOwnProperty.call(balance, token)) {
              const priceKey = token.toLowerCase();
              const price = prices[priceKey] || 0;
              usdBalance[token] = (balance[token] || 0) * price;
            }
          }
          return usdBalance;
        });
      }
    }

    return result;
  };

  const refreshBalances = async () => {
    updateUsdPrices();
    updateAllBalances();
  };

  useInterval(() => {
    refreshBalances();
  }, 120000);

  useEffect(() => {
    refreshBalances();
  }, [sortedWallets?.length, fungibleTokensByNetwork?.length, networkId, selectedAccount]);

  return (
    <AccountBalanceContext.Provider
      value={{
        isLoadingBalances,
        selectedAccountBalance: accountsBalanceState && accountsBalanceState[selectedAccount],
        allAccountsBalance: accountsBalanceState,
        allAccountsBalanceUsd: convertToUsd(accountsBalanceState, usdPrices),
        usdPrices,
      }}
    >
      {children}
    </AccountBalanceContext.Provider>
  );
};

export const AccountBalanceConsumer = AccountBalanceContext.Consumer;

export function useAccountBalanceContext() {
  return useContext(AccountBalanceContext);
}
