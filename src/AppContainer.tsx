import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Switch, Redirect, Route } from 'react-router-dom';
import Footer from './components/Footer';
import WalletCreator from './components/WalletCreator';
import CreatePassword from './pages/CreatePassword';
import HomePage from './pages/Home';
import Condition from './pages/Condition';
import SignIn from './pages/SignIn';
import InitPage from './pages/InitPage';
import ImportAccount from './pages/ImportWallet';
import Wallet from './pages/Wallet';
import importToken from './pages/ImportToken';
import SendTransactions from './pages/SendTransactions';
import PageSetting from './pages/Setting';
import PageContact from './pages/Setting/Contact';
import PageNetworks from './pages/Setting/Networks';
import PrivateRoute from './components/Route/PrivateRoute';
import Loading from './components/Loading';
import ConnectedDapp from './pages/Dapps/ConnectedDapp';
import DappTransfer from './pages/SendTransactions/DappTransfer';
import DappSignIn from './pages/Dapps/DappSignIn';
import LoginDapp from './pages/SignIn/LoginDapp';
import DappPrivateRoute from './components/Route/DappPrivateRoute';
import SignedCmd from './pages/Dapps/SignedCmd';
import QuickSignedCmd from './pages/Dapps/QuickSignedCmd';
import SeedPhrase from './pages/SeedPhrase';
import InitSeedPhrase from './pages/InitSeedPhrase';
import ExportSeedPhrase from './pages/Setting/ExportSeedPhrase';
import EditPassword from './pages/Setting/EditPassword';
import TwoFactorAuth from './pages/Setting/TwoFactorAuth';
import History from './pages/History';
import Nft from './pages/Nft';
import PageTransaction from './pages/Setting/Transaction';
import PageLockSettings from './pages/Setting/Lock';
import PageSelectTheme from './pages/Setting/SelectTheme';
import PageConnectedSites from './pages/Setting/ConnectedSites';
import TwoFactorAuthenticator from './components/TwoFactorAuthenticator';
import PageWalletConnect from './pages/Setting/WalletConnect';
import BuySimplexCryptocurrencies from './pages/Wallet/views/BuySimplexCryptocurrencies';
import CategoryDetail from './pages/Nft/CategoryDetail';
import ImportHardwareWallet from './pages/ImportHardwareWallet';
import ImportLedger from './pages/ImportHardwareWallet/ImportLedger';
import GovernanceMining from './pages/GovernanceMining';
import MarmaladeNGCollectionDetails from './pages/Nft/NftTypes/MarmaladeNG/MarmaladeNGCollectionDetails';
import TransactionsImporter from './components/TransactionsImporter';
import Analytics from './pages/Analytics';
import AnalyticsTracker from './components/AnalyticsTracker';

const Container = styled.div`
  width: 1000px;
  background: ${(props) => props.theme?.background || 'white'};
  box-shadow: 0 0 7px 7px rgb(0 0 0 / 8%);
  min-height: 100vh;
  @media screen and (max-width: 1024px) {
    margin-bottom: 0;
    width: 100%;
    box-shadow: none;
  }
`;

const AppContainer = () => {
  const rootState = useSelector((state) => state);
  const { isLoading } = rootState.extensions;
  return (
    <Container>
      <TwoFactorAuthenticator>
        <Switch>
          <Route isSignIn path="/sign-in" component={SignIn} />
          <PrivateRoute isFirstInstall path="/create-password" component={CreatePassword} />
          <PrivateRoute isFirstInstall path="/home-page" component={HomePage} />
          <PrivateRoute isFirstInstall path="/term-condition" component={Condition} />
          <PrivateRoute isFirstInstall path="/init-seed-phrase" component={InitSeedPhrase} />
          <PrivateRoute isSeedPhrase isSignIn path="/seed-phrase" component={SeedPhrase} />
          <PrivateRoute path="/export-seed-phrase" component={ExportSeedPhrase} />
          <PrivateRoute path="/edit-password" component={EditPassword} />
          <PrivateRoute path="/2fa" component={TwoFactorAuth} />
          <PrivateRoute path="/import-wallet" component={ImportAccount} />
          <PrivateRoute path="/import-hardware-wallet" component={ImportHardwareWallet} />
          <PrivateRoute path="/import-from-ledger" component={ImportLedger} />
          <PrivateRoute path="/import-token" component={importToken} />
          <PrivateRoute path="/transfer" component={SendTransactions} />
          <PrivateRoute path="/init" component={InitPage} />
          <DappPrivateRoute path="/connected-dapps" component={ConnectedDapp} />
          <DappPrivateRoute path="/sign-dapps" component={DappSignIn} />
          <DappPrivateRoute path="/signed-cmd" component={SignedCmd} />
          <DappPrivateRoute path="/quick-signed-cmd" component={QuickSignedCmd} />
          <Route isSignIn path="/login-dapps" component={LoginDapp} />
          <DappPrivateRoute path="/dapps-transfer" component={DappTransfer} />
          <PrivateRoute path="/contact" component={PageContact} />
          <PrivateRoute path="/networks" component={PageNetworks} />
          <PrivateRoute path="/connected-sites" component={PageConnectedSites} />
          <PrivateRoute path="/tx-settings" component={PageTransaction} />
          <PrivateRoute path="/lock-settings" component={PageLockSettings} />
          <PrivateRoute path="/select-theme" component={PageSelectTheme} />
          <PrivateRoute path="/wallet-connect" component={PageWalletConnect} />
          <PrivateRoute path="/setting" component={PageSetting} />
          <PrivateRoute path="/history" component={History} />
          <PrivateRoute path="/buy/simplex" component={BuySimplexCryptocurrencies} />
          <PrivateRoute path="/nft" component={Nft} />
          <PrivateRoute path="/nft-details" component={CategoryDetail} />
          <PrivateRoute path="/ng-details" component={MarmaladeNGCollectionDetails} />
          <PrivateRoute path="/governance-mining" component={GovernanceMining} />
          <PrivateRoute path="/analytics" component={Analytics} />
          <PrivateRoute path="/" component={Wallet} />
          <Redirect to="/" />
        </Switch>
        <Footer />
        {isLoading && <Loading />}
        <WalletCreator />
        <TransactionsImporter />
        <AnalyticsTracker />
      </TwoFactorAuthenticator>
    </Container>
  );
};

export default AppContainer;
