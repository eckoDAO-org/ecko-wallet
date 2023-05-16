import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import images from 'src/images';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import Toast from 'src/components/Toast/Toast';
import { ReactComponent as AlertIcon } from 'src/images/icon-alert.svg';
import { NavigationHeader } from 'src/components/NavigationHeader';
import { DivFlex, SecondaryLabel } from 'src/components';
import { Warning } from 'src/pages/SendTransactions/styles';
import { ActionList } from 'src/components/ActionList';
import { SeedPhraseRetrivier } from 'src/components/SeedPhraseRetrivier';

const Wrapper = styled.div`
  padding: 0 20px;

  font-size: 16px;
  word-break: break-word;
`;

export const SPWrapper = styled.div`
  padding: 16px;
  font-size: 16px;
  position: relative;
  box-shadow: 0px 167px 67px rgba(36, 8, 43, 0.01), 0px 94px 57px rgba(36, 8, 43, 0.03), 0px 42px 42px rgba(36, 8, 43, 0.06),
    0px 10px 23px rgba(36, 8, 43, 0.06), 0px 0px 0px rgba(36, 8, 43, 0.07);
  border-radius: 25px;
  box-sizing: border-box;
  text-align: center;
`;

const SPText = styled.div`
  ${(props) => (props.isBlur ? 'filter: blur(4px);' : '')};
  color: ${({ theme }) => theme.text.primary};
  font-weight: 400;
  line-height: 48px;
  font-family: monospace;
  font-size: 24px;
`;

const ExportSeedPhrase = () => {
  const history = useHistory();
  const [seedPhrase, setSeedPhrase] = useState('');

  const onCopy = () => {
    navigator.clipboard.writeText(seedPhrase);
    toast.success(<Toast type="success" content="Copied!" />);
  };

  const goBack = () => {
    history.goBack();
  };

  const encryptText = (text) => {
    const arr = text.split(' ');
    let result = '';
    for (let i = 0; i < arr.length; i += 1) {
      let t = arr[i];
      if (i !== 0 && i !== arr.length - 1) {
        t = '*****';
      }
      result = `${result} ${t}`;
    }
    return result;
  };

  const onSeedPhraseRetrivied = (retriviedSeedPhrase) => setSeedPhrase(retriviedSeedPhrase);

  const onDownload = () => {
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(seedPhrase)}`);
    element.setAttribute('download', 'secret-recovery-phrase');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Wrapper>
      <NavigationHeader title="Export Recovery Phrase" onBack={goBack} />
      {seedPhrase ? (
        <SPWrapper>
          <SPText>{encryptText(seedPhrase)}</SPText>
          <DivFlex flexDirection="column" alignItems="center" paddingTop="30px" style={{ borderTop: '1px solid #DFDFED' }}>
            <SecondaryLabel fontWeight={500} fontSize={14}>
              Your Secret Recovery Phrase makes it easy to back up and restore your account.
            </SecondaryLabel>
            <Warning style={{ textAlign: 'start', marginTop: 30 }}>
              <AlertIcon style={{ minWidth: 22 }} />
              Never disclose your Secret Recovery Phrase. Anyone with this phrase can take your wallet forever.
            </Warning>
          </DivFlex>
          <ActionList
            actions={[
              {
                label: 'Copy Keyphrase',
                src: images.wallet.copyGray,
                onClick: onCopy,
              },
              { label: 'Download', src: images.settings.iconDownload, onClick: onDownload },
            ]}
          />
        </SPWrapper>
      ) : (
        <SeedPhraseRetrivier onSuccess={onSeedPhraseRetrivied} />
      )}
    </Wrapper>
  );
};
export default ExportSeedPhrase;
