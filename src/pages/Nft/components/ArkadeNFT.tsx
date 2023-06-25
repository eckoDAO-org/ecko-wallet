import { NFTData } from '../nft-data';
import NftCard from './NftCard';

const ArkadeNFT = ({ id, nftData }: { id: string; nftData: NFTData }) => <NftCard src={nftData.getPicById(id)} label={`#${id}`} />;

export default ArkadeNFT;
