/* eslint-disable no-console */
import { useState } from 'react';
import { ButtonAdd, ButtonWrapper } from 'src/pages/SendTransactions/views/style';
import Button from 'src/components/Buttons';
import { BUTTON_SIZE, BUTTON_TYPE } from 'src/utils/constant';
import { BaseTextInput, InputError } from 'src/baseComponent';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import Toast from 'src/components/Toast/Toast';
import { convertNetworks, getTimestamp } from 'src/utils';
import { getLocalNetworks, setLocalNetworks } from 'src/utils/storage';
import { setNetworks } from 'src/stores/extensions';
import ModalCustom from 'src/components/Modal/ModalCustom';
import { Content } from '../../style';
import { ErrorWrapper, Footer } from '../../../SendTransactions/styles';
import { DivBodyNetwork } from './style';
import { ActionButton, BodyModal, ButtonModal, DescriptionModal, TitleModal } from '../style';
import { DivError } from '../../Contact/views/style';

type Props = {
  onBack: any;
  network: any;
  isEdit: boolean;
  onClickPopup: Function;
};

const EditNetwork = (props: Props) => {
  const { onBack, network, isEdit, onClickPopup } = props;
  const [settingNetwork, setSettingNetwork] = useState<any>(network);
  const [errMessageDuplicateUrl, setErrorMessageDuplicateUrl] = useState('');
  const [errMessageDuplicateNetworksId, setErrorMessageDuplicateNetworksId] = useState('');
  const networks = useSelector((state) => state.extensions.networks);
  const [isModalRemoveNetwork, setModalRemoveNetwork] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
  } = useForm();
  const id = network.id ? network.id : getTimestamp();
  const onSave = () => {
    const alertText = network.id ? 'Edit network successfully' : 'Add network successfully';
    const newNetwork = {
      id: id.toString(),
      name: settingNetwork.name.trim(),
      url: settingNetwork.url,
      explorer: settingNetwork.explorer,
      networkId: settingNetwork.networkId.trim(),
      isDefault: false,
    };
    if (checkDuplicateUrl()) {
      setErrorMessageDuplicateUrl('URL already exist');
      return;
    }
    getLocalNetworks(
      (data) => {
        const localNetworks = data;
        localNetworks[`${newNetwork.id}`] = newNetwork;
        setLocalNetworks(localNetworks);
        setNetworks(convertNetworks(localNetworks));
        onBack();
        toast.success(<Toast type="success" content={alertText} />);
      },
      () => {
        const localNetworks = {};
        localNetworks[`${newNetwork.id}`] = newNetwork;
        setLocalNetworks(localNetworks);
        setNetworks(convertNetworks(localNetworks));
        onBack();
        toast.success(<Toast type="success" content={alertText} />);
      },
    );
  };
  const checkDuplicateUrl = (): boolean => {
    const duplicate = networks.some((itemNetwork: any) => itemNetwork.url === settingNetwork.url && itemNetwork.id !== id);
    return duplicate;
  };
  const onErrors = (err) => {
    console.log('err', err);
  };
  const handleChangeNetwork = (e, key) => {
    const { value } = e.target;
    const newValue = { ...settingNetwork };
    newValue[key] = value;
    setSettingNetwork(newValue);
    console.log(newValue);
  };
  const deleteNetwork = () => {
    getLocalNetworks(
      (data) => {
        const localNetworks = data;
        delete localNetworks[`${id}`];
        setLocalNetworks(localNetworks);
        setNetworks(convertNetworks(localNetworks));
        onClickPopup();
        setModalRemoveNetwork(false);
        toast.success(<Toast type="success" content="Delete network successfully" />);
      },
      () => {},
    );
  };
  const checkInValidURL = (str) => {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i',
    );
    return !!pattern.test(str);
  };

  return (
    <Content>
      <form onSubmit={handleSubmit(onSave, onErrors)} id="save-network">
        <DivBodyNetwork>
          <BaseTextInput
            inputProps={{
              value: settingNetwork.name,
              placeholder: 'Insert Network Name',
              ...register('name', {
                required: {
                  value: true,
                  message: 'This field is required.',
                },
                maxLength: {
                  value: 1000,
                  message: 'Network name should be maximum 1000 characters.',
                },
                validate: {
                  required: (val) => val.trim().length > 0 || 'Invalid data',
                },
              }),
            }}
            title="Network Name"
            height="auto"
            onChange={(e) => {
              clearErrors('name');
              handleChangeNetwork(e, 'name');
              setValue('name', e.target.value);
            }}
            onBlur={(e) => {
              setValue('name', e.target.value.trim());
              handleChangeNetwork(e, 'name');
            }}
          />
          {errors.name && (
            <ErrorWrapper>
              <DivError>
                <InputError marginTop="0">{errors.name.message}</InputError>
              </DivError>
            </ErrorWrapper>
          )}
        </DivBodyNetwork>
        <DivBodyNetwork>
          <BaseTextInput
            inputProps={{
              value: settingNetwork.url,
              placeholder: 'Insert New RPC URL',
              ...register('url', {
                required: {
                  value: true,
                  message: 'This field is required.',
                },
                maxLength: {
                  value: 1000,
                  message: 'New RPC URL should be maximum 1000 characters.',
                },
                validate: {
                  required: (val) => val.trim().length > 0 || 'Invalid url',
                  match: (val) => checkInValidURL(val) || 'Invalid url',
                },
              }),
            }}
            title="New RPC URL"
            height="auto"
            onChange={(e) => {
              clearErrors('url');
              handleChangeNetwork(e, 'url');
              setValue('url', e.target.value);
              setErrorMessageDuplicateUrl('');
            }}
            onBlur={(e) => {
              setValue('url', e.target.value.trim());
              handleChangeNetwork(e, 'url');
            }}
          />
          {errors.url && (
            <ErrorWrapper>
              <DivError>
                <InputError marginTop="0">{errors.url.message}</InputError>
              </DivError>
            </ErrorWrapper>
          )}
          {errMessageDuplicateUrl && (
            <ErrorWrapper>
              <DivError>
                <InputError marginTop="0">{errMessageDuplicateUrl}</InputError>
              </DivError>
            </ErrorWrapper>
          )}
        </DivBodyNetwork>
        <DivBodyNetwork>
          <BaseTextInput
            inputProps={{
              value: settingNetwork.explorer,
              placeholder: 'Insert Block Explorer URL',
              ...register('explorer', {
                required: {
                  value: true,
                  message: 'This field is required.',
                },
                maxLength: {
                  value: 1000,
                  message: 'Block Explorer URL should be maximum 1000 characters.',
                },
                validate: {
                  required: (val) => val.trim().length > 0 || 'Invalid data',
                  match: (val) => checkInValidURL(val) || 'Invalid url',
                },
              }),
            }}
            title="Block Explorer URL"
            height="auto"
            onChange={(e) => {
              clearErrors('explorer');
              handleChangeNetwork(e, 'explorer');
              setValue('explorer', e.target.value);
            }}
            onBlur={(e) => {
              setValue('explorer', e.target.value.trim());
              handleChangeNetwork(e, 'explorer');
            }}
          />
          {errors.explorer && (
            <ErrorWrapper>
              <DivError>
                <InputError marginTop="0">{errors.explorer.message}</InputError>
              </DivError>
            </ErrorWrapper>
          )}
        </DivBodyNetwork>
        <DivBodyNetwork>
          <BaseTextInput
            inputProps={{
              value: settingNetwork.networkId,
              placeholder: 'Insert Network ID',
              ...register('networkId', {
                required: {
                  value: true,
                  message: 'This field is required.',
                },
                maxLength: {
                  value: 1000,
                  message: 'Network ID should be maximum 1000 characters.',
                },
                validate: {
                  required: (val) => val.trim().length > 0 || 'Invalid data',
                },
              }),
            }}
            title="Network ID"
            height="auto"
            onChange={(e) => {
              clearErrors('networkId');
              handleChangeNetwork(e, 'networkId');
              setValue('networkId', e.target.value);
              setErrorMessageDuplicateNetworksId('');
            }}
            onBlur={(e) => {
              setValue('networkId', e.target.value.trim());
              handleChangeNetwork(e, 'networkId');
            }}
          />
          {errors.networkId && (
            <ErrorWrapper>
              <DivError>
                <InputError marginTop="0">{errors.networkId.message}</InputError>
              </DivError>
            </ErrorWrapper>
          )}
          {errMessageDuplicateNetworksId && (
            <ErrorWrapper>
              <DivError>
                <InputError marginTop="0">{errMessageDuplicateNetworksId}</InputError>
              </DivError>
            </ErrorWrapper>
          )}
        </DivBodyNetwork>
      </form>
      <Footer>
        {isEdit && network.id ? (
          <>
            <ButtonWrapper>
              <Button label="Remove" type={BUTTON_TYPE.REMOVE} onClick={() => setModalRemoveNetwork(true)} size={BUTTON_SIZE.FULL} />
            </ButtonWrapper>
            {isModalRemoveNetwork && (
              <ModalCustom isOpen={isModalRemoveNetwork} showCloseIcon={false} closeOnOverlayClick>
                <BodyModal>
                  <TitleModal>Remove Network?</TitleModal>
                  <DescriptionModal>Are you sure you want to remove?</DescriptionModal>
                  <ActionButton>
                    <ButtonModal background="#ffffff" color="#461A57" border="1px solid #461A57" onClick={() => setModalRemoveNetwork(false)}>
                      Cancel
                    </ButtonModal>
                    <ButtonModal background="#461A57" color="#ffffff" onClick={deleteNetwork}>
                      Remove
                    </ButtonModal>
                  </ActionButton>
                </BodyModal>
              </ModalCustom>
            )}
            <ButtonWrapper>
              <Button label="Cancel" type={BUTTON_TYPE.DISABLE} onClick={onBack} size={BUTTON_SIZE.FULL} />
            </ButtonWrapper>
            <ButtonWrapper>
              <ButtonAdd form="save-network">Save</ButtonAdd>
            </ButtonWrapper>
          </>
        ) : (
          <>
            <ButtonWrapper>
              <Button label="Cancel" type={BUTTON_TYPE.DISABLE} onClick={onBack} size={BUTTON_SIZE.FULL} />
            </ButtonWrapper>
            <ButtonWrapper>
              <ButtonAdd form="save-network">Save</ButtonAdd>
            </ButtonWrapper>
          </>
        )}
      </Footer>
    </Content>
  );
};

export default EditNetwork;
