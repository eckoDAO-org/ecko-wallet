/* eslint-disable no-await-in-loop */
import React, { createContext, useContext, useState } from 'react';
import { listen } from '@ledgerhq/logs';
import styled from 'styled-components';
import KadenaLedger, { BuildTransactionResult, SignTransactionResult, TransferCrossChainTxParams, TransferTxParams } from 'hw-app-kda';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import { Overlay } from 'src/components/Modal/ModalCustom';
import { SecondaryLabel } from 'src/components';
import { SpinnerWrapper } from 'src/pages/SendTransactions/views/style';
import SpokesLoading from 'src/components/Loading/Spokes';

const LedgerModal = styled.div`
  position: fixed;
  padding: 24px;
  top: 20%;
  left: auto;
  width: 80%;
  height: 150px;
  padding: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1000;
  background-color: ${({ theme }) => theme.modalBackground};
  border-radius: 25px;
  width: 80%;
  box-shadow: 0 0 4px 0px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease-out;
`;
export const bufferToHex = (buffer) => [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('');
export const DEFAULT_BIP32_PATH = "m/44'/626'/0'/0/0";

interface KadenaLedgerData {
  error: string;
  isWaitingLedger: boolean;
  getLedger: () => Promise<KadenaLedger | undefined>;
  getPublicKey: () => Promise<string | undefined>;
  signHash: (hash: string) => Promise<SignTransactionResult | undefined>;
  sendTransaction: (params: TransferTxParams) => Promise<BuildTransactionResult | undefined>;
  sendCrossChainTransaction: (params: TransferCrossChainTxParams) => Promise<BuildTransactionResult | undefined>;
}

export const LedgerContext = createContext<KadenaLedgerData>({
  error: '',
  isWaitingLedger: false,
  getLedger: async () => undefined,
  getPublicKey: async () => undefined,
  signHash: async () => undefined,
  sendTransaction: async () => undefined,
  sendCrossChainTransaction: async () => undefined,
});

export const LedgerProvider = ({ children }: any) => {
  const [kadenaLedger, setKadenaLedger] = useState<KadenaLedger | undefined>();
  const [isWaitingLedger, setIsWaitingLedger] = useState(false);
  const [message, setMessage] = useState<React.ReactNode>();
  const [error, setError] = useState<string>('');

  const waitForLedgerRequest = async (ledgerFunction) => {
    try {
      setIsWaitingLedger(true);
      const result = await ledgerFunction();
      setIsWaitingLedger(false);
      return result;
    } catch (err) {
      setIsWaitingLedger(false);
      throw err;
    }
  };

  const getLedger = async (): Promise<KadenaLedger | undefined> => {
    if (!kadenaLedger?.transport) {
      try {
        const transport = await TransportWebHID.create();
        listen((log) => console.log('ledger log -->', log));
        const kadena = new KadenaLedger(transport);
        setKadenaLedger(kadena);
        return kadena;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Ledger ERROR:', err);
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
    const signH = async () => {
      setMessage('Please be sure to enable Blind Signing');
      return ledger?.signHash(DEFAULT_BIP32_PATH, hash);
    };
    return waitForLedgerRequest(signH);
  };

  const sendTransaction = async (params: TransferTxParams): Promise<BuildTransactionResult | undefined> =>
    waitForLedgerRequest(async () => (await getLedger())?.signTransferCreateTx({ path: DEFAULT_BIP32_PATH, ...params }));

  const sendCrossChainTransaction = async (params: TransferCrossChainTxParams): Promise<BuildTransactionResult | undefined> =>
    waitForLedgerRequest(async () => (await getLedger())?.signTransferCrossChainTx({ path: DEFAULT_BIP32_PATH, ...params }));

  return (
    <LedgerContext.Provider
      value={{
        error,
        getLedger,
        getPublicKey,
        isWaitingLedger,
        signHash,
        sendTransaction,
        sendCrossChainTransaction,
      }}
    >
      {children}
      {isWaitingLedger && (
        <>
          <LedgerModal>
            <SecondaryLabel>
              Please follow Ledger&apos;s instructions
              <br />
              {message ?? ''}
            </SecondaryLabel>
            <SpinnerWrapper>
              <SpokesLoading />
            </SpinnerWrapper>
          </LedgerModal>
          <Overlay zIndex={99} />
        </>
      )}
    </LedgerContext.Provider>
  );
};

export const LedgerConsumer = LedgerContext.Consumer;

export function useLedgerContext() {
  return useContext(LedgerContext);
}
