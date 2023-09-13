import { createContext, useContext, useState } from 'react';
import { listen } from '@ledgerhq/logs';
import KadenaLedger, { BuildTransactionResult, SignTransactionResult, TransferCrossChainTxParams, TransferTxParams } from 'hw-app-kda';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';

export const DEFAULT_BIP32_PATH = "m/44'/626'/0'/0/0";

interface KadenaLedgerData {
  error: string;
  getLedger: () => Promise<KadenaLedger | undefined>;
  getPublicKey: () => Promise<string | undefined>;
  signHash: (hash: string) => Promise<SignTransactionResult | undefined>;
  sendTransaction: (params: TransferTxParams) => Promise<BuildTransactionResult | undefined>;
  sendCrossChainTransaction: (params: TransferCrossChainTxParams) => Promise<BuildTransactionResult | undefined>;
}

export const LedgerContext = createContext<KadenaLedgerData>({
  error: '',
  getLedger: async () => undefined,
  getPublicKey: async () => undefined,
  signHash: async () => undefined,
  sendTransaction: async () => undefined,
  sendCrossChainTransaction: async () => undefined,
});

export const LedgerProvider = ({ children }: any) => {
  const [kadenaLedger, setKadenaLedger] = useState<KadenaLedger | undefined>();
  console.log(`🚀 !!! ~ kadenaLedger:`, kadenaLedger);
  const [error, setError] = useState<string>('');

  const bufferToHex = (buffer) => [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('');

  const getLedger = async (): Promise<KadenaLedger | undefined> => {
    if (!kadenaLedger) {
      try {
        const transport = await TransportWebHID.create();
        listen((log) => console.log('ledger log -->', log));
        const kadena = new KadenaLedger(transport);
        setKadenaLedger(kadena);
        return kadena;
      } catch (err) {
        console.log(`Ledger ERROR:`, err);
        setError(`Unable to get ledger: ${err}`);
      }
    }
    return kadenaLedger;
  };

  const getPublicKey = async (): Promise<string | undefined> => {
    const ledger = await getLedger();
    const publicKeyResponse = (await ledger?.getPublicKey(DEFAULT_BIP32_PATH))?.publicKey;
    return publicKeyResponse ? bufferToHex(publicKeyResponse) : undefined;
  };

  const signHash = async (hash: string): Promise<SignTransactionResult | undefined> => {
    const ledger = await getLedger();
    return ledger?.signHash(DEFAULT_BIP32_PATH, hash);
  };

  const sendTransaction = async (params: TransferTxParams): Promise<BuildTransactionResult | undefined> =>
    (await getLedger())?.signTransferCreateTx({ path: DEFAULT_BIP32_PATH, ...params });

  const sendCrossChainTransaction = async (params: TransferCrossChainTxParams): Promise<BuildTransactionResult | undefined> =>
    (await getLedger())?.signTransferCrossChainTx({ path: DEFAULT_BIP32_PATH, ...params });

  return (
    <LedgerContext.Provider
      value={{
        error,
        getLedger,
        getPublicKey,
        signHash,
        sendTransaction,
        sendCrossChainTransaction,
      }}
    >
      {children}
    </LedgerContext.Provider>
  );
};

export const LedgerConsumer = LedgerContext.Consumer;

export function useLedgerContext() {
  return useContext(LedgerContext);
}
