import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  SettingBody,
  ContentSetting,
  TitleSetting,
  DivContent,
  Descripton,
  ImageNetworks,
  TitleHeader,
} from './style';
import { Body } from '../SendTransactions/styles';
import images from '../../images';
import { BoxContent } from './Contact/style';

const PageSetting = () => {
  const history = useHistory();
  const rootState = useSelector((state) => state);
  const { account } = rootState?.wallet;
  const text = 'Settings';

  const goContact = () => {
    history.push('/contact');
  };
  const goNetworks = () => {
    history.push('/networks');
  };
  const goAbout = () => {
    history.push('/about');
  };
  const goExportSeedPhrase = () => {
    history.push('/export-seed-phrase');
  };
  return (
    <SettingBody paddingTop="25px">
      <Body>
        <TitleHeader>{text}</TitleHeader>
        <ContentSetting>
          {
            account && (
              <DivContent
                onClick={goContact}
              >
                <BoxContent>
                  <TitleSetting>Contacts</TitleSetting>
                  <Descripton>Add, edit, remove, and manage your contacts</Descripton>
                </BoxContent>
                <ImageNetworks src={images.wallet.view} alt="view" />
              </DivContent>
            )
          }
          <DivContent
            onClick={goNetworks}
          >
            <BoxContent>
              <TitleSetting>Networks</TitleSetting>
              <Descripton>Add or edit custom RPC networks</Descripton>
            </BoxContent>
            <ImageNetworks src={images.wallet.view} alt="view" />
          </DivContent>
          <DivContent
            onClick={goExportSeedPhrase}
          >
            <BoxContent>
              <TitleSetting>Export Secret Recovery Phrase</TitleSetting>
              <Descripton>Secret Recovery Phrase</Descripton>
            </BoxContent>
            <ImageNetworks src={images.wallet.view} alt="view" />
          </DivContent>
          <DivContent
            onClick={goAbout}
          >
            <BoxContent>
              <TitleSetting>About</TitleSetting>
              <Descripton> Version, support center, and contact info</Descripton>
            </BoxContent>
            <ImageNetworks src={images.wallet.view} alt="view" />
          </DivContent>
        </ContentSetting>
      </Body>
    </SettingBody>
  );
};
export default PageSetting;
