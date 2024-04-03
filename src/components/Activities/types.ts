export interface LocalActivity {
  aliasName: null | string;
  amount: string;
  continuation: any;
  createdTime: string;
  events: Event[];
  gas: number;
  gasPrice: number;
  logs: string;
  metaData: any;
  receiver: string;
  receiverChainId: string;
  reqKey: string;
  requestKey: string;
  result: any;
  sender: string;
  senderChainId: string;
  status: string;
  domain?: string;
  symbol: string;
  txId: number;
  direction?: 'IN' | 'OUT';
  module?: string;
}
