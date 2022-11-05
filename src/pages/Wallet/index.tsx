import { useHistory } from 'react-router-dom';
import images from 'src/images';
import { ReactComponent as SearchIconSVG } from 'src/images/search.svg';
import { ReactComponent as AddIconSVG } from 'src/images/add-round.svg';
import styled from 'styled-components';
import Button from 'src/components/Buttons';
import Spinner from 'src/components/Spinner';
import { Header } from 'src/components/Header';
import { toast } from 'react-toastify';
import Toast from 'src/components/Toast/Toast';
import { DivBottomShadow, DivFlex, PrimaryLabel, SecondaryLabel } from 'src/components';
import { ConfirmModal } from 'src/components/ConfirmModal';
import { IconButton } from 'src/components/IconButton';
import { ActionList } from 'src/components/ActionList';
import { roundNumber, BigNumberConverter } from 'src/utils';
import { extractDecimal } from 'src/utils/chainweb';
import { useCurrentWallet } from 'src/stores/wallet/hooks';
import useLocalStorage from 'src/hooks/useLocalStorage';
import { useModalContext } from 'src/contexts/ModalContext';
import { useAccountBalanceContext } from 'src/contexts/AccountBalanceContext';
import ReceiveModal from './views/ReceiveModal';
import { IFungibleToken, LOCAL_KEY_FUNGIBLE_TOKENS } from '../ImportToken';
import { TokenElement } from './components/TokenElement';
import { TokenChainBalance } from './components/TokenChainBalance';
import { AssetsList } from './components/AssetsList';

export interface IFungibleTokenBalance {
  contractAddress: string;
  symbol: string;
  chainBalance: number;
  allChainBalance: number;
}

interface ChainDistribution {
  chainId: number;
  balance: number;
}

const DivAsset = styled.div`
  padding: 20px;
  margin-bottom: 60px;
`;
const DivAssetList = styled.div`
  .token-element {
    border-top: 1px solid #dfdfed;
  }
  .token-element:first-child {
    border-top: none;
  }
`;

