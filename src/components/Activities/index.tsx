import { useState, useEffect } from 'react';
import Pact from 'pact-lang-api';
import { getApiUrl } from 'src/utils/chainweb';
import Spinner from 'src/components/Spinner';
import { useAppThemeContext } from 'src/contexts/AppThemeContext';
import { getLocalActivities, getPendingCrossChainRequestKey, updateLocalActivity } from 'src/utils/storage';
import { useAppSelector } from 'src/stores/hooks';
import { getAccount, getChainId } from 'src/stores/slices/wallet';
import { getSelectedNetwork } from 'src/stores/slices/extensions';
import PopupDetailTransaction from 'src/pages/Wallet/views/PopupDetailTransaction';
import { LocalActivity } from './types';
import ActivitiyList from './List';

const Activities = () => {
  const [pendingCrossChainRequestKeys, setPendingCrossChainRequestKeys] = useState<string[]>([]);
  const [accountActivities, setAccountActivities] = useState<LocalActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<LocalActivity | null>(null);

  const account = useAppSelector(getAccount);
  const chainId = useAppSelector(getChainId);
  const selectedNetwork = useAppSelector(getSelectedNetwork);
  const { theme } = useAppThemeContext();

  const [isLoadData, setIsLoadData] = useState(true);

  useEffect(() => {
    getLocalActivities(
      selectedNetwork.networkId,
      account,
      (activities: LocalActivity[]) => {
        setIsLoadData(false);
        setAccountActivities(activities);

        const promises = activities
          .filter((a) => a.status === 'pending' && a.requestKey !== null)
          .map((a) =>
            Pact.fetch.poll({ requestKeys: [a.requestKey] }, getApiUrl(selectedNetwork.url, selectedNetwork.networkId, a.senderChainId.toString())),
          );

        Promise.all(promises)
          .then((pollResArray: any[]) => {
            pollResArray?.forEach((pollRes) => {
              const reqKey = Object.keys(pollRes)[0];
              if (pollRes[reqKey] && pollRes[reqKey]?.result?.status === 'success') {
                const activity = activities.find((a) => a.requestKey === reqKey);
                if (activity) {
                  updateLocalActivity(selectedNetwork.networkId, account, {
                    ...activity,
                    ...pollRes[reqKey],
                    status: 'success',
                  });
                }
              }
            });
          })
          .catch(() => {});
      },

      () => {
        setIsLoadData(false);
      },
    );

    getPendingCrossChainRequestKey().then((pendingTx) => {
      if (!pendingTx) return;
      setPendingCrossChainRequestKeys(pendingTx.map((tx) => tx.requestKey));
    });
  }, [account, chainId, selectedNetwork.networkId]);

  if (isLoadData) {
    return <Spinner size={10} color={theme.text?.primary} weight={2} />;
  }

  return (
    <div>
      <ActivitiyList
        activities={accountActivities}
        pendingCrossChainRequestKeys={pendingCrossChainRequestKeys}
        openActivityDetail={setSelectedActivity}
      />
      {selectedActivity && (
        <PopupDetailTransaction
          isFinishing={pendingCrossChainRequestKeys.includes(selectedActivity.requestKey)}
          selectedNetwork={selectedNetwork}
          activityDetails={selectedActivity}
          isOpen={selectedActivity !== null}
          title="Transaction Details"
          onCloseModal={() => setSelectedActivity(null)}
        />
      )}
    </div>
  );
};

export default Activities;
