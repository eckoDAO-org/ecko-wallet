import React, { useState, createContext } from 'react';

interface ModalProps {
  isOpen?: boolean;
  title: React.ReactNode;
  content: React.ReactNode;
  closeOnOverlayClick?: boolean;
}

interface ModalContextProps extends ModalProps {
  openModal: (settings: ModalProps) => void;
  closeModal: () => void;
}

const initialState = {
  isOpen: false,
  title: null,
  content: null,
  closeOnOverlayClick: true,
};

export const ModalContext = createContext<ModalContextProps>({
  ...initialState,
  openModal: () => {},
  closeModal: () => {},
});

export const ModalProvider = ({ children }: any) => {
  const [state, setState] = useState<ModalProps>(initialState);

  const openModal = (settings: ModalProps) => {
    setState((prev) => ({ ...prev, ...settings, isOpen: true }));
  };

  const closeModal = () => {
    setState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <ModalContext.Provider
      value={{
        ...state,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const ModalConsumer = ModalContext.Consumer;

export const withModalContext = (Component) => (props) =>
  <ModalConsumer>{(providerProps) => <Component {...props} modalContextProps={providerProps} />}</ModalConsumer>;
