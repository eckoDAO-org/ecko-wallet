import { ToastContainer as RTToastContainer } from 'react-toastify';
import styled from 'styled-components';
import { useAppThemeContext } from 'src/contexts/AppThemeContext';

const ToastWrapper = styled.div`
  .Toastify__toast.Toastify__toast--success {
    background: ${({ theme }) => theme.iconBackground};
    border-left: 4px solid #25d366;
    border-radius: 4px;
    width: 90%;
    margin: 10px auto;
  }
  .Toastify__toast.Toastify__toast--error {
    background: ${({ theme }) => theme.iconBackground};
    border-left: 4px solid #e74c3c;
    border-radius: 4px;
    width: 90%;
    margin: 10px auto;
  }
  .Toastify__toast.Toastify__toast--warning {
    background: ${({ theme }) => theme.iconBackground};
    border-left: 4px solid #ffa900;
    border-radius: 4px;
    width: 90%;
    margin: 10px auto;
  }
  .Toastify__toast-container {
    margin-top: 90px;
  }
`;

const ToastContainer = () => {
  const theme = useAppThemeContext();

  return (
    <ToastWrapper>
      <RTToastContainer
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
        theme={theme.theme.isDark ? 'dark' : 'light'}
        pauseOnHover
      />
    </ToastWrapper>
  );
};

export default ToastContainer;
