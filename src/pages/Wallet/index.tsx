import { useState, useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import images from 'src/images';
import styled from 'styled-components';
import ModalCustom from 'src/components/Modal/ModalCustom';
import Dropdown from 'src/components/Dropdown';
import { roundNumber, shortenAddress, BigNumberConverter, getCoingeckoIdFromContractAddress } from 'src/utils';
import { useCurrentWallet } from 'src/stores/wallet/hooks';
import useLocalStorage from 'src/hooks/useLocalStorage';
import { useSelector } from 'react-redux';
import { setBalance, setCurrentWallet, setWallets } from 'src/stores/wallet';
import { toast } from 'react-toastify';
import Toast from 'src/components/Toast/Toast';
import { ESTIMATE_KDA_TO_USD_API } from 'src/utils/config';
import { CHAIN_COUNT, KNOWN_TOKENS } from 'src/utils/constant';
import { getLocalPassword, getLocalSeedPhrase, getLocalWallets, setLocalSelectedWallet, setLocalWallets } from 'src/utils/storage';
import { decryptKey, encryptKey } from 'src/utils/security';
import { fetchListLocal, getBalanceFromChainwebApiResponse, getKeyPairsFromSeedPhrase } from '../../utils/chainweb';
import LoadMoreDropdown from './views/LoadMoreDropdown';
import ReceiveModal from './views/ReceiveModal';
import ChainDropdown from './views/ChainDropdown';
import { IFungibleToken } from '../ImportToken';

export interface IFungibleTokenBalance {
  contractAddress: string;
  symbol: string;
  chainBalance: number;
  allChainBalance: number;
}

const Div = styled.div`
  margin: auto 0;
  font-size: ${(props) => props.fontSize};
  margin-right: ${(props) => props.marginRight};
  text-align: ${(props) => props.textAlign};
  color: ${(props) => props.color};
  margin-left: ${(props) => props.marginLeft};
  font-weight: ${(props) => props.fontWeight};
  margin-top: ${(props) => props.marginTop};
  margin-bottom: ${(props) => props.marginBottom};
`;
const DivChild = styled.div`
  font-size: ${(props) => props.fontSize};
  color: ${(props) => props.color};
  margin-top: ${(props) => props.marginTop};
  margin-left: ${(props) => props.marginLeft};
  margin-right: ${(props) => props.marginRight};
  margin-bottom: ${(props) => props.marginBottom};
  font-weight: ${(props) => props.fontWeight};
`;
const Account = styled.div`
  text-align: center;
  position: relative;
`;
const DivHeaderAccount = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px 0;
`;
const DivChildChain = styled.div`
  display: flex;
  align-items: center;
`;
const DivHeader = styled.div`
  display: block;
`;
const Hr = styled.div`
  background: linear-gradient(90deg, #d2ab72 0%, #b66e84 35.42%, #b2579b 64.06%, #9ee9e4 99.48%);
  height: 4px;
  margin: 30px 20px;
`;
const DivWrapper = styled.div`
  display: block;
  cursor: pointer;
  border: 1px solid #461a57;
  box-sizing: border-box;
  border-radius: 10px;
  background: ${(props) => props.background};
  width: 100%;
  padding: 5px 20px;
`;
const LableAccount = styled.div`
  font-weight: 700;
  font-size: 16px;
  color: #461a57;
  padding: 5px;
  text-align: left;
`;
const DivFlex = styled.div`
  display: flex;
  justify-content: ${(props) => props.justifyContent};
  margin-bottom: ${(props) => props.marginBottom};
  margin-left: ${(props) => props.marginLeft};
  align-items: ${(props) => props.alignItems};
  margin: ${(props) => props.margin};
  margin-top: ${(props) => props.marginTop};
  gap: ${(props) => props.gap}; ;
`;
const Image = styled.img<{ size: string; top: string; width: string }>`
  height: ${($props) => $props.size};
  width: ${($props) => ($props.width ? $props.width : $props.size)};
  margin: auto;
  cursor: ${(props) => props.cursor};
  margin-top: ${(props) => props.marginTop};
`;
const WalletImage = styled.img`
  ${(props) => (props.isChecked ? 'margin-left: auto' : '')};
  width: ${(props) => (props.isChecked ? '14px' : '24px')};
  height: ${(props) => (props.isChecked ? '12px' : '24px')};
`;

const LoadMore = styled.div``;
const TitleSelectChain = styled.div`
  border: 1px solid #461a57;
  border-radius: 20px;
  padding: 10px 18px;
  margin-right: 23px;
  background: #e2d5e1;
`;
const LinearBackground = styled.div`
  background: linear-gradient(90deg, #e6fefe 0%, #fdf6e6 100%);
  padding-top: 15px;
`;
const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const WalletOption = styled.div`
  padding: 20px 20px 10px 15px;
  border-top: 1px solid #ffffff80;
`;
const DivChildKadena = styled.div`
  border: 1px solid #461a57;
  border-radius: 8px;
  margin: 0 20px;
`;
const Transaction = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
`;
const ImageBorder = styled(Image)`
  border-radius: 50%;
`;
const Tokens = styled.div`
  margin-bottom: 20px;
`;
const ImportAccountWrapper = styled.div`
  display: flex;
  cursor: pointer;
`;
const CreateAccountWrapper = styled.div`
  display: flex;
  cursor: pointer;
  margin-bottom: 20px;
`;
const WalletWrapper = styled.div`
  padding: 0 0 10px 0;
  display: flex;
  align-items: center;
  cursor: pointer;
  line-height: 20px;
  text-align: left;
`;
const AddMoreToken = styled.div`
  display: flex;
  justify-content: center;
`;
const DivText = styled.div`
  display: inline-block;
  border-radius: 18px;
  border: 1px solid #461a57;
  color: #461a57;
  font-size: 12px;
  padding: 11px 24px;
  cursor: pointer;
`;
const ListWallet = styled.div`
  padding: 15px 20px;
  max-height: 250px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  &::-webkit-scrollbar-thumb {
    background: #7b7b7b9e;
    border-radius: 2px;
  }
`;
const TitleSetting = styled.div`
  padding: 10px 20px;
  border-bottom: 1px solid #ffffff80;
  font-size: 20px;
  font-weight: 700;
  text-align: left;
`;
const WrapAssets = styled.div``;
const Wallet = () => {
  const history = useHistory();
  const rootState = useSelector((state) => state);
  const { selectedNetwork, passwordHash } = rootState.extensions;
  const location = useLocation().pathname;
  const { balance, wallets } = rootState?.wallet;
  const [isShowReceiveModal, setShowReceiveModal] = useState(false);
  const [usdPrices, setUsdPrices] = useState<any[]>([]);
  const [fungibleTokensBalance, setFungibleTokensBalance] = useState<IFungibleTokenBalance[]>([]);
  const [allChainBalance, setAllChainBalance] = useState(0);
  const [fungibleTokens] = useLocalStorage<IFungibleToken[]>('fungibleTokens', []);
  const stateWallet = useCurrentWallet();
  const walletDropdownRef = useRef();

  const fetchCoinBalance = async (fungibleToken: IFungibleToken, chainArray: number[]) => {
    const { account, chainId } = stateWallet;
    const { contractAddress, symbol } = fungibleToken;
    const promiseList: any[] = [];
    const pactCode = `(${contractAddress}.details "${account}")`;
    chainArray.forEach((i) => {
      const promise = fetchListLocal(pactCode, selectedNetwork.url, selectedNetwork.networkId, i.toString());
      promiseList.push(promise);
    });
    let total = 0;
    Promise.all(promiseList)
      .then((res) => {
        res?.forEach((fetched, chainIndex) => {
          // if (fetched?.result?.data?.account === account) {
          const resBalance = getBalanceFromChainwebApiResponse(fetched);
          if (contractAddress === 'coin') {
            total += resBalance;
            if (chainId.toString() === chainIndex.toString()) {
              setBalance(resBalance);
            }
          } else {
            setFungibleTokensBalance((fungibleTokensBalance1) => [
              ...(fungibleTokensBalance1.filter((fTB) => fTB.contractAddress !== contractAddress) ?? []),
              {
                contractAddress,
                symbol,
                chainBalance: resBalance ?? 0,
                allChainBalance: 0,
              },
            ]);
          }
        });
        if (contractAddress === 'coin') {
          setAllChainBalance(total);
        }
      })
      .catch();
  };

  useEffect(() => {
    if (stateWallet?.account) {
      fetchCoinBalance({ contractAddress: 'coin', symbol: 'KDA' }, [...Array(CHAIN_COUNT).keys()]);
    }
  }, [stateWallet?.account]);

  useEffect(() => {
    const { chainId } = stateWallet;
    if (fungibleTokens?.length && stateWallet?.account) {
      // selected chain only for fungible tokens
      fungibleTokens.forEach((fT) => fetchCoinBalance(fT, [chainId]));
    }
  }, [fungibleTokens, stateWallet?.account, stateWallet?.chainId]);

  const checkSelectedWallet = (wallet) => wallet.account === stateWallet.account;
  const setSelectedLocalWallet = (wallet) => {
    getLocalPassword(
      (accountPassword) => {
        const newWallet = {
          account: encryptKey(wallet.account, accountPassword),
          publicKey: encryptKey(wallet.publicKey, accountPassword),
          secretKey: encryptKey(wallet.secretKey, accountPassword),
          chainId: wallet.chainId,
          connectedSites: wallet.connectedSites,
        };
        setLocalSelectedWallet(newWallet);
      },
      () => {},
    );
  };

  const goImportAccount = () => {
    history.push({
      pathname: '/import-wallet',
      state: { from: location },
    });
    (walletDropdownRef as any).current.hideDropdownContent();
  };

  const checkWallet = (pub) => {
    let result = true;
    if (wallets && wallets.length) {
      for (let i = 0; i < wallets.length; i += 1) {
        if (wallets[i].publicKey === pub) {
          result = false;
        }
      }
    }
    return result;
  };
  const onCreateAccount = () => {
    getLocalSeedPhrase(
      (hash) => {
        const plainSeedPhrase = decryptKey(hash, passwordHash);
        createAccount(plainSeedPhrase, 0);
      },
      () => {},
    );
  };
  const createAccount = (seedPhrase, index) => {
    const keyPairs = getKeyPairsFromSeedPhrase(seedPhrase, index);
    const { publicKey, secretKey } = keyPairs;
    if (checkWallet(publicKey)) {
      const accountName = `k:${publicKey}`;
      const wallet = {
        account: encryptKey(accountName, passwordHash),
        publicKey: encryptKey(publicKey, passwordHash),
        secretKey: encryptKey(secretKey, passwordHash),
        chainId: '0',
        connectedSites: [],
      };
      getLocalWallets(
        selectedNetwork.networkId,
        (item) => {
          const newData = [...item, wallet];
          setLocalWallets(selectedNetwork.networkId, newData);
        },
        () => {
          setLocalWallets(selectedNetwork.networkId, [wallet]);
        },
      );
      const newStateWallet = {
        chainId: '0',
        account: accountName,
        publicKey,
        secretKey,
        connectedSites: [],
      };
      const newWallets = stateWallet.wallets ? [...stateWallet.wallets] : [];
      newWallets.push(newStateWallet);
      setWallets(newWallets);
      setLocalSelectedWallet(wallet);
      setCurrentWallet(newStateWallet);
      toast.success(<Toast type="success" content="Create account successfully!" />);
      (walletDropdownRef as any).current.hideDropdownContent();
    } else {
      createAccount(seedPhrase, index + 1);
    }
  };

  const groupedAccountWallets = wallets.filter((value, index, self) => index === self.findIndex((t) => t.account === value.account));

  const overlayDropdownSetting = (
    <Div>
      <TitleSetting>Wallets</TitleSetting>
      {groupedAccountWallets.length > 0 && !location.includes('init') && (
        <ListWallet>
          {groupedAccountWallets.map((wallet: any) => {
            const isSelected = checkSelectedWallet(wallet);
            return (
              <WalletWrapper
                key={`${wallet.account}-${wallet.chainId}`}
                onClick={() => {
                  if (!isSelected) {
                    setSelectedLocalWallet(wallet);
                    setCurrentWallet(wallet);
                    setBalance(0);
                    history.push('/');
                    (walletDropdownRef as any).current.hideDropdownContent();
                  }
                }}
              >
                <WalletImage src={images.logoHome} alt="check-box" />
                <DivChild fontSize="13px" marginLeft="22px">
                  <DivChild>{shortenAddress(wallet.account)}</DivChild>
                </DivChild>
                {isSelected && <WalletImage isChecked src={images.checkbox} alt="check-box" />}
              </WalletWrapper>
            );
          })}
        </ListWallet>
      )}
      <WalletOption>
        <CreateAccountWrapper onClick={onCreateAccount}>
          <DivChild marginRight="20px">
            <Image src={images.wallet.iconCreate} alt="create" size={20} width={20} />
          </DivChild>
          <DivChild fontSize="16px" fontWeight="400">
            Create wallet
          </DivChild>
        </CreateAccountWrapper>
        <ImportAccountWrapper onClick={goImportAccount}>
          <DivChild marginRight="20px">
            <Image src={images.received} alt="import" size={20} width={20} />
          </DivChild>
          <DivChild fontSize="16px" fontWeight="400">
            Import wallet
          </DivChild>
        </ImportAccountWrapper>
      </WalletOption>
    </Div>
  );

  const updateUsdPrices = () => {
    const coingeckoIds: any = [];
    fungibleTokens?.forEach((tok) => {
      const coingeckId = getCoingeckoIdFromContractAddress(tok?.contractAddress);
      if (coingeckId) {
        coingeckoIds.push(KNOWN_TOKENS[tok?.contractAddress]?.coingeckoId);
      }
    });
    fetch(`${ESTIMATE_KDA_TO_USD_API}${coingeckoIds.join(',')}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setUsdPrices(
            Object.keys(result).map((token) => ({
              symbol: token,
              usdPrice: result[token].usd,
            })),
          );
        },
        () => {},
      );
  };

  const getUsdPrice = (tokenSymbol, tokenBalance): number => {
    const usdPrice = usdPrices.find((t) => t.symbol === tokenSymbol)?.usdPrice;
    return BigNumberConverter(Number(tokenBalance) * Number(usdPrice)) || 0;
  };

  useEffect(() => {
    updateUsdPrices();
  }, [stateWallet?.chainId, stateWallet?.account, fungibleTokensBalance, allChainBalance]);

  const TokenChild = (props: any) => {
    const { value, src, valueUSD, tokenType, nameToken, containerStyle, onClick } = props;
    return (
      <Div marginBottom="10px" onClick={onClick} style={containerStyle}>
        <DivChildKadena>
          <Transaction>
            <DivFlex alignItems="center">
              <ImageBorder size="50px" src={src} alt="logo" />
              <DivChild marginLeft="15px">
                <Div fontSize="16px" fontWeight="700" color="#461A57">
                  {tokenType}
                </Div>
                <Div fontSize="14px" color="#461A57" marginTop="5px">
                  {nameToken}
                </Div>
              </DivChild>
            </DivFlex>
            <DivChild>
              <Div fontSize="16px" fontWeight="700" color="#461A57" textAlign="right">
                {value}
              </Div>
              <Div fontSize="14px" color="#461A57" marginTop="10px" textAlign="right">
                {valueUSD && `$${roundNumber(valueUSD, 1)}`}
              </Div>
            </DivChild>
          </Transaction>
        </DivChildKadena>
      </Div>
    );
  };
  return (
    <Div>
      <Account>
        <DivHeaderAccount>
          <DivHeader>
            <LableAccount>Account Name</LableAccount>
            <DivFlex marginLeft="6px">
              <Dropdown overlayDropdown={overlayDropdownSetting} placement="right" ref={walletDropdownRef} trianglePosition="44px" translate="-58%">
                <FlexWrapper>
                  <DivChild marginRight="10px" fontSize="13px">
                    {shortenAddress(stateWallet?.account)}
                  </DivChild>
                  <Div
                    marginRight="10px"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigator.clipboard.writeText(stateWallet?.account);
                      toast.success(<Toast type="success" content="Copied!" />);
                    }}
                  >
                    <Image width="12px" cursor="pointer" src={images.wallet.copyGray} alt="copy-gray" />
                  </Div>
                  <Image width="12px" cursor="pointer" src={images.wallet.iconDropDown} alt="dropdown-icon" />
                </FlexWrapper>
              </Dropdown>
            </DivFlex>
          </DivHeader>
          <DivChildChain>
            <DivChild marginBottom="20px" marginTop="20px">
              <Dropdown placement="left" translate="-58%" trianglePosition="50px" overlayDropdown={<ChainDropdown />}>
                <TitleSelectChain>
                  <DivFlex justifyContent="center" alignItems="center">
                    <DivChild marginRight="5px" color="#461A57" fontSize="12px">{`Chain ID ${stateWallet?.chainId}`}</DivChild>
                    <Image alt="dropdown" src={images.wallet.arrayDropdownPurple} />
                  </DivFlex>
                </TitleSelectChain>
              </Dropdown>
            </DivChild>
            <LoadMore>
              <LoadMoreDropdown
                stateWallet={stateWallet}
                networkId={selectedNetwork?.networkId}
                explorer={selectedNetwork?.explorer}
                passwordHash={passwordHash}
              />
            </LoadMore>
          </DivChildChain>
        </DivHeaderAccount>
        <LinearBackground>
          <DivChildKadena>
            <DivFlex alignItems="center" justifyContent="space-between" margin="10px">
              <DivChild>
                <Image src={images.wallet.logoWalletKadena} size={50} width={50} alt="logo" />
              </DivChild>
              <DivChild>
                <Div fontSize="16px" fontWeight="700" color="#461A57" textAlign="right">{`${roundNumber(balance ?? 0, 5)} KDA`}</Div>
                <Div fontSize="12px" fontWeight="700" color="#461A57" textAlign="right">{`${roundNumber(allChainBalance ?? 0, 5)} KDA`}</Div>
                <Div fontSize="14px" color="#461A57" marginTop="10px" textAlign="right">
                  {`${roundNumber(getUsdPrice('kadena', balance ?? 0), 1)} USD`}
                </Div>
                <Div fontSize="10px" color="#461A57" marginTop="1px" textAlign="right">
                  {`${roundNumber(getUsdPrice('kadena', allChainBalance ?? 0), 1)} USD`}
                </Div>
              </DivChild>
            </DivFlex>
          </DivChildKadena>
          <DivFlex alignItems="center" margin="20px" gap="10px">
            <DivWrapper background="#461A57" marginRight="10px">
              <DivChild onClick={() => history.push('/transfer?coin=kda')}>
                <DivFlex justifyContent="center">
                  <Div marginRight="10px">
                    <Image src={images.wallet.iconSend} alt="send" />
                  </Div>
                  <Div fontSize="12px" color="#FFFFFF" fontWeight="700">
                    Send
                  </Div>
                </DivFlex>
              </DivChild>
            </DivWrapper>
            <DivWrapper background="white" marginLeft="10px">
              <DivChild onClick={() => setShowReceiveModal(true)}>
                <DivFlex justifyContent="center">
                  <Div marginRight="10px">
                    <Image src={images.wallet.iconReceive} alt="download" />
                  </Div>
                  <Div fontSize="12px" color="#461A57" fontWeight="700">
                    Receive
                  </Div>
                </DivFlex>
              </DivChild>
            </DivWrapper>
          </DivFlex>
        </LinearBackground>
      </Account>
      <Hr />
      <DivChild marginTop="15px" marginBottom="80px">
        <WrapAssets>
          <Tokens>
            <TokenChild
              value={balance}
              tokenType="KDA"
              nameToken="Kadena"
              valueUSD={roundNumber(getUsdPrice('kadena', balance), 1)}
              src={images.wallet.iconKadenaToken}
            />
            {fungibleTokens?.map((fT) => {
              const tokenBalance = fungibleTokensBalance.find((f) => f.contractAddress === fT.contractAddress);
              return (
                <TokenChild
                  value={tokenBalance?.chainBalance ?? 0}
                  tokenType={fT.symbol?.toUpperCase()}
                  valueUSD={
                    getCoingeckoIdFromContractAddress(fT.contractAddress) &&
                    getUsdPrice(getCoingeckoIdFromContractAddress(fT.contractAddress), tokenBalance?.chainBalance || 0)
                  }
                  src={images.wallet.tokens[fT.symbol] || images.wallet.tokens.token}
                  containerStyle={{ cursor: 'pointer' }}
                  onClick={() => history.push(`/token-menu?coin=${fT.symbol}`)}
                />
              );
            })}
          </Tokens>
          <AddMoreToken>
            <DivText onClick={() => history.push('/import-token')}>Add more tokens</DivText>
          </AddMoreToken>
        </WrapAssets>
      </DivChild>
      <ModalCustom isOpen={false} title="Confirm Send Transaction" closeOnOverlayClick={false} />
      <ReceiveModal isOpen={isShowReceiveModal} title="Receive" onCloseModal={() => setShowReceiveModal(false)} closeOnOverlayClick={false} />
    </Div>
  );
};
export default Wallet;
