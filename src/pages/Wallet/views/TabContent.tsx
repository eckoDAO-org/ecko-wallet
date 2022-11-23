import Tabs from 'src/components/Tabs';
import styled from 'styled-components';
import Activities from './Activities';
import FinishTransfer from './FinishTransfer';
// import Assets from './Assets';

const TabContent = styled.div`
  /* height: 30vh; */
  width: 100%;
`;

const TabWallet = () => {
  const tabList = [
    {
      title: 'Activities',
      id: 1,
      content: <Activities />,
    },
    {
      title: 'Pending',
      id: 2,
      content: <FinishTransfer />,
    },
  ];
  return (
    <TabContent>
      <Tabs>{tabList}</Tabs>
    </TabContent>
  );
};

export default TabWallet;
