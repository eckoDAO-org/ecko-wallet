/* eslint-disable jsx-a11y/anchor-is-valid */
import { useHistory } from 'react-router-dom';
import Back from 'src/components/Back';
import { TELEGRAM_GROUP_LINK, WEBSITE_LINK } from 'src/utils/config';
import { SettingBody } from '../style';
import { Body } from '../../SendTransactions/styles';
import { ContentAbout, TitleAbout, TitleDes, TitleVersion, AboutBody, Div, TitleHeaderAbout } from './style';

const PageAbout = () => {
  const text = 'About';
  const history = useHistory();
  const goBack = () => {
    history.push('/setting');
  };
  return (
    <SettingBody>
      <Div>
        <Back title="Back" onBack={goBack} />
        <Body>
          <TitleHeaderAbout>{text}</TitleHeaderAbout>
          <AboutBody>
            <ContentAbout>
              <TitleAbout>X Wallet v1.3.0</TitleAbout>
              <TitleVersion>The evolution of DeFi on Kadena</TitleVersion>
            </ContentAbout>
            <ContentAbout>
              <TitleDes fontWeight="700">
                <a href={TELEGRAM_GROUP_LINK} target="_blank" rel="noreferrer">
                  Join us on telegram
                </a>
              </TitleDes>
              <TitleDes fontWeight="700">
                <a href={WEBSITE_LINK} target="_blank" rel="noreferrer">
                  Visit our website
                </a>
              </TitleDes>
            </ContentAbout>
          </AboutBody>
        </Body>
      </Div>
    </SettingBody>
  );
};
export default PageAbout;