const Wallet = () => {
  const history = useHistory();
  const { openModal, closeModal } = useModalContext();
  const { isLoadingBalances, selectedAccountBalance, allAccountsBalance, usdPrices } = useAccountBalanceContext();
  const [fungibleTokens, setFungibleTokens] = useLocalStorage<IFungibleToken[]>(LOCAL_KEY_FUNGIBLE_TOKENS, [
    { contractAddress: 'kaddex.kdx', symbol: 'kdx' },
  ]);

  const stateWallet = useCurrentWallet();

  const getTokenTotalBalance = (contractAddress: string, account: string): number => {
    const accountChainBalance = allAccountsBalance && allAccountsBalance[account];
    return accountChainBalance?.reduce((prev, curr) => prev + ((curr && extractDecimal(curr[contractAddress])) || 0), 0) || 0;
  };

  const getUsdPrice = (tokenSymbol, tokenBalance): number => {
    const usdPrice = usdPrices[tokenSymbol] || 0;
    return BigNumberConverter(Number(tokenBalance) * Number(usdPrice)) || 0;
  };

  const getAccountBalance = (account: string) => {
    const totalTokenUSD =
      fungibleTokens?.reduce((prev, curr) => prev + getUsdPrice(curr.contractAddress, getTokenTotalBalance(curr.contractAddress, account) || 0), 0) ??
      0;

    return totalTokenUSD + getUsdPrice('coin', getTokenTotalBalance('coin', account) || 0);
  };

  const getTokenChainDistribution = (contractAddress: string): ChainDistribution[] =>
    selectedAccountBalance?.map((b: any, i) => ({ chainId: i, balance: (b && extractDecimal(b[contractAddress])) || 0 })) ?? [];

  const getAllChainUsdBalance = () => {
    let totalUSDBalance = 0;
    allAccountsBalance &&
      Object.keys(allAccountsBalance).forEach((account) => {
        totalUSDBalance += getAccountBalance(account);
      });

    return totalUSDBalance;
  };

  const handleRemoveToken = (contractAddress) => {
    const newFungibleTokens = fungibleTokens?.filter((ft) => ft.contractAddress !== contractAddress) ?? [];
    setFungibleTokens([...newFungibleTokens]);
    toast.success(<Toast type="success" content="Token successfully removed" />);
    closeModal();
  };

  const renderChainDistribution = (symbol: string, contractAddress: string) => (
    <div style={{ padding: 20 }}>
      {getTokenChainDistribution(contractAddress)
        .filter((cD) => cD.balance > 0)
        .map((cD) => (
          <TokenChainBalance
            name={symbol}
            contractAddress={contractAddress}
            chainId={cD.chainId}
            balance={cD.balance}
            usdBalance={getUsdPrice(contractAddress, cD.balance)}
          />
        ))}
      {['coin', 'kaddex.kdx'].every((add) => add !== contractAddress) && (
        <ActionList
          actions={[
            {
              src: images.settings.iconTrash,
              label: 'Remove token',
              onClick: () =>
                openModal({
                  title: `Remove ${symbol.toUpperCase()} token`,
                  content: (
                    <ConfirmModal
                      text={`Are you sure you want remove ${symbol.toUpperCase()} token?`}
                      onClose={closeModal}
                      onConfirm={() => handleRemoveToken(contractAddress)}
                    />
                  ),
                }),
            },
            {
              src: images.settings.iconEdit,
              label: 'Edit token',
              onClick: () => {
                closeModal();
                history.push(`/import-token?coin=${contractAddress}`);
              },
            },
          ]}
        />
      )}
    </div>
  );

  return (
    <div>
      <Header />
      <DivFlex justifyContent="space-between" padding="15px 20px">
        <SecondaryLabel>NET WORTH</SecondaryLabel>
        <SecondaryLabel color="black">
          {isLoadingBalances ? <Spinner size={10} color="black" weight={2} /> : `$ ${roundNumber(getAllChainUsdBalance(), 2)}`}
        </SecondaryLabel>
      </DivFlex>
      <DivBottomShadow justifyContent="center" flexDirection="column" alignItems="center" padding="20px">
        <SecondaryLabel>ACCOUNT BALANCE</SecondaryLabel>
        <PrimaryLabel>$ {roundNumber(getAccountBalance(stateWallet?.account), 2)}</PrimaryLabel>
        <DivFlex gap="5%" style={{ width: '100%', marginTop: 30 }}>
          <Button
            onClick={() => history.push('/transfer?coin=kda&chainId=0')}
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
            variant="secondary"
            size="full"
          />
        </DivFlex>
      </DivBottomShadow>
      <DivAsset>
        <DivFlex justifyContent="space-between">
          <SecondaryLabel style={{ paddingTop: 10 }}>ASSETS</SecondaryLabel>
          <DivFlex>
            <IconButton onClick={() => openModal({ title: 'Token list', content: <AssetsList /> })} svgComponent={<SearchIconSVG />} />
            <IconButton onClick={() => history.push('/import-token')} svgComponent={<AddIconSVG />} style={{ marginLeft: 5 }} />
          </DivFlex>
        </DivFlex>
        <DivAssetList>
          <TokenElement
            balance={getTokenTotalBalance('coin', stateWallet?.account)}
            name="KDA"
            usdBalance={roundNumber(getUsdPrice('coin', getTokenTotalBalance('coin', stateWallet?.account)), 2)}
            logo={images.wallet.tokens.coin}
            onClick={() => openModal({ title: 'KDA Chain Distribution', content: renderChainDistribution('kda', 'coin') })}
          />
          <TokenElement
            balance={getTokenTotalBalance('kaddex.kdx', stateWallet?.account)}
            name="KDX"
            usdBalance={roundNumber(getUsdPrice('kaddex.kdx', getTokenTotalBalance('kaddex.kdx', stateWallet?.account)), 2)}
            logo={images.wallet.tokens['kaddex.kdx']}
            onClick={() => openModal({ title: 'KDX Chain Distribution', content: renderChainDistribution('kdx', 'kaddex.kdx') })}
          />
          {fungibleTokens
            ?.filter((fT) => fT.contractAddress !== 'kaddex.kdx')
            ?.map((fT) => {
              const tokenBalance = getTokenTotalBalance(fT.contractAddress, stateWallet?.account);
              return (
                <TokenElement
                  balance={tokenBalance || 0}
                  name={fT.symbol?.toUpperCase()}
                  usdBalance={roundNumber(getUsdPrice(fT.contractAddress, tokenBalance || 0), 2)}
                  logo={images.wallet.tokens[fT.contractAddress] || images.wallet.tokens.coin}
                  onClick={() => {
                    openModal({
                      title: `${fT.symbol?.toUpperCase()} Chain Distribution`,
                      content: renderChainDistribution(fT.symbol, fT.contractAddress),
                    });
                  }}
                />
              );
            })}
        </DivAssetList>
      </DivAsset>
    </div>
  );
};
export default Wallet;
