import { useState } from 'react';
import { useSelector } from 'react-redux';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { sign as kadenaJSSign } from '@kadena/cryptography-utils';
import styled from 'styled-components';
import { BaseTextInput } from 'src/baseComponent';
import Button from 'src/components/Buttons';
import { toast } from 'react-toastify';
import Toast from 'src/components/Toast/Toast';
import { CommonLabel, DivFlex, SecondaryLabel } from 'src/components';
import images from 'src/images';
import { getSignatureFromHash } from 'src/utils/chainweb';
import { AccountType } from 'src/stores/wallet';
import { bufferToHex, useLedgerContext } from 'src/contexts/LedgerContext';

export const Icon = styled.img`
  cursor: pointer;
`;

export const HashSignModal = () => {
  const rootState = useSelector((state) => state);
  const { publicKey, secretKey, type } = rootState?.wallet;

  const [hash, setHash] = useState('');
  const [signature, setSignature] = useState('');
  const { signHash, isWaitingLedger } = useLedgerContext();

  const onCopy = (str: string) => {
    navigator.clipboard.writeText(str);
    toast.success(<Toast type="success" content="Copied!" />);
  };

  return (
    <>
      <div style={{ padding: '24px', paddingBottom: 0 }}>
        <div style={{ marginBottom: 30 }}>
          <DivFlex justifyContent="space-between" alignItems="center" style={{ marginBottom: 10 }}>
            <SecondaryLabel fontSize={10}>YOUR PUBLIC KEY</SecondaryLabel>
            <Icon src={images.wallet.copyGray} onClick={() => onCopy(publicKey)} />
          </DivFlex>
          <DivFlex justifyContent="flex-start" alignItems="flex-start">
            <Jazzicon diameter={24} seed={jsNumberForAddress(publicKey)} paperStyles={{ marginRight: 5, minWidth: 24 }} />
            <CommonLabel wordBreak="break-word">{publicKey}</CommonLabel>
          </DivFlex>
        </div>
      </div>
      <div style={{ padding: 24, borderTop: ' 1px solid #dfdfed' }}>
        <SecondaryLabel fontSize={10} margin="10px 0px" style={{ display: 'block' }}>
          TRANSACTION HASH
        </SecondaryLabel>
        <BaseTextInput
          inputProps={{ value: hash || '', placeholder: 'Insert Transaction Hash' }}
          title=""
          height="auto"
          onChange={(e) => {
            setHash(e.target.value);
          }}
        />
        {signature && (
          <>
            <DivFlex justifyContent="space-between" alignItems="center" margin="20px 0px 10px 0px">
              <SecondaryLabel fontSize={10}>SIGNATURE</SecondaryLabel>
              <Icon src={images.wallet.copyGray} onClick={() => onCopy(signature)} />
            </DivFlex>
            <DivFlex justifyContent="flex-start" alignItems="flex-start">
              <CommonLabel wordBreak="break-word">{signature}</CommonLabel>
            </DivFlex>
          </>
        )}
        <DivFlex justifyContent="space-between" alignItems="center" gap="10px" padding="10px 0px" marginTop="40px">
          <Button
            label="Clean"
            size="full"
            variant="grey"
            onClick={() => {
              setHash('');
              setSignature('');
            }}
          />
          <Button
            type="submit"
            label="Sign"
            size="full"
            onClick={() => {
              if (hash) {
                let signatureOutput: any;
                if (type === AccountType.LEDGER) {
                  signHash(hash)
                    .then((signHashResult) => {
                      setSignature(bufferToHex(signHashResult?.signature));
                    })
                    .catch(() => {
                      setHash('');
                      setSignature('');
                    });
                } else if (secretKey.length > 64) {
                  signatureOutput = getSignatureFromHash(hash, secretKey);
                  setSignature(signatureOutput);
                } else {
                  signatureOutput = kadenaJSSign(hash, { secretKey, publicKey })?.sig ?? '';
                  setSignature(signatureOutput);
                }
              }
            }}
          />
        </DivFlex>
      </div>
    </>
  );
};
