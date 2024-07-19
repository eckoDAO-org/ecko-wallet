import { useCallback, useEffect } from 'react';
import { isEqual } from 'lodash';
import { Transaction, useTransactions } from 'src/hooks/transactions';
import { IFungibleToken } from 'src/pages/ImportToken';
import { LocalActivity } from 'src/components/Activities/types';
import { useAppSelector } from 'src/stores/hooks';
import { getAccount } from 'src/stores/slices/wallet';
import { useFungibleTokensList } from 'src/hooks/fungibleTokens';
import { getLocalActivities, setLocalActivities } from 'src/utils/storage';
import { generateActivityId, generateActivityWithId } from '../Activities/utils';

const supportedTransactions = ['TRANSFER', 'SWAP'];

const transactionToActivity = (transaction: Transaction, tokens: IFungibleToken[]) => {
  if (!supportedTransactions.includes(transaction.transactionType)) {
    return undefined;
  }

  const date = new Date(transaction.creationtime);
  const inferredToken = tokens.find((t) => t.contractAddress === transaction.modulename);
  const receiver = transaction.transactionType === 'SWAP' ? 'Swap' : transaction.to_acct;

  const activity: LocalActivity = generateActivityWithId({
    amount: transaction.amount,
    createdTime: date.toString(),
    direction: transaction.direction,
    gas: Number(transaction.gas),
    gasPrice: transaction.gasprice,
    receiver,
    receiverChainId: transaction.targetChainId || transaction.chainid,
    requestKey: transaction.requestkey,
    sender: transaction.from_acct,
    senderChainId: transaction.chainid,
    status: transaction.status.toLowerCase() as 'success' | 'error',
    symbol: inferredToken?.symbol || transaction.modulename,
    module: transaction.modulename,
    ticker: transaction.ticker,
    transactionType: transaction.transactionType,

    result: {
      status: transaction.status.toLowerCase(),
    },

    metaData: {
      blockTime: date.getTime() * 1000,
    },
  });

  return activity;
};

interface MainnetTransactionsImporterProps {
  limit?: number;
  skip?: number;
}

const MainnetTransactionsImporter = ({
  limit = 50,
  skip = 0,
}: MainnetTransactionsImporterProps) => {
  const { data: transactions } = useTransactions(limit, skip);
  const account = useAppSelector(getAccount);
  const tokens = useFungibleTokensList();

  const processActivities = useCallback(
    async (activities: LocalActivity[]) => {
      if (!transactions.length) {
        return;
      }

      const newActivities: Record<string, LocalActivity> = {};

      for (let i = 0; i < transactions.length; i += 1) {
        const transaction = transactions[i];
        const activity = transactionToActivity(transaction, tokens);

        if (activity) {
          newActivities[activity.id] = activity;
        }
      }

      const updatedActivities = activities
        .filter((txLoc) => txLoc.status === 'pending')
        .map((activity) => {
          const activityId = activity.id || generateActivityId(activity);

          // New activity already exists in local: update it
          if (newActivities[activityId]) {
            return {
              ...activity,
              ...newActivities[activity.id],
              id: activityId,
            };
          }

          // Activity doesn't have id: generate it
          if (!activity.id) {
            return {
              ...activity,
              id: activityId,
            };
          }

          // Activity has id and it's not in new activities: keep it as is
          return activity;
        });

      // Add new activities that are not already in the list filtering duplicates
      const updatedActivitiesWithNew = updatedActivities.concat(
        Object.values(newActivities).filter((activity) => !updatedActivities.find((a) => a.id === activity.id)),
      );

      if (!isEqual(updatedActivitiesWithNew, activities)) {
        await setLocalActivities('mainnet01', account, updatedActivitiesWithNew);
      }
    },
    [transactions],
  );

  useEffect(() => {
    getLocalActivities('mainnet01', account, processActivities, () => {
      processActivities([]);
    });
  }, [transactions, account, processActivities]);

  return null;
};

export default MainnetTransactionsImporter;
