import { useEffect, useState } from 'react';
import { useFungibleTokensList } from 'src/hooks/fungibleTokens';
import { Transaction, useTransactions } from 'src/hooks/transactions';
import { useAppDispatch, useAppSelector } from 'src/stores/hooks';
import { selectActivitiesByAccountAndNetwork, upsertActivities } from 'src/stores/slices/activities';
import { getAccount } from 'src/stores/slices/wallet';
import { IFungibleToken } from 'src/pages/ImportToken';
import { LocalActivity } from 'src/components/Activities/types';
import { generateActivityWithId } from 'src/components/Activities/utils';

const transactionToActivity = (transaction: Transaction, tokens: IFungibleToken[], accountId: string) => {
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
    networkId: 'mainnet01',
    accountId,

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
}

const MainnetTransactionsImporter = ({
  limit = 5,
}: MainnetTransactionsImporterProps) => {
  const [skip, setSkip] = useState(0);
  const { data: fetchedTransactions, isLoading } = useTransactions(limit, skip);
  const account = useAppSelector(getAccount);
  const tokens = useFungibleTokensList();
  const localActivities = useAppSelector((state) => selectActivitiesByAccountAndNetwork(state, account, 'mainnet01'));
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!fetchedTransactions.length || isLoading) {
      return;
    }

    const newActivities = fetchedTransactions
      .map((transaction) => transactionToActivity(transaction, tokens, account))
      .filter((activity) => activity !== undefined);
      dispatch(upsertActivities(newActivities));
  }, [fetchedTransactions, tokens, account, isLoading, dispatch]);

  useEffect(() => {
    if (!fetchedTransactions.length || fetchedTransactions.length < limit || isLoading) {
      return;
    }

    const lastActivity = transactionToActivity(fetchedTransactions[limit - 1], tokens, account);
    const syncReached = localActivities.find((activity) => (
      (activity.status !== 'pending') && (activity.id === lastActivity.id)
    ));

    if (syncReached) {
      return;
    }

    setSkip((prevSkip) => prevSkip + limit);
  }, [fetchedTransactions, tokens, account, localActivities, limit, isLoading]);

  return null;
};

export default MainnetTransactionsImporter;
