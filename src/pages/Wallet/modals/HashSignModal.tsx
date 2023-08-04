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

export const Icon = styled.img`
  cursor: pointer;
`;

export const HashSignModal = () => {
  const rootState = useSelector((state) => state);
  const { publicKey, secretKey } = rootState?.wallet;

  const [hash, setHash] = useState('');
  const [signature, setSignature] = useState('');

  const onCopy = (str: string) => {
    navigator.clipboard.writeText(str);
    toast.success(<Toast type="success" content="Copied!" />);
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 30 }}>
        <DivFlex justifyContent="space-between" alignItems="center" style={{ marginBottom: 20 }}>
          <SecondaryLabel fontSize={10}>YOUR PUBLIC NAME</SecondaryLabel>
          <Icon src={images.wallet.copyGray} onClick={() => onCopy(publicKey)} />
        </DivFlex>
        <DivFlex justifyContent="flex-start" alignItems="flex-start">
          <Jazzicon diameter={24} seed={jsNumberForAddress(publicKey)} paperStyles={{ marginRight: 5, minWidth: 24 }} />
          <CommonLabel>{publicKey}</CommonLabel>
        </DivFlex>
      </div>
      <BaseTextInput
        inputProps={{ value: hash }}
        title="Transaction Hash"
        height="auto"
        onChange={(e) => {
          if (e.target?.value?.length < 20) {
            setHash(e.target.value);
          }
        }}
      />
      {signature && (
        <>
          <DivFlex justifyContent="space-between" alignItems="center" style={{ marginBottom: 20 }}>
            <SecondaryLabel fontSize={10}>SIGNATURE</SecondaryLabel>
            <Icon src={images.wallet.copyGray} onClick={() => onCopy(signature)} />
          </DivFlex>
          <DivFlex justifyContent="flex-start" alignItems="flex-start">
            <CommonLabel>{signature}</CommonLabel>
          </DivFlex>
        </>
      )}
      <DivFlex justifyContent="space-between" alignItems="center" gap="10px" padding="10px">
        <Button
          label="Clean"
          size="full"
          variant="disabled"
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
            let signatureOutput = '';
            if (secretKey.length > 64) {
              signatureOutput = getSignatureFromHash(hash, secretKey);
            } else {
              signatureOutput = kadenaJSSign(hash, { secretKey, publicKey })?.sig ?? '';
            }
            setSignature(signatureOutput);
          }}
        />
      </DivFlex>
    </div>
  );
};
