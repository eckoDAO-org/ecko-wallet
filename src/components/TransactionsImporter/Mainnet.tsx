import { useCallback, useEffect } from 'react';
import { Transaction, useTransactions } from 'src/hooks/transactions';
import { IFungibleToken } from 'src/pages/ImportToken';
import { LocalActivity } from 'src/components/Activities';
import { useAppSelector } from 'src/stores/hooks';
import { getAccount } from 'src/stores/slices/wallet';
import { useFungibleTokensList } from 'src/hooks/fungibleTokens';
import { addLocalActivity, getLocalActivities } from 'src/utils/storage';

const supportedTransactions = ['TRANSFER'/* , 'SWAP' */];

const transactionToActivity = (transaction: Transaction, tokens: IFungibleToken[]) => {
  if (!supportedTransactions.includes(transaction.transactionType)) {
    return undefined;
  }

  const date = new Date(transaction.creationtime);
  const inferredToken = tokens.find((t) => t.contractAddress === transaction.modulename);

  return {
    amount: transaction.amount,
    createdTime: date.toString(),
    direction: transaction.direction,
    gas: Number(transaction.gas),
    gasPrice: transaction.gasprice,
    receiver: transaction.to_acct,
    receiverChainId: transaction.targetChainId || transaction.chainid,
    requestKey: transaction.requestkey,
    sender: transaction.from_acct,
    senderChainId: transaction.chainid,
    status: transaction.status.toLowerCase(),
    symbol: inferredToken?.symbol || transaction.modulename,
    module: transaction.modulename,

    result: {
      status: transaction.status.toLowerCase(),
    },

    metaData: {
      blockTime: date.getTime() * 1000,
    },
  };
};

const MainnetTransactionsImporter = () => {
  const { data: transactions } = useTransactions();
  const account = useAppSelector(getAccount);
  const tokens = useFungibleTokensList();

  const processActivities = useCallback(async (activities: LocalActivity[]) => {
    const activitiesByRequestKey = activities.reduce((acc, activity) => {
      acc[activity.requestKey] = activity;
      return acc;
    }, {} as Record<string, LocalActivity>);

    for (let i = 0; i < transactions.length; i += 1) {
      const transaction = transactions[i];
      const activity = transactionToActivity(transaction, tokens);

      if (activity && !(activitiesByRequestKey[activity.requestKey])) {
        await addLocalActivity('mainnet01', account, activity);
      }
    }
  }, [transactions]);

  useEffect(() => {
    getLocalActivities(
      'mainnet01',
      account,
      processActivities,
      () => { processActivities([]); },
    );
  }, [transactions, account, processActivities]);

  return null;
};

export default MainnetTransactionsImporter;
