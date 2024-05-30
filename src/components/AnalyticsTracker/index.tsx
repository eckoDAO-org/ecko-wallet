import { useEffect, useRef } from 'react';
import { useTrackAccountBalance } from 'src/hooks/analytics';
import { useAppDispatch, useAppSelector } from 'src/stores/hooks';
import { addTrackedAddress, canTrackPortfolio, getTrackedAddresses } from 'src/stores/slices/analytics';
import { getWallets } from 'src/stores/slices/wallet';

const AnalyticsTracker = () => {
  const wallets = useAppSelector(getWallets);
  const trackedAddresses = useAppSelector(getTrackedAddresses());
  const trackPortfolio = useAppSelector(canTrackPortfolio());
  const trackAccountBalance = useTrackAccountBalance();
  const dispatch = useAppDispatch();
  const loading = useRef(false);

  const allAccounts = wallets.map((wallet) => wallet.account);
  const allAcountsAreTracked = allAccounts.every((account) => trackedAddresses.includes(account));

  useEffect(() => {
    if (!trackPortfolio || allAcountsAreTracked || loading.current) return;

    loading.current = true;
    const promises: Promise<boolean>[] = [];

    allAccounts.forEach((account) => {
      if (trackedAddresses.includes(account)) return;

      try {
        promises.push(
          trackAccountBalance(account).then((tracked) => {
            if (tracked) {
              dispatch(addTrackedAddress(account));
            }

            return tracked;
          }),
        );
      } catch (reason: unknown) {
        // eslint-disable-next-line no-console
        console.error('Failed to track account balance', reason);
      }
    });

    Promise.all(promises).then(() => {
      loading.current = false;
    });
  }, [trackPortfolio, allAcountsAreTracked]);

  return null;
};

export default AnalyticsTracker;
