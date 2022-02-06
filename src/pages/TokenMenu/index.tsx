import { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Back from 'src/components/Back';
import { toast } from 'react-toastify';
import Toast from 'src/components/Toast/Toast';
import useLocalStorage from 'src/hooks/useLocalStorage';
import ModalCustom from 'src/components/Modal/ModalCustom';
import { SettingBody, ContentSetting, TitleSetting, DivContent, Descripton, ImageNetworks, TitleHeader } from './style';
import { Body } from '../SendTransactions/styles';
import images from '../../images';
import { BoxContent } from '../Setting/Contact/style';
import { BodyModal, TitleModal } from '../Setting/Contact/views/style';
import { ActionButton, ButtonModal, DescriptionModal } from '../Setting/Networks/style';
import { IFungibleToken } from '../ImportToken';

const TokenMenu = () => {
  const [isRemovingToken, setIsRemovingToken] = useState(false);
  const [fungibleTokens, setFungibleTokens] = useLocalStorage<IFungibleToken[]>('fungibleTokens', []);
  const history = useHistory();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const symbol = params.get('coin');

  const onClickRemove = () => {
    setIsRemovingToken(true);
  };
  const onClickEdit = () => {
    history.push(`/import-token?coin=${symbol}`);
  };
  const onClickSend = () => {
    history.push(`/transfer?coin=${symbol}`);
  };
  const handleRemoveToken = () => {
    const newFungibleTokens = fungibleTokens?.filter((ft) => ft.symbol !== symbol) ?? [];
    setFungibleTokens([...newFungibleTokens]);
    toast.success(<Toast type="success" content="Token successfully removed" />);
    history.push('/');
  };

  return (
    <SettingBody paddingTop="25px">
      <Body>
        <Back title="Back" style={{ paddingLeft: 20, marginTop: 0 }} onBack={() => history.push('/')} />
        <TitleHeader>{symbol?.toUpperCase()}</TitleHeader>
        <ContentSetting>
          <DivContent onClick={onClickSend}>
            <BoxContent>
              <TitleSetting>Send</TitleSetting>
              <Descripton>
                Send
                {` ${symbol?.toUpperCase()} `}
                to another account
              </Descripton>
            </BoxContent>
            <ImageNetworks src={images.wallet.view} alt="view" />
          </DivContent>
          <DivContent onClick={onClickEdit}>
            <BoxContent>
              <TitleSetting>Edit</TitleSetting>
              <Descripton>Edit token data</Descripton>
            </BoxContent>
            <ImageNetworks src={images.wallet.view} alt="view" />
          </DivContent>
          <DivContent onClick={onClickRemove}>
            <BoxContent>
              <TitleSetting>Remove</TitleSetting>
              <Descripton>
                Remove
                {` ${symbol?.toUpperCase()} `}
                from token list
              </Descripton>
            </BoxContent>
            <ImageNetworks src={images.wallet.view} alt="view" />
          </DivContent>
        </ContentSetting>
      </Body>
      <ModalCustom isOpen={isRemovingToken} showCloseIcon closeOnOverlayClick>
        <BodyModal>
          <TitleModal>Remove token?</TitleModal>
          <DescriptionModal>
            Are you sure you want to remove
            <br />
            {symbol?.toUpperCase()}?
          </DescriptionModal>
          <ActionButton>
            <ButtonModal background="#ffffff" color="#461A57" border="1px solid #461A57" onClick={() => setIsRemovingToken(false)}>
              Cancel
            </ButtonModal>
            <ButtonModal background="#461A57" color="#ffffff" onClick={handleRemoveToken}>
              Remove
            </ButtonModal>
          </ActionButton>
        </BodyModal>
      </ModalCustom>
    </SettingBody>
  );
};
export default TokenMenu;
