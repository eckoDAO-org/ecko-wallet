/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/media-has-caption */
import { useEffect, useState } from 'react';
import { NftFullDetailsLink } from 'src/components/NftFullDetailsLink';
import { CommonLabel, DivFlex, SecondaryLabel } from 'src/components';
import { NftTableRow } from '../../style';
import { NFTData } from '../../nft-data';
import NftCard from '../NftCard';

const MarmaladeV2ModalContent = ({ uriData }: { uriData: any }) => (
  <DivFlex flexDirection="column" alignItems="center" padding="20px">
    <NftCard src={uriData.image} label={`${uriData.name} `} cardStyle={{ width: 300, height: 380 }} />
    <>
      <NftTableRow>
        <CommonLabel>{uriData?.name ?? '-'}</CommonLabel>
      </NftTableRow>
      <NftTableRow>
        <CommonLabel>{uriData?.description ?? '-'}</CommonLabel>
      </NftTableRow>
      {/* {nftData?.getDetailLinkById && <NftFullDetailsLink link={nftData?.getDetailLinkById(id)} />} */}
    </>
  </DivFlex>
);

export default MarmaladeV2ModalContent;
