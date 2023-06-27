import { CommonLabel, DivFlex, SecondaryLabel } from 'src/components';
import NftCard from '../NftCard';

const KMCFPModalContent = ({ id }: { id?: any }) => (
  <DivFlex flexDirection="column" padding="20px">
    <NftCard src="https://farm.kdamining.club/static/media/founders.b9d3a224b6ce8e690f53.webp" label={`#${id}`} style={{ width: 300, height: 300 }} />
    ;<SecondaryLabel>Founder’s Pass #{id}</SecondaryLabel>
    <CommonLabel margin="20px 0px">
      Each and every Founder’s Pass comes with three primary benefits. First and foremost, anyone who holds TWO Founder’s Passes on our August 27th
      Miner collection mint date will be entitled to one free mint (valued at $300). Every Founder’s pass starts with 0.5 Free mints, and once the
      founders pass is used, the free mint will drop to 0. Additionally, every founders pass is entitled to one free upgrade into our Technology lab
      when it becomes available. Kadena Mining Club will using immersion cooling on some of our ASIC miners. This will come as an upgrade to a Miner
      NFT, which is a pricey upgrade. The Founder’s Pass grants you one free upgrade to one of your Miner NFTs when the technology lab becomes
      available. Finally, anyone who holds TWO founders passes will be eligible to receive free or discounted mints from our future collections.
    </CommonLabel>
  </DivFlex>
);

export default KMCFPModalContent;
