import React from 'react';
import NftCard from '../NftCard';
import WizardsArenaModalContent from './ModalContent';
import { NFTData } from '../../nft-data';

export const getWizardCategory = (id: number) => {
  if (id >= 0 && id <= 1023) {
    return 'Wizard';
  }
  if (id <= 2047) {
    return 'Cleric';
  }
  if (id <= 3071) {
    return 'Druid';
  }
  return null;
};

const WizardsArena = ({ id, nftData, cardStyle }: { nftData: NFTData; id: number | string; cardStyle: React.CSSProperties }) => (
  <NftCard
    src={nftData.getPicById(id)}
    label={`${getWizardCategory(Number(id))} #${id}`}
    modalTitle={`${getWizardCategory(Number(id))} #${id}`}
    cardStyle={cardStyle}
    modalContent={<WizardsArenaModalContent cardStyle={cardStyle} id={Number(id)} nftData={nftData} />}
  />
);

export default WizardsArena;
