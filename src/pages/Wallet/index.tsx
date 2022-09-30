import { useState, useEffect, useRef, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import moment from 'moment';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import images from 'src/images';
import { ReactComponent as SearchIconSVG } from 'src/images/search.svg';
import { ReactComponent as AddIconSVG } from 'src/images/add-round.svg';
import styled from 'styled-components';
import Button from 'src/components/Buttons';
import { DivFlex, PrimaryLabel, SecondaryLabel } from 'src/components';
import { DropdownModal } from 'src/components/DropdownModal';
import { IconButton } from 'src/components/IconButton';
import { roundNumber, shortenAddress, BigNumberConverter, humanReadableNumber } from 'src/utils';
import { useCurrentWallet } from 'src/stores/wallet/hooks';
import useLocalStorage from 'src/hooks/useLocalStorage';
import { useSelector } from 'react-redux';
import { setBalance, setCurrentWallet, setWallets } from 'src/stores/wallet';
import { toast } from 'react-toastify';
import Toast from 'src/components/Toast/Toast';
import { ModalContext } from 'src/contexts/ModalContext';
import { TxSettingsContext } from 'src/contexts/TxSettingsContext';
import { ESTIMATE_KDA_TO_USD_API, KADDEX_ANALYTICS_API } from 'src/utils/config';
import { CHAIN_COUNT } from 'src/utils/constant';
import { getLocalPassword, getLocalSeedPhrase, getLocalWallets, setLocalSelectedWallet, setLocalWallets } from 'src/utils/storage';
import { decryptKey, encryptKey } from 'src/utils/security';
import { fetchListLocal, getKeyPairsFromSeedPhrase } from '../../utils/chainweb';
import ReceiveModal from './views/ReceiveModal';
import { IFungibleToken } from '../ImportToken';
import { TokenElement } from './components/TokenElement';

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

const DivBalance = styled(DivFlex)`
  box-shadow: 0px 167px 67px rgba(36, 8, 43, 0.01), 0px 94px 57px rgba(36, 8, 43, 0.03), 0px 42px 42px rgba(36, 8, 43, 0.06),
    0px 10px 23px rgba(36, 8, 43, 0.06), 0px 0px 0px rgba(36, 8, 43, 0.07);
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
  padding-bottom: 24px;
`;

const HeaderWallet = styled(DivFlex)`
  padding: 20px;
  border-bottom: 1px solid #dfdfed;
`;

const DivAsset = styled.div`
  padding: 35px 20px;
  margin-bottom: 40px;
`;
const DivAssetList = styled.div`
  .token-element {
    border-top: 1px solid #dfdfed;
  }
  .token-element:first-child {
    border-top: none;
  }
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

const Wallet = () => {
  const history = useHistory();
  const rootState = useSelector((state) => state);
  const { data: txSettings } = useContext(TxSettingsContext);
  const { openModal } = useContext(ModalContext);
  const { selectedNetwork, passwordHash } = rootState.extensions;
  const location = useLocation().pathname;
  const { balance, wallets } = rootState?.wallet;
  const [usdPrices, setUsdPrices] = useState<any[]>([]);
  const [balances, setBalances] = useState<any[]>([]);
  console.log('🚀 !!! ~ balances', balances);
  const [allChainBalance, setAllChainBalance] = useState(0);
  const [fungibleTokens, , getFungibleTokensAsync] = useLocalStorage<IFungibleToken[]>('fungibleTokens', [
    { contractAddress: 'kaddex.kdx', symbol: 'kdx' },
  ]);
  const stateWallet = useCurrentWallet();
  const { account, chainId } = stateWallet;
  const walletDropdownRef = useRef();

  const fetchAllBalances = (fts: IFungibleToken[] | null = fungibleTokens) => {
    const promiseList: any[] = [];
    [...Array(CHAIN_COUNT).keys()].forEach((i) => {
      const pactCode = `
      (
        let* (
              (coin-balance (try 0.0 (coin.get-balance "${account}")))
              ${fts
                ?.map((ft) => `(${ft.contractAddress.replace(/\./g, '')} (try 0.0 (${ft.contractAddress}.get-balance "${account}")))`)
                .join('\n')}              
             )
        {"coin": coin-balance, ${fts?.map((ft) => `"${ft.contractAddress}": ${ft.contractAddress.replace(/\./g, '')}`)}}
      )`;
      const promise = fetchListLocal(
        pactCode,
        selectedNetwork.url,
        selectedNetwork.networkId,
        i.toString(),
        txSettings?.gasPrice,
        txSettings?.gasLimit,
      );
      promiseList.push(promise);
    });
    Promise.all(promiseList).then((allRes) => {
      console.log('🚀 !!! ~ allRes', allRes);
      const allChainBalances = allRes.map((chainBalance) => chainBalance?.result?.data);
      setBalances(allChainBalances);
      setBalance(allChainBalances[chainId]?.coin ?? 0);
    });
  };

  const getTokenTotalBalance = (contractAddress: string): number =>
    balances?.reduce((prev, curr) => prev + ((curr && curr[contractAddress]) || 0), 0);

  useEffect(() => {
    if (stateWallet?.account) {
      getFungibleTokensAsync().then((fts) => {
        console.log('🚀 !!! ~ fts', fts);
        fetchAllBalances(fts);
        updateUsdPrices(fts);
      });
    }
  }, [stateWallet?.account]);

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
                <Jazzicon diameter={24} seed={jsNumberForAddress(wallet?.account)} />
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

  const updateUsdPrices = (fts: IFungibleToken[] | null = fungibleTokens) => {
    const promises: Promise<Response>[] = [
      fetch(
        `${KADDEX_ANALYTICS_API}?dateStart=${moment().subtract(3, 'days').format('YYYY-MM-DD')}&dateEnd=${moment().format(
          'YYYY-MM-DD',
        )}&currency=USDT&asset=KDA`,
      ),
    ];
    fts?.forEach((tok) => {
      promises.push(
        fetch(
          `${KADDEX_ANALYTICS_API}?dateStart=${moment().subtract(3, 'days').format('YYYY-MM-DD')}&dateEnd=${moment().format(
            'YYYY-MM-DD',
          )}&currency=coin&asset=${tok?.contractAddress}`,
        ),
      );
    });
    Promise.all(promises)
      .then((results) => Promise.all(results.map((r) => r.json())))
      .then((candlesData) => {
        const tokenPrices = candlesData.map((candleAnalytics) => {
          const lastCandle = candleAnalytics?.pop();
          const asset = lastCandle?.pairName?.split('/')[0];
          return {
            symbol: asset?.toLowerCase(),
            usdPrice: lastCandle?.usdPrice?.close || lastCandle?.price?.close || 0,
          };
        });
        setUsdPrices(tokenPrices);
      });
    fetch(`${ESTIMATE_KDA_TO_USD_API}kadena`)
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
  const totalUSD =
    fungibleTokens?.reduce((prev, curr) => prev + getUsdPrice(curr.contractAddress, getTokenTotalBalance(curr.contractAddress) || 0), 0) ?? 0;
  const accountBalance = totalUSD + getUsdPrice('kda', getTokenTotalBalance('coin') || 0);

  return (
    <div>
      <HeaderWallet justifyContent="space-between">
        <DropdownModal title="Mainnet" modalTitle="Networks" modalContent={<span>ciao</span>} />
        <DropdownModal
          title={
            <DivFlex>
              <Jazzicon diameter={24} seed={jsNumberForAddress(stateWallet?.account)} />{' '}
              <span style={{ color: '#787B8E', marginLeft: 5 }}>{shortenAddress(stateWallet?.account)}</span>{' '}
            </DivFlex>
          }
          iconComponent={<img src={images.moreIcon} style={{ width: 14, marginTop: 10 }} />}
          iconContainerStyle={{ padding: 0 }}
          containerStyle={{ border: 'none' }}
          modalTitle="Select Account"
          modalContent={overlayDropdownSetting}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigator.clipboard.writeText(stateWallet?.account);
            toast.success(<Toast type="success" content="Copied!" />);
          }}
        />
      </HeaderWallet>
      <DivFlex justifyContent="space-between" padding="20px">
        <SecondaryLabel>net worth</SecondaryLabel>
        <SecondaryLabel color="black">$200.00</SecondaryLabel>
      </DivFlex>
      <DivBalance justifyContent="center" flexDirection="column" alignItems="center" padding="20px">
        <SecondaryLabel>account balance</SecondaryLabel>
        <PrimaryLabel>$ {humanReadableNumber(accountBalance, 2)}</PrimaryLabel>
        <DivFlex gap="5%" style={{ width: '100%', marginTop: 30 }}>
          <Button
            onClick={() => {}}
            label={
              <DivFlex justifyContent="center">
                <img src={images.wallet.arrowSend} style={{ width: 16, marginRight: 10 }} />
                <span>Send</span>
              </DivFlex>
            }
            size="full"
          />
          <Button
            onClick={() => openModal({ title: 'Receive tokens', content: <ReceiveModal /> })}
            label={
              <DivFlex justifyContent="center">
                <img src={images.wallet.arrowSend} style={{ width: 16, marginRight: 10, transform: 'scale(1, -1)' }} />
                <span>Receive</span>
              </DivFlex>
            }
            type="secondary"
            size="full"
          />
        </DivFlex>
      </DivBalance>
      <DivAsset>
        <DivFlex justifyContent="space-between">
          <SecondaryLabel style={{ paddingTop: 10 }}>Assets</SecondaryLabel>
          <DivFlex>
            <IconButton onClick={() => {}} svgComponent={<SearchIconSVG />} />
            <IconButton onClick={() => history.push('/import-token')} svgComponent={<AddIconSVG />} style={{ marginLeft: 5 }} />
          </DivFlex>
        </DivFlex>
        <DivAssetList>
          <TokenElement
            balance={getTokenTotalBalance('coin')}
            name="KDA"
            usdBalance={roundNumber(getUsdPrice('kda', getTokenTotalBalance('coin')), 2)}
            logo={images.wallet.tokens.coin}
          />
          <TokenElement
            balance={getTokenTotalBalance('kaddex.kdx')}
            name="KDX"
            usdBalance={roundNumber(getUsdPrice('kaddex.kdx', getTokenTotalBalance('kaddex.kdx')), 2)}
            logo={images.wallet.tokens['kaddex.kdx']}
            // onClick={() => history.push('/transfer?coin=kdx')}
          />
          {fungibleTokens
            ?.filter((fT) => fT.contractAddress !== 'kaddex.kdx')
            ?.map((fT) => {
              const tokenBalance = getTokenTotalBalance(fT.contractAddress);
              return (
                <TokenElement
                  balance={tokenBalance || 0}
                  name={fT.symbol?.toUpperCase()}
                  usdBalance={roundNumber(getUsdPrice(fT.contractAddress, tokenBalance || 0), 2)}
                  logo={images.wallet.tokens[fT.contractAddress] || images.wallet.tokens.coin}
                  // onClick={() => history.push(`/token-menu?coin=${fT.symbol}`)}
                />
              );
            })}
        </DivAssetList>
      </DivAsset>
    </div>
  );

  /**
  return (
    <Div>
      <Account>
        <DivHeaderAccount>
          <DivFlex marginLeft="6px">
            <DropdownModal title="Mainnet" modalTitle="Networks" modalContent={<span>ciao</span>} />
            <Dropdown overlayDropdown={overlayDropdownSetting} placement="right" ref={walletDropdownRef} trianglePosition="44px" translate="-58%">
              <FlexWrapper>
                <DivChild marginRight="10px" fontSize="13px">
                  <Jazzicon diameter={24} seed={jsNumberForAddress(stateWallet?.account)} /> {shortenAddress(stateWallet?.account)}
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
        </DivHeaderAccount>
        <LinearBackground>
          <DivChildKadena>
            <DivFlex alignItems="center" justifyContent="space-between" margin="10px">
              <DivChild>
                <Image src={images.wallet.logoWalletKadena} size={50} width={50} alt="logo" />
              </DivChild>
              <DivChild>
                <Div fontSize="16px" fontWeight="700" color="#461A57" textAlign="right">{`${humanReadableNumber(balance ?? 0, 5)} KDA`}</Div>
                <Div fontSize="12px" fontWeight="700" color="#461A57" textAlign="right">{`${roundNumber(allChainBalance ?? 0, 5)} KDA`}</Div>
                <Div fontSize="14px" color="#461A57" marginTop="10px" textAlign="right">
                  {`${roundNumber(getUsdPrice('kda', balance ?? 0), 2)} USD`}
                </Div>
                <Div fontSize="10px" color="#461A57" marginTop="1px" textAlign="right">
                  {`${roundNumber(getUsdPrice('kda', allChainBalance ?? 0), 2)} USD`}
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
              <DivChild onClick={() => openModal({ title: 'Receive tokens', content: <ReceiveModal /> })}>
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
              value={humanReadableNumber(getTokenTotalBalance('coin') ?? 0, 5)}
              tokenType="KDA"
              nameToken="Kadena"
              valueUSD={roundNumber(getUsdPrice('kda', getTokenTotalBalance('coin')), 2)}
              src={images.wallet.tokens.coin}
            />
            <TokenChild
              value={humanReadableNumber(getTokenTotalBalance('kaddex.kdx') ?? 0 ?? 0, 5)}
              tokenType="KDX"
              nameToken="Kaddex"
              valueUSD={roundNumber(getUsdPrice('kaddex.kdx', getTokenTotalBalance('kaddex.kdx') ?? 0 ?? 0), 2)}
              src={images.wallet.tokens['kaddex.kdx']}
              containerStyle={{ cursor: 'pointer' }}
              onClick={() => history.push('/transfer?coin=kdx')}
            />
            {fungibleTokens
              ?.filter((fT) => fT.contractAddress !== 'kaddex.kdx')
              ?.map((fT) => {
                const tokenBalance = getTokenTotalBalance(fT.contractAddress);
                return (
                  <TokenChild
                    value={humanReadableNumber(tokenBalance ?? 0, 5) ?? 0}
                    tokenType={fT.symbol?.toUpperCase()}
                    valueUSD={getUsdPrice(fT.contractAddress, tokenBalance || 0)}
                    src={images.wallet.tokens[fT.contractAddress] || images.wallet.tokens.coin}
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
    </Div>
  );
*/
};
export default Wallet;
