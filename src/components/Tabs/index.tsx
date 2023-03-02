import { useState } from 'react';
import styled from 'styled-components';

type ChildrenTypes = {
  title: string;
  content: any;
  id: number;
};
type Props = {
  children: ChildrenTypes[];
};
const Wrapper = styled.div`
  width: 100%;
`;
const Header = styled.div`
  display: flex;
  background: ${({ theme }) => theme.button.secondary};
  box-sizing: border-box;
  border-radius: 10px;
  margin: 20px;
  justify-content: center;
  align-items: center;
`;

const TabHeader = styled.div`
  width: ${(props) => props.width}%;
  text-align: center;
  font-weight: 500;
  font-size: 14px;
  border-radius: 10px;
  ${(props) =>
    props.isActive
      ? `color: #FFFFFF; border: 1px solid ${props.theme.button.primary}; background: ${props.theme.button.primary};`
      : `color: ${props.theme.footer.primary}`};
  cursor: pointer;
  height: 50px;
  line-height: 50px;
`;
const Tabs = (props: Props) => {
  const { children = [] } = props;
  const [activeTab, setActiveTab] = useState(children[0].id);
  const tabWidth = 100 / children.length;
  const renderContent = () => {
    const element = children.find((item) => item.id === activeTab);
    if (!element) return <div />;
    return element.content;
  };

  return (
    <Wrapper>
      <Header>
        {children.map((item) => (
          <TabHeader key={item.id} isActive={item.id === activeTab} width={tabWidth} onClick={() => setActiveTab(item.id)}>
            {item.title}
          </TabHeader>
        ))}
      </Header>
      {renderContent()}
    </Wrapper>
  );
};

export default Tabs;
