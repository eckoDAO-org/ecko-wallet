import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  &:hover .tooltip-text {
    visibility: visible;
  }
  .tooltip-text {
    visibility: hidden;
    width: 300px;
    font-weight: 400;
    background-color: #461A57;
    color: #fff;
    text-align: center;
    border-radius: 4px;
    padding: 10px;
  
    position: absolute;
    z-index: 999999;
    left: -50px;
    top: 22px;
    @media screen and (max-width: 480px){
      width: 200px;
    }
  }
`;
type Props = {
  children: any;
  tooltipText: string;
};

const Tooltip = (props: Props) => {
  const { children, tooltipText } = props;
  return (
    <Wrapper>
      {children}
      <span className="tooltip-text">
        {tooltipText}
      </span>
    </Wrapper>
  );
};

export default Tooltip;
