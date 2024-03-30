import { useCallback, useEffect } from 'react';
import { IncomingTransaction, useIncomingTransactions } from 'src/hooks/transactions';
import { LocalActivity } from 'src/pages/Wallet/views/Activities';
import { useAppSelector } from 'src/stores/hooks';
import { getAccount } from 'src/stores/slices/wallet';
import { KNOWN_TOKENS } from 'src/utils/constant';
import { addLocalActivity, getLocalActivities } from 'src/utils/storage';

const supportedTransactions = ['TRANSFER'];

const inferToken = (module: string) => {
  const token = KNOWN_TOKENS[module];
  const symbol: string = token?.symbol?.toUpperCase() || '';

  return symbol.length ? symbol : module.split('.').pop();
};

const transactionToActivity = (transaction: IncomingTransaction) => {
  if (transaction.direction !== 'IN') {
    return undefined;
  }

  if (!supportedTransactions.includes(transaction.transactionType)) {
    return undefined;
  }

  if (transaction.code.includes('coin.transfer-crosschain')) {
    return undefined;
  }

  const date = new Date(transaction.creationtime);

  return {
    amount: transaction.amount,
    createdTime: date.toString(),
    direction: transaction.direction,
    gas: Number(transaction.gas),
    gasPrice: transaction.gasprice,
    receiver: transaction.to_acct,
    receiverChainId: transaction.chainid,
    requestKey: transaction.requestkey,
    sender: transaction.from_acct,
    senderChainId: transaction.chainid,
    status: transaction.status.toLowerCase(),
    symbol: inferToken(transaction.modulename),

    result: {
      status: transaction.status.toLowerCase(),
    },

    metaData: {
      blockTime: date.getTime() * 1000,
    },
  };
};

const MainnetIncomingTransactionsImporter = () => {
  const { data: transactions } = useIncomingTransactions();
  const account = useAppSelector(getAccount);

  const processActivities = useCallback(async (activities: LocalActivity[]) => {
    const activitiesByRequestKey = activities.reduce((acc, activity) => {
      acc[activity.requestKey] = activity;
      return acc;
    }, {} as Record<string, LocalActivity>);

    for (let i = 0; i < transactions.length; i += 1) {
      const transaction = transactions[i];
      const activity = transactionToActivity(transaction);

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
      () => {},
    );
  }, [transactions, account, processActivities]);

  return null;
};

export default MainnetIncomingTransactionsImporter;
