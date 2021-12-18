import React, {
  useEffect, useRef, useState, useImperativeHandle, forwardRef,
} from 'react';
import styled from 'styled-components';

const DropdownCustom = styled.div`
  position: relative;
  display: inline-block;
`;
const DropdownBtn = styled.div`
  cursor: pointer;
`;
const DropdownContent = styled.div`
  margin-top: 10px;
  display: ${(props) => (props.display ? 'block' : 'none')};
  position: absolute;
  overflow: auto;
  z-index: 1;
  min-width: 250px;
  background: rgba(0, 0, 0, 0.8);
  color: #ffffff;
  border-radius: 3px;
  /* transform: translate(-90%); */
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  &::-webkit-scrollbar-thumb {
    background: #7b7b7b9e;
    border-radius: 2px;
  }
  @media screen and (max-width: 480px){
    min-width: 250px;
    bottom: ${(props) => (props.trianglePositionBottom)};
    margin-bottom: 10px;
  } 
  ${(props) => (props.placement === 'center' && 'transform: translate(-30%)')}
  ${(props) => (props.placement === 'left' && (props.translate ? `transform: translate(${props.translate})` : 'transform: translate(-90%)'))}
  ${(props) => (props.placement === 'right' && 'transform: translate(0%)')}
  ${(props) => (props.placement === 'left-dropdown' && 'transform: translate(-65%)')}
`;
const DivChild = styled.div`
  padding: 5px;
`;
const Triangle = styled.div`
  border-color: transparent transparent rgba(0, 0, 0, 0.8) transparent;
  border-style: solid;
  border-width: 0px 10px 10px 10px;
  height: 0px;
  width: 0px;
  right: ${(props) => (props.trianglePosition ? props.trianglePosition : 'auto')};
  position: absolute;
  display: ${(props) => (props.display ? 'block' : 'none')};
  @media screen and (max-width: 480px) {
    bottom: ${(props) => (props.trianglePositionBottom ? props.trianglePositionBottom : 'auto')};
  } 
`;
const Dropdown = forwardRef((props: Props, ref: any) => {
  const {
    children, overlayDropdown, placement, translate, trianglePosition, trianglePositionBottom,
  } = props;
  const [isShow, setIsShow] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>();
  const contenRef = useRef<HTMLDivElement>();
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isShow]);
  const handleClickDropdown = () => {
    setIsShow(!isShow);
  };
  const handleClickOutside = (e: any) => {
    if (dropdownRef?.current && !dropdownRef?.current.contains(e.target)) {
      setIsShow(false);
    }
  };
  useImperativeHandle(ref, () => ({
    hideDropdownContent() {
      setIsShow(false);
    },
  }));
  return (
    <DropdownCustom ref={dropdownRef}>
      <DropdownBtn onClick={handleClickDropdown}>{children}</DropdownBtn>
      <Triangle display={isShow} trianglePosition={trianglePosition} trianglePositionBottom={trianglePositionBottom} />
      <DropdownContent translate={translate} display={isShow} placement={placement} ref={contenRef} trianglePositionBottom={trianglePositionBottom}>
        <DivChild>
          {isShow && overlayDropdown}
        </DivChild>
      </DropdownContent>
    </DropdownCustom>
  );
});
type Props = {
  children?: any;
  overlayDropdown?: any;
  placement: string;
  translate?: string;
  trianglePosition?: string;
  trianglePositionBottom?: string;
}
export default Dropdown;
