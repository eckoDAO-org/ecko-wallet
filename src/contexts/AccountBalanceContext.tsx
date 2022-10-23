import { useState, createContext, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import useLocalStorage from 'src/hooks/useLocalStorage';
import { IFungibleToken, LOCAL_KEY_FUNGIBLE_TOKENS } from 'src/pages/ImportToken';
import { useCurrentWallet } from 'src/stores/wallet/hooks';
import { fetchListLocal, fetchTokenList } from 'src/utils/chainweb';
import { KADDEX_ANALYTICS_API } from 'src/utils/config';
import { CHAIN_COUNT } from 'src/utils/constant';
import { TxSettingsContext } from './TxSettingsContext';

interface TokenBalance {
  [contractAddress: string]: number;
}

interface AccountBalanceProps {
  [account: string]: TokenBalance[];
}

interface AccountBalanceContextProps {
  selectedAccountBalance?: TokenBalance[];
  allAccountsBalance?: AccountBalanceProps;
  usdPrices: TokenBalance;
  isLoadingBalances: boolean;
}

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

  const [fungibleTokens] = useLocalStorage<IFungibleToken[]>(LOCAL_KEY_FUNGIBLE_TOKENS, [{ contractAddress: 'kaddex.kdx', symbol: 'kdx' }]);

  const { account: selectedAccount } = useCurrentWallet();
  const { data: txSettings } = useContext(TxSettingsContext);

  const uniqueWallets = wallets.map((w) => w.account).filter((value, index, self) => self.indexOf(value) === index);

  const fetchAllBalances = async (account: string) => {
    const promiseList: any[] = [];
    // TODO: fetch token list from BE
    const allChainAvailableTokens = fetchTokenList();
    for (let i = 0; i < CHAIN_COUNT; i += 1) {
      const availableChainTokens = allChainAvailableTokens[i];
      const filteredAvailableFt = fungibleTokens?.filter((t) => availableChainTokens.includes(t.contractAddress));
      const pactCode = `
      (
        let* (
              (coin-balance (try 0.0 (coin.get-balance "${account}")))
              ${filteredAvailableFt
                ?.map((ft) => `(${ft.contractAddress.replace(/\./g, '')} (try 0.0 (${ft.contractAddress}.get-balance "${account}")))`)
                .join('\n')}              
             )
        {"coin": coin-balance, ${filteredAvailableFt?.map((ft) => `"${ft.contractAddress}": ${ft.contractAddress.replace(/\./g, '')}`)}}
      )`;
      const promise = fetchListLocal(
        pactCode,
        selectedNetwork.url,
        selectedNetwork.networkId,
        i.toString(),
        txSettings?.gasPrice,
        txSettings?.gasLimit,
      );
      promiseList.push(promise);
    }
    return Promise.all(promiseList).then((allRes) => {
      setAccountBalanceState((prev) => ({
        ...prev,
        [account]: allRes.map((chainBalance) => chainBalance?.result?.data),
      }));
    });
  };

  const updateUsdPrices = () => {
    const promises: Promise<Response>[] = [
      fetch(
        `${KADDEX_ANALYTICS_API}/candles?dateStart=${moment().subtract(3, 'days').format('YYYY-MM-DD')}&dateEnd=${moment().format(
          'YYYY-MM-DD',
        )}&currency=USDT&asset=KDA`,
      ),
    ];
    fungibleTokens?.forEach((tok) => {
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

  useEffect(() => {
    updateUsdPrices();
  }, [fungibleTokens]);

  useEffect(() => {
    if (uniqueWallets.length) {
      setIsLoadingBalances(true);
      const sortedWallets = uniqueWallets.sort((a, b) => b.indexOf(selectedAccount));
      const promises: any = [];
      for (let i = 0; i < sortedWallets.length; i += 1) {
        promises.push(fetchAllBalances(sortedWallets[i]));
      }
      Promise.all(promises).then(() => setIsLoadingBalances(false));
    }
  }, [selectedAccount, fungibleTokens?.length]);

  return (
    <AccountBalanceContext.Provider
      value={{
        isLoadingBalances,
        selectedAccountBalance: accountsBalanceState && accountsBalanceState[selectedAccount],
        allAccountsBalance: accountsBalanceState,
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
