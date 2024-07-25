import { useState, useEffect } from 'react';
import Pact from 'pact-lang-api';
import { useAppDispatch, useAppSelector } from 'src/stores/hooks';
import { selectActivitiesByAccountAndNetwork, selectPendingCrossChainActivities, upsertActivities } from 'src/stores/slices/activities';
import { getSelectedNetwork } from 'src/stores/slices/extensions';
import { getAccount } from 'src/stores/slices/wallet';
import { getApiUrl } from 'src/utils/chainweb';
import PopupDetailTransaction from 'src/pages/Wallet/views/PopupDetailTransaction';
import ActivitiyList from './List';
import { LocalActivity } from './types';

const supportedTransactions = ['TRANSFER', 'SWAP'];

const Activities = () => {
  const dispatch = useAppDispatch();
  const account = useAppSelector(getAccount);
  const selectedNetwork = useAppSelector(getSelectedNetwork);
  const activities = useAppSelector((state) => selectActivitiesByAccountAndNetwork(state, account, selectedNetwork.networkId));
  const pendingCrossChainActivities = useAppSelector(selectPendingCrossChainActivities);
  const pendingCrossChainRequestKeys = pendingCrossChainActivities.map((a) => a.requestKey);
  const [selectedActivity, setSelectedActivity] = useState<LocalActivity | null>(null);

  useEffect(() => {
    const promises = activities
      .filter((a) => a.status === 'pending' && a.requestKey !== null)
      .map((a) =>
        Pact.fetch.poll({ requestKeys: [a.requestKey] }, getApiUrl(selectedNetwork.url, selectedNetwork.networkId, a.senderChainId.toString())),
      );

    Promise
      .all(promises)
      .then((pollResArray: any[] = []) => {
        const newActivities = pollResArray
          .map((pollRes) => {
            const reqKey = Object.keys(pollRes)[0];

            if (pollRes[reqKey] && pollRes[reqKey]?.result?.status !== 'success') {
              return null;
            }

            const activity = activities.find((a) => a.requestKey === reqKey);

            if (!activity) {
              return null;
            }

            return {
              ...activity,
              ...pollRes[reqKey],
              status: 'success',
            } as LocalActivity;
          })
          .filter((a) => a !== null) as LocalActivity[];

        dispatch(upsertActivities(newActivities));
      })
      .catch(() => {});
  }, [activities, dispatch, selectedNetwork]);

  const filteredActivities = activities.filter(
    (activity) => supportedTransactions.includes(activity.transactionType),
  );

  return (
    <>
      <ActivitiyList
        activities={filteredActivities}
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
    </>
  );
};

export default Activities;
