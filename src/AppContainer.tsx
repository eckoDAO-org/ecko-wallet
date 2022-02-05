import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Switch, Redirect, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CreatePassword from './pages/CreatePassword';
import HomePage from './pages/Home';
import Condition from './pages/Condition';
import SignIn from './pages/SignIn';
import InitPage from './pages/InitPage';
import GenerateAccount from './pages/GenerateAccount';
import ImportAccount from './pages/ImportWallet';
import Wallet from './pages/Wallet';
import importToken from './pages/ImportToken';
import SendTransactions from './pages/SendTransactions';
import PageSetting from './pages/Setting';
import PageContact from './pages/Setting/Contact';
import PageNetworks from './pages/Setting/Networks';
import PageAbout from './pages/Setting/About';
import PrivateRoute from './components/Route/PrivateRoute';
import Loading from './components/Loading';
import ConnectedDapp from './pages/Dapps/ConnectedDapp';
import DappTransfer from './pages/SendTransactions/DappTransfer';
import DappSignIn from './pages/Dapps/DappSignIn';
import LoginDapp from './pages/SignIn/LoginDapp';
import DappPrivateRoute from './components/Route/DappPrivateRoute';
import SignedCmd from './pages/Dapps/SignedCmd';
import SeedPhrase from './pages/SeedPhrase';
import InitSeedPhrase from './pages/InitSeedPhrase';
import ExportSeedPhrase from './pages/Setting/ExportSeedPhrase';
import History from './pages/Wallet/views/History';
import TokenMenu from './pages/TokenMenu';

const Container = styled.div`
  width: 1000px;
  box-shadow: 0 0 7px 7px rgb(0 0 0 / 8%);
  min-height: 100vh;
  background: linear-gradient(90deg, #e6fefe 0%, #fdf6e6 100%);
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
      <Header />
      <Switch>
        <PrivateRoute isFirstInstall path="/create-password" component={CreatePassword} />
        <PrivateRoute isFirstInstall path="/home-page" component={HomePage} />
        <PrivateRoute isFirstInstall path="/term-condition" component={Condition} />
        <PrivateRoute isFirstInstall path="/init-seed-phrase" component={InitSeedPhrase} />
        <PrivateRoute isSeedPhrase isSignIn path="/seed-phrase" component={SeedPhrase} />
        <PrivateRoute path="/export-seed-phrase" component={ExportSeedPhrase} />
        <PrivateRoute isSignIn path="/sign-in" component={SignIn} />
        <PrivateRoute path="/generate-account" component={GenerateAccount} />
        <PrivateRoute path="/import-wallet" component={ImportAccount} />
        <PrivateRoute path="/import-token" component={importToken} />
        <PrivateRoute path="/transfer" component={SendTransactions} />
        <PrivateRoute path="/init" component={InitPage} />
        <DappPrivateRoute path="/connected-dapps" component={ConnectedDapp} />
        <DappPrivateRoute path="/sign-dapps" component={DappSignIn} />
        <DappPrivateRoute path="/signed-cmd" component={SignedCmd} />
        <Route isSignIn path="/login-dapps" component={LoginDapp} />
        <DappPrivateRoute path="/dapps-transfer" component={DappTransfer} />
        <PrivateRoute path="/contact" component={PageContact} />
        <PrivateRoute path="/networks" component={PageNetworks} />
        <PrivateRoute path="/about" component={PageAbout} />
        <PrivateRoute path="/setting" component={PageSetting} />
        <PrivateRoute path="/token-menu" component={TokenMenu} />
        <PrivateRoute path="/history" component={History} />
        <PrivateRoute isHome path="/" component={Wallet} />
        <Redirect to="/" />
      </Switch>
      <Footer />
      {isLoading && <Loading type="spin" color="#461A57" />}
    </Container>
  );
};

export default AppContainer;
