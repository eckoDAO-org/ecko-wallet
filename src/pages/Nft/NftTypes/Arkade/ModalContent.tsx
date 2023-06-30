import { CommonLabel, DivFlex, SecondaryLabel } from 'src/components';
import { NFTData } from '../../nft-data';
import NftCard from '../NftCard';

const ArkadeModalContent = ({ id, nftData, cardStyle }: { id: any; nftData: NFTData; cardStyle?: any }) => (
  <DivFlex flexDirection="column" padding="20px">
    <NftCard src={nftData.getPicById(id)} label="Description" cardStyle={{ width: 300, height: 300, ...cardStyle }} />;
    <SecondaryLabel>#{id}</SecondaryLabel>
    <CommonLabel margin="20px 0px">
      {nftData.displayName} #{id}
    </CommonLabel>
  </DivFlex>
);

export default ArkadeModalContent;
