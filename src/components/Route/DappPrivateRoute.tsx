import { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const FetchingWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
  background: linear-gradient(90deg, #E6FEFE 0%, #FDF6E6 100%);
`;
type Props = {
  component: any;
  path: string;
}
const DappPrivateRoute = (props: Props) => {
  const {
    component: Component,
    path,
  } = props;
  const rootState = useSelector((state) => state);
  const { extensions } = rootState;
  const { expiredTime, isFetching } = extensions;
  const isLoggedIn = expiredTime;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFetching) {
      setLoading(false);
    }
  }, [isFetching]);
  if (loading) return <FetchingWrapper />;

  let RenderComponent = <Component />;
  if (!isLoggedIn) {
    RenderComponent = <Redirect to={{ pathname: '/login-dapps', state: { from: path } }} />;
  }

  return (
    <Route
      path={path}
      render={() => RenderComponent}
    />
  );
};

export default DappPrivateRoute;
