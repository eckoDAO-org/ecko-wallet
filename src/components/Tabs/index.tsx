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
    border: 1px solid #461A57;
    box-sizing: border-box;
    border-radius: 10px;
    margin: 20px;
    justify-content: center;
    align-items: center;
`;

const TabHeader = styled.div`
  width: ${(props) => props.width}%;
  text-align: center;
  ${(props) => (props.isActive
    ? 'color: #FFFFFF;font-weight: bold;font-size: 12px; border: 1px solid #461A57; font-weight: 700; background: #461A57; border-radius: 10px;'
    : 'color: #461A57; font-weight: 700; font-size: 12px;')};
  cursor: pointer;
  height: 36px;
  line-height: 36px;
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
          <TabHeader
            key={item.id}
            isActive={item.id === activeTab}
            width={tabWidth}
            onClick={() => setActiveTab(item.id)}
          >
            {item.title}
          </TabHeader>
        ))}
      </Header>
      {renderContent()}
    </Wrapper>
  );
};

export default Tabs;
