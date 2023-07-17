import React from 'react';
import { NFTData } from '../../nft-data';
import NftCard from '../NftCard';
import ArkadeModalContent from './ModalContent';

const ArkadeNFT = ({ id, nftData, cardStyle }: { id: string; nftData: NFTData; cardStyle?: React.CSSProperties }) => (
  <NftCard
    src={nftData.getPicById(id)}
    label={`#${id}`}
    modalTitle={`#${id}`}
    cardStyle={cardStyle}
    modalContent={<ArkadeModalContent id={id} nftData={nftData} cardStyle={cardStyle} />}
  />
);

export default ArkadeNFT;
