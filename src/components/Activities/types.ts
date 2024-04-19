export type LocalActivityStatus = 'success' | 'error' | 'pending';
export type LocalActivityDirection = 'IN' | 'OUT';

export interface LocalActivity {
  aliasName?: string;
  amount: string;
  continuation?: any;
  createdTime: string;
  events?: Event[];
  gas?: number;
  gasPrice: number;
  logs?: string;
  metaData?: any;
  receiver: string;
  receiverChainId: string;
  reqKey?: string;
  requestKey: string;
  result?: any;
  sender: string;
  senderChainId: string;
  status: LocalActivityStatus;
  domain?: string;
  symbol: string;
  txId?: number;
  direction?: LocalActivityDirection;
  module: string;
  transactionType: 'TRANSFER' | 'SWAP' | 'STAKE' | 'UNSTAKE' | 'CLAIM';
}
