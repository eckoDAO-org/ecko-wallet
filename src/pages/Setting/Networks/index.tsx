import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Back from 'src/components/Back';
import { useState } from 'react';
import images from 'src/images';
import Button from 'src/components/Buttons';
import { BUTTON_SIZE } from 'src/utils/constant';
import { ContactBody } from '../Contact/style';
import { ImageLock, TitleLock } from './style';
import { ButtonBack, DivContent, ImageNetworks, SettingBody, TitleHeader, LockWrapper, Content } from '../style';
import { Body, Footer } from '../../SendTransactions/styles';
import EditNetwork from './views/EditNetwork';
import ViewNetwork from './views/ViewNetwork';

const networkDefault = {
  name: '',
  url: '',
  explorer: '',
  networkId: '',
};
const PageNetworks = () => {
  const history = useHistory();
  const networks = useSelector((state) => state.extensions.networks);
  const [isEdit, setIsEdit] = useState(false);
  const [isNormal, setIsNormal] = useState(true);
  const [isView, setIsView] = useState(false);
  const [network, setNetwork] = useState<any>(networkDefault);

  const goBack = () => {
    if (isNormal) {
      history.push('/setting');
    } else {
      setIsNormal(true);
      setIsView(false);
      setIsEdit(false);
    }
  };
  const openMode = (isDefault, newNetwork) => {
    setNetwork({ ...newNetwork });
    if (isDefault) {
      setIsView(true);
      setIsEdit(false);
    } else {
      setIsView(false);
      setIsEdit(true);
    }
    setIsNormal(false);
  };
  const addNewNetwork = () => {
    setIsView(false);
    setIsEdit(true);
    setIsNormal(false);
    setNetwork(networkDefault);
  };
  const handleClickPopup = () => {
    setIsNormal(true);
    setIsView(false);
    setIsEdit(false);
  };

  const renderNormalMode = () =>
    networks.map((item) => (
      <DivContent key={item.id} onClick={() => openMode(item.isDefault, item)}>
        <TitleLock isDefault={item.isDefault}>{item.name}</TitleLock>
        <LockWrapper>
          {item.isDefault && <ImageLock src={images.settings.lock} alt="lock" />}
          <ImageNetworks isDefault={item.isDefault} src={images.wallet.view} alt="view" />
        </LockWrapper>
      </DivContent>
    ));

  return (
    <SettingBody>
      <ButtonBack>
        <Back title="Back" onBack={goBack} />
      </ButtonBack>
      <Body>
        {isNormal ? (
          <>
            <TitleHeader>Networks</TitleHeader>
          </>
        ) : (
          <TitleHeader>Network</TitleHeader>
        )}
        {isEdit && <EditNetwork network={network} onBack={goBack} isEdit onClickPopup={handleClickPopup} />}
        {isView && <ViewNetwork network={network} />}
        <ContactBody>{isNormal && renderNormalMode()}</ContactBody>
        {isNormal && (
          <Content>
            <Footer>
              <Button label="Add New Network" onClick={addNewNetwork} size={BUTTON_SIZE.FULL} />
            </Footer>
          </Content>
        )}
      </Body>
    </SettingBody>
  );
};
export default PageNetworks;
