import images from 'src/images';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import {
  getLocalActiveDapps,
  getLocalDapps,
  getLocalPassword,
  getLocalSelectedNetwork,
  getLocalSelectedWallet,
  getLocalWallets,
  setLocalActiveDapps,
  setLocalSelectedWallet,
  setLocalWallets,
} from 'src/utils/storage';
import { updateConnectMessage } from 'src/utils/message';
import { decryptKey } from 'src/utils/security';
import { shortenAddress } from 'src/utils';
import { DivFlex, SecondaryLabel } from 'src/components';
import Button from 'src/components/Buttons';
import { Radio } from 'src/components/Radio';
import { setCurrentWallet, setWallets } from 'src/stores/wallet';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 2;
  font-size: 14px;
  overflow-y: scroll;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 2px;
  }

  &::-webkit-scrollbar-track {
    background: rgb(226, 226, 226);
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgb(54, 54, 54);
    border-radius: 2px;
  }
`;
const CompleteWrapper = styled.div`
  padding: 20px;
  margin-top: 50px;
`;
const ConnectFooterWrapper = styled.div`
  margin-top: 55px;
`;
const ConnectItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  align-items: ${(props) => (props.alignTop ? 'flex-start' : 'center')};
`;
const Div = styled.div`
  display: flex;
  align-items: center;
  width: 32%;
  justify-content: center;
  text-align: center;
  word-break: break-word;
`;
const ContentWrapper = styled.div`
  padding: 20px 20px;
`;
const Label = styled.span`
  display: inline-block;
  line-height: 25px;
`;
const CheckboxWrapper = styled.div``;
const NoData = styled.div`
  text-align: center;
  margin-top: 50px;
`;
const AccountName = styled.span`
  font-weight: 700;
  font-size: 16px;
`;
const Brick = styled.div`
  height: 20px;
  transform: matrix(1, 0, 0, -1, 0, 0);
`;
const DappDescription = styled.div`
  text-align: center;
  margin: 20px 0;
`;
const ConnectInfo = styled.div`
  font-size: 16px;
  font-weight: 700;
  margin: 40px 0;
  line-height: 25px;
  text-align: center;
  word-break: break-word;
`;
const DappTitle = styled.div`
  text-align: center;
  font-weight: 700;
  font-size: 18px;
`;
const Logo = styled.img`
  width: 70px;
  height: 70px;
  margin: 50px auto 20px auto;
`;
const Image = styled.img`
  width: 60px;
  height: 60px;
`;
const CenterImage = styled.img`
  width: 36%;
  height: 33px;
`;
const ConnectedDapp = () => {
  const [networkId, setNetworkId] = useState('testnet04');
  const [step, setStep] = useState(1);
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [domain, setDomain] = useState('example.com.vn');
  const [tabId, setTabId] = useState(null);
  const [icon, setIcon] = useState(images.dappsLogo);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    getLocalDapps(
      (dapps) => {
        getLocalSelectedNetwork(
          (selectedNetwork) => {
            if (selectedNetwork.networkId === dapps.networkId) {
              setNetworkId(selectedNetwork.networkId);
              setDomain(dapps.domain);
              setTabId(dapps.tabId);
              if (dapps.icon !== 'no icon') {
                setIcon(dapps.icon);
              }
              getLocalWallets(
                dapps.networkId,
                (wallets) => {
                  getLocalPassword(
                    (accountPassword) => {
                      const newWallets: any[] = [];
                      wallets.forEach((wallet: any) => {
                        const isSelected = wallet.connectedSites.includes(dapps.domain);
                        if (!isSelected) {
                          newWallets.push({
                            account: decryptKey(wallet.account, accountPassword),
                            publicKey: decryptKey(wallet.publicKey, accountPassword),
                            secretKey: decryptKey(wallet.secretKey, accountPassword),
                            connectedSites: wallet.connectedSites,
                            isSelected: true,
                          });
                        }
                      });
                      setData(newWallets);
                    },
                    () => {},
                  );
                },
                () => {},
              );
            }
          },
          () => {},
        );
      },
      () => {},
    );
  }, []);

  const getSelectConnectedSites = (arr: any = [], dappName, isSelected) => {
    let newArr = [...arr];
    if (arr.includes(dappName)) {
      if (!isSelected) {
        newArr = arr.filter((a) => a !== dappName);
      }
    } else if (isSelected) {
      newArr.push(dappName);
    }
    return newArr;
  };

  const onSelectChange = (item, value) => {
    const newData = data.map((d) => ({
      ...d,
      isSelected: d.account === item.account ? value : d.isSelected,
    }));
    const selectedIndex = newData.findIndex((d) => d.isSelected);
    if (selectedIndex > -1) {
      setDisabledBtn(false);
    } else {
      setDisabledBtn(true);
    }
    setData(newData);
  };
  const onSave = () => {
    if (disabledBtn) return;
    getLocalWallets(
      networkId,
      (wallets) => {
        getLocalPassword(
          (accountPassword) => {
            const newWallets = wallets.map((wallet: any) => {
              const newWallet = { ...wallet };
              const selectedWallet = data.find((d) => d.account === decryptKey(wallet.account, accountPassword));
              if (selectedWallet) {
                newWallet.connectedSites = getSelectConnectedSites(newWallet.connectedSites, domain, selectedWallet.isSelected);
              }
              return newWallet;
            });
            setLocalWallets(networkId, newWallets);
            setStep(2);
            getLocalSelectedNetwork(
              (n) => {
                if (n.networkId === networkId) {
                  const newStateWallets = newWallets.map((w) => ({
                    account: decryptKey(w.account, accountPassword),
                    publicKey: decryptKey(w.publicKey, accountPassword),
                    secretKey: decryptKey(w.secretKey, accountPassword),
                    connectedSites: w.connectedSites,
                  }));
                  setWallets(newStateWallets);
                  getLocalSelectedWallet(
                    (w) => {
                      const selectedWallet =
                        newWallets.find((d) => decryptKey(w.account, accountPassword) === decryptKey(d.account, accountPassword)) || {};
                      if (selectedWallet && selectedWallet.account) {
                        getLocalActiveDapps(
                          (activeDapps) => {
                            const newActiveDapps = activeDapps || [];
                            if (!newActiveDapps.includes(domain)) {
                              newActiveDapps.push(domain);
                            }
                            setLocalActiveDapps(newActiveDapps, () => {
                              const currentWallet = {
                                account: decryptKey(selectedWallet.account, accountPassword),
                                publicKey: decryptKey(selectedWallet.publicKey, accountPassword),
                                secretKey: decryptKey(selectedWallet.secretKey, accountPassword),
                                connectedSites: selectedWallet.connectedSites,
                              };
                              setCurrentWallet(currentWallet);
                              setLocalSelectedWallet({ ...w, connectedSites: selectedWallet.connectedSites });
                            });
                          },
                          () => {
                            const newActiveDapps = [domain];
                            setLocalActiveDapps(newActiveDapps, () => {
                              const currentWallet = {
                                account: decryptKey(selectedWallet.account, accountPassword),
                                publicKey: decryptKey(selectedWallet.publicKey, accountPassword),
                                secretKey: decryptKey(selectedWallet.secretKey, accountPassword),
                                connectedSites: selectedWallet.connectedSites,
                              };
                              setCurrentWallet(currentWallet);
                              setLocalSelectedWallet({ ...w, connectedSites: selectedWallet.connectedSites });
                              const result = {
                                status: 'success',
                                message: 'Connected successfully',
                                account: {
                                  account: decryptKey(selectedWallet.account, accountPassword),
                                  publicKey: decryptKey(selectedWallet.publicKey, accountPassword),
                                },
                              };
                              updateConnectMessage(result, tabId);
                            });
                          },
                        );
                      }
                    },
                    () => {},
                  );
                }
              },
              () => {},
            );
          },
          () => {},
        );
      },
      () => {},
    );
  };

  const onClose = () => {
    window.close();
  };

  const onReject = () => {
    const result = {
      status: 'fail',
      message: 'Connect fail',
    };
    updateConnectMessage(result, tabId);
    setTimeout(() => {
      window.close();
    }, 500);
  };
  const getCheckboxLabel = (item) => (
    <Label>
      <AccountName>{shortenAddress(item.account)}</AccountName>
      <br />
      {shortenAddress(item.publicKey)}
    </Label>
  );

  const renderCheckbox = (item) => (
    <CheckboxWrapper>
      <Radio key={item.account} isChecked={item.isSelected} onClick={() => onSelectChange(item, !item.isSelected)} label={getCheckboxLabel(item)} />
    </CheckboxWrapper>
  );
  return (
    <Wrapper>
      {step > 1 ? (
        <CompleteWrapper>
          <ConnectItem>
            <Div>
              <Image src={icon} alt="logo" />
            </Div>
            <CenterImage src={images.connectedDapps} alt="logo" />
            <Div>
              <Image src={images.eckoWalletLogoRounded} alt="logo" />
            </Div>
          </ConnectItem>
          <ConnectItem alignTop>
            <Div>{domain}</Div>
            <Div>eckoWALLET extension</Div>
          </ConnectItem>
          <ConnectInfo>{`${domain} would like to connect to your account`}</ConnectInfo>
          <div>
            <SecondaryLabel>
              This site is requesting access to view your current account address. Always make sure you trust the sites you interact with.
            </SecondaryLabel>
          </div>
          <ConnectFooterWrapper>
            <Button size="full" label="Close" onClick={onClose} />
          </ConnectFooterWrapper>
        </CompleteWrapper>
      ) : (
        <>
          <Logo src={images.eckoWalletLogoRounded} alt="logo" />
          <DappDescription>{domain}</DappDescription>
          <DappTitle>Connect with eckoWALLET</DappTitle>
          <DappDescription>Connect all wallets</DappDescription>
          <Brick />
          {data.length > 0 ? (
            <>
              <ContentWrapper>{data.map((item) => renderCheckbox(item))}</ContentWrapper>
              <DivFlex padding="24px" gap="10px">
                <Button size="full" label="Cancel" variant="disabled" onClick={onReject} />
                <Button size="full" label="Save" onClick={onSave} isDisabled={disabledBtn} />
              </DivFlex>
            </>
          ) : (
            <NoData>No imported wallets in this network</NoData>
          )}
        </>
      )}
    </Wrapper>
  );
};

export default ConnectedDapp;
