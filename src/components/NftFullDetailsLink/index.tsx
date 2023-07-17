import images from 'src/images';
import { SecondaryLabel } from '..';

export const NftFullDetailsLink = ({ link }: { link: string }) => (
  <a href={link} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
    <SecondaryLabel style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 20 }}>
      Full details <img src={images.settings.iconShare} style={{ marginRight: 13 }} />
    </SecondaryLabel>
  </a>
);
