import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ActionList } from 'src/components/ActionList';
import { useModalContext } from 'src/contexts/ModalContext';
import { useCurrentWallet } from 'src/stores/wallet/hooks';
import { getTokenList } from 'src/utils/chainweb';
import { BaseTextInput } from 'src/baseComponent';
import images from 'src/images';

const Wrapper = styled.div`
  padding: 20px;
  min-height: 40vh;
`;

export const AssetsList = () => {
  const history = useHistory();
  const rootState = useSelector((state) => state);
  const { selectedNetwork } = rootState.extensions;
  const { chainId } = useCurrentWallet();

  const { closeModal } = useModalContext();

  const [tokens, setTokens] = useState<string[]>([]);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    const init = async () => {
      if (selectedNetwork && selectedNetwork.url) {
        const allTokens = await getTokenList();
        setTokens([...allTokens]);
      }
    };
    init();
  }, [selectedNetwork, chainId]);
  return (
    <Wrapper>
      <div style={{ marginBottom: 10 }}>
        <BaseTextInput
          title=""
          inputProps={{
            placeholder: 'Search',
            value: search,
          }}
          height="auto"
          image={{
            width: '20px',
            height: '20px',
            src: images.search,
            callback: () => {},
          }}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </div>
      <ActionList
        actions={tokens
          .filter((t) => !search || t.includes(search))
          .map((t) => ({
            label: t,
            onClick: () => {
              closeModal();
              history.push(`/import-token?suggest=${t}`);
            },
          }))}
      />
    </Wrapper>
  );
};
