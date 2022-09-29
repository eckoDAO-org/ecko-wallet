import './App.scss';
import { Provider } from 'react-redux';
import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';
import store from './stores';
import 'react-toastify/dist/ReactToastify.css';
import AppContainer from './AppContainer';
import { ModalProvider, ModalConsumer } from './contexts/ModalContext';
import { CrossChainProvider } from './contexts/CrossChainContext';
import { TxSettingsProvider } from './contexts/TxSettingsContext';
import ModalCustom from './components/Modal/ModalCustom';

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
const ToastWrapper = styled.div`
  .Toastify__toast-theme--colored.Toastify__toast--success {
    background: #45b95e;
    border-radius: 4px;
    border-bottom: 4px solid rgba(0, 0, 0, 0.2);
    width: 95%;
    margin: 10px auto;
  }
  .Toastify__toast-theme--colored.Toastify__toast--error {
    background: #ffa69f;
    border-radius: 4px;
    border-bottom: 4px solid rgba(0, 0, 0, 0.2);
    width: 95%;
    margin: 10px auto;
  }
  .Toastify__toast-container {
    margin-top: 90px;
  }
`;

const App = () => (
  <Provider store={store}>
    <AppWrapper>
      <Content>
        <ModalProvider>
          <ModalConsumer>
            {({ isOpen, title, content, closeModal }) => (
              <ModalCustom isOpen={isOpen || false} title={title} onCloseModal={closeModal}>
                {content}
              </ModalCustom>
            )}
          </ModalConsumer>
          <TxSettingsProvider>
            <CrossChainProvider>
              <AppContainer />
            </CrossChainProvider>
          </TxSettingsProvider>
        </ModalProvider>
      </Content>
    </AppWrapper>
    <ToastWrapper>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        icon={false}
        closeButton={false}
        pauseOnFocusLoss
        draggable
        theme="colored"
        pauseOnHover
      />
    </ToastWrapper>
  </Provider>
);

export default App;
