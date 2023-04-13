import { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useSettingsContext } from 'src/contexts/SettingsContext';

type Props = {
  component: any;
  path: string;
  isFirstInstall?: boolean;
  isSignIn?: boolean;
  isHome?: boolean;
  isSeedPhrase?: boolean;
};

const FetchingWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
`;

const PrivateRoute = (props: Props) => {
  const { component: Component, path, isFirstInstall, isSignIn, isHome, isSeedPhrase } = props;
  const rootState = useSelector((state) => state);
  const { isLocked } = useSettingsContext();
  const { extensions, wallet } = rootState;
  const { passwordHash, isFetching, isHaveSeedPhrase } = extensions;
  const isLoggedIn = !isLocked;
  const hasPassword = !!passwordHash;
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!isFetching) {
      setLoading(false);
    }
  }, [isFetching]);
  if (loading) return <FetchingWrapper />;

  let RenderComponent = <Component />;
  if (!hasPassword && isHaveSeedPhrase) {
    RenderComponent = <Redirect to="/sign-in" />;
  } else if (!isHaveSeedPhrase) {
    if (passwordHash) {
      if (!isSeedPhrase) {
        RenderComponent = <Redirect to="/seed-phrase" />;
      }
    } else if (!isFirstInstall) {
      RenderComponent = <Redirect to="/home-page" />;
    }
  } else if (isFirstInstall && passwordHash) {
    if (isLoggedIn) {
      RenderComponent = <Redirect to="/" />;
    } else {
      RenderComponent = <Redirect to="/sign-in" />;
    }
  } else if (!passwordHash && !isFirstInstall) {
    RenderComponent = <Redirect to="/home-page" />;
  } else if (passwordHash && !isLoggedIn) {
    if (!isSignIn) {
      RenderComponent = <Redirect to="/sign-in" />;
    }
  } else if (isSeedPhrase && isHaveSeedPhrase) {
    if (isLoggedIn) {
      RenderComponent = <Redirect to="/" />;
    } else {
      RenderComponent = <Redirect to="/sign-in" />;
    }
  }

  return <Route path={path} render={() => RenderComponent} />;
};

export default PrivateRoute;
