import React, { useEffect, useState } from 'react';
import { NftFullDetailsLink } from 'src/components/NftFullDetailsLink';
import { useSelector } from 'react-redux';
import { CommonLabel, DivFlex, SecondaryLabel } from 'src/components';
import { fetchLocal } from 'src/utils/chainweb';
import NftCard from '../NftCard';
import { NFTData } from '../../nft-data';
import { getWizardCategory } from '.';
import { NftTableRow } from '../../style';

const WizardsArenaModalContent = ({ id, nftData, cardStyle }: { id: number; nftData: NFTData; cardStyle: React.CSSProperties }) => {
  const [data, setData] = useState<any>({});
  const rootState = useSelector((state) => state);
  const { selectedNetwork } = rootState.extensions;

  useEffect(() => {
    fetchLocal(`(free.wiz-arena.get-wizard-fields-for-id ${id})`, selectedNetwork?.url, selectedNetwork?.networkId, 1).then((res) =>
      setData(res?.result?.data),
    );
  }, [id]);

  return (
    <DivFlex flexDirection="column" alignItems="center" padding="20px">
      <NftCard src={nftData.getPicById(id)} label={`${getWizardCategory(Number(id))} #${id}`} cardStyle={{ width: 300, height: 300, ...cardStyle }} />
      <>
        <NftTableRow>
          <SecondaryLabel>Level</SecondaryLabel>
          <CommonLabel>{data?.level?.int ?? '-'}</CommonLabel>
        </NftTableRow>
        <NftTableRow>
          <SecondaryLabel>Element</SecondaryLabel>
          <CommonLabel>{data?.element ?? '-'}</CommonLabel>
        </NftTableRow>
        <NftTableRow>
          <SecondaryLabel>Spell</SecondaryLabel>
          <CommonLabel>{data?.spellSelected?.name ?? '-'}</CommonLabel>
        </NftTableRow>
        <NftTableRow>
          <SecondaryLabel>Weakness</SecondaryLabel>
          <CommonLabel>{data?.weakness?.toLocaleUpperCase() ?? '-'}</CommonLabel>
        </NftTableRow>
        {nftData?.getDetailLinkById && <NftFullDetailsLink link={nftData?.getDetailLinkById(id)} />}
      </>
    </DivFlex>
  );
};

export default WizardsArenaModalContent;
