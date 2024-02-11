import { CommonLabel, DivFlex } from 'src/components';
import ReactJson from 'react-json-view';
import { useAppThemeContext } from 'src/contexts/AppThemeContext';
import NftCard from '../NftCard';
import { NgTokenData } from './MarmaladeNGCollectionDetails';

export const NGModalContent = ({ token }: { token: NgTokenData }) => {
  const { theme } = useAppThemeContext();
  return (
    <DivFlex flexDirection="column" alignItems="center" padding="20px">
      <NftCard src={token.src} label={`#${token.number} `} cardStyle={{ width: 300, height: 300 }} />
      <CommonLabel>NFT Metadata</CommonLabel>
      <DivFlex
        padding="10px"
        style={{
          wordBreak: 'break-word',
          fontSize: 13,
        }}
      >
        <ReactJson
          name="metadata"
          src={token.metadata}
          theme={theme.isDark ? 'twilight' : 'rjv-default'}
          enableClipboard={false}
          displayObjectSize={false}
          displayDataTypes={false}
          quotesOnKeys={false}
          shouldCollapse={false}
          style={{ paddingBottom: 40 }}
          collapseStringsAfterLength={false}
        />
      </DivFlex>
    </DivFlex>
  );
};
