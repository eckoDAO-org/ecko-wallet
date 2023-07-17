import React from 'react';
import { NftFullDetailsLink } from 'src/components/NftFullDetailsLink';
import { DivFlex } from 'src/components';
import { NFTData } from '../../nft-data';
import NftCard from '../NftCard';

const ArkadeModalContent = ({ id, nftData, cardStyle }: { id: any; nftData: NFTData; cardStyle?: React.CSSProperties }) => (
  <DivFlex flexDirection="column" alignItems="center" padding="20px">
    <NftCard src={nftData.getPicById(id)} label={`${nftData.displayName} #${id}`} cardStyle={{ width: 300, height: 300, ...cardStyle }} />
    {nftData?.getDetailLinkById && <NftFullDetailsLink link={nftData?.getDetailLinkById(id)} />}
  </DivFlex>
);

export default ArkadeModalContent;
