import { NFTData } from '../../nft-data';
import NftCard from '../NftCard';
import ArkadeModalContent from './ModalContent';

const ArkadeNFT = ({ id, nftData }: { id: string; nftData: NFTData }) => (
  <NftCard src={nftData.getPicById(id)} label={`#${id}`} modalTitle={`#${id}`} modalContent={<ArkadeModalContent id={id} nftData={nftData} />} />
);

export default ArkadeNFT;
