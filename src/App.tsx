import './App.scss';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import styled from 'styled-components';
import store, { persistor } from './stores';
import 'react-toastify/dist/ReactToastify.css';
import AppContainer from './AppContainer';
import { ModalProvider, ModalConsumer } from './contexts/ModalContext';
import { CrossChainProvider } from './contexts/CrossChainContext';
import { AppThemeProvider } from './contexts/AppThemeContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { AccountBalanceProvider } from './contexts/AccountBalanceContext';
import { GovernanceMiningContextProvider } from './contexts/GovernanceMiningContext';
import ModalCustom from './components/Modal/ModalCustom';
import { LedgerProvider } from './contexts/LedgerContext';
import { NotificationContextProvider } from './contexts/NotificationsContext';
import ToastContainer from './components/ToastContainer';

const AppWrapper = styled.div`
  display: block;
  font-family: 'Montserrat', sans-serif;
  display: flex;
  height: 100%;
  @media screen and (max-width: 1024px) {
    background: none;
  }
`;
const Content = styled.div`
  width: 100%;
  margin: 0 auto;
  border: none;
  display: flex;
  justify-content: center;
  flex: 1 0 auto;
`;

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <AppThemeProvider>
        <AppWrapper>
          <Content>
            <LedgerProvider>
              <ModalProvider>
                <SettingsProvider>
                  <AccountBalanceProvider>
                    <CrossChainProvider>
                      <QueryClientProvider client={queryClient}>
                        <GovernanceMiningContextProvider>
                          <NotificationContextProvider>
                            <ModalConsumer>
                              {({ isOpen, title, content, footer, closeModal, roundIcon }) => (
                                <ModalCustom isOpen={isOpen || false} title={title} footer={footer} onCloseModal={closeModal} roundIcon={roundIcon}>
                                  {content}
                                </ModalCustom>
                              )}
                            </ModalConsumer>
                            <AppContainer />
                          </NotificationContextProvider>
                        </GovernanceMiningContextProvider>
                      </QueryClientProvider>
                    </CrossChainProvider>
                  </AccountBalanceProvider>
                </SettingsProvider>
              </ModalProvider>
            </LedgerProvider>
          </Content>
        </AppWrapper>
        <ToastContainer />
      </AppThemeProvider>
    </PersistGate>
  </Provider>
);

export default App;
