/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/media-has-caption */
import { NftFullDetailsLink } from 'src/components/NftFullDetailsLink';
import { CommonLabel, DivFlex, SecondaryLabel } from 'src/components';
import { NftTableRow } from '../../style';
import NftCard from '../NftCard';

const MarmaladeV2ModalContent = ({ uriData, auctionNumber }: { uriData: any; auctionNumber?: string }) => (
  <DivFlex flexDirection="column" alignItems="center" padding="20px">
    <NftCard src={uriData.image} label={`#${auctionNumber} `} cardStyle={{ width: 300, height: 380 }} />
    <>
      <NftTableRow>
        <CommonLabel>{uriData?.name ?? '-'}</CommonLabel>
      </NftTableRow>
      <NftTableRow>
        <SecondaryLabel>Description</SecondaryLabel>
        <CommonLabel>{uriData?.description ?? '-'}</CommonLabel>
      </NftTableRow>
      <NftTableRow>
        <SecondaryLabel>PROPERTIES</SecondaryLabel>
      </NftTableRow>
      {uriData?.properties &&
        Object.keys(uriData?.properties).map((propertyKey) => (
          <NftTableRow>
            <SecondaryLabel>{propertyKey}</SecondaryLabel>
            <CommonLabel>{uriData?.properties[propertyKey] ?? '-'}</CommonLabel>
          </NftTableRow>
        ))}
      <NftFullDetailsLink link={auctionNumber ? `https://nft.immutablerecord.com/?id=${auctionNumber}` : '#'} />
    </>
  </DivFlex>
);

export default MarmaladeV2ModalContent;
