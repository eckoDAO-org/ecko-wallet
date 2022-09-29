import styled from 'styled-components';
import Select from 'react-select';
import { memo } from 'react';

interface Props {
  title: any;
  options?: object[];
  selectProps?: object;
  height?: string;
  defaultValue?: any;
  isFlex?: boolean;
  placeholder?: string;
}
const customStyles = {
  control: (provided) => ({
    ...provided,
    borderColor: '#c4c4c4',
    borderRadius: '4px',
    minHeight: '44px',
    height: '44px',
  }),
  option: (provided) => ({
    ...provided,
    color: '#461A57',
    '&:hover': {
      background: '#999999',
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: '44px',
    color: '#461A57',
  }),

  input: (provided) => ({
    ...provided,
    margin: '0px',
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: '44px',
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: 'none',
  }),
  container: (provided) => ({
    ...provided,
    fontSize: '16px',
    flexGrow: 1,
  }),
  placeholder: (defaultStyles) => ({
    ...defaultStyles,
    color: '#cecaca',
  }),
};

const BaseSelect = memo(
  ({ title, options = [], defaultValue, selectProps = {}, height = '44px', isFlex, placeholder = 'Select Chain ID' }: Props) => (
    <SDivRoot height={height} isFlex={isFlex}>
      <SText isFlex={isFlex}>{title}</SText>
      <Select options={options} {...selectProps} defaultValue={defaultValue} placeholder={placeholder} styles={customStyles} isSearchable={false} />
    </SDivRoot>
  ),
);

const SDivRoot = styled.div`
  display: ${(props) => (props.isFlex ? 'flex' : 'block')};
  height: ${(props) => props.height};
  width: 100%;
  justify-content: center;
  margin-bottom: 10px;
  @media screen and (max-width: 480px) {
    margin-bottom: 0;
  }
  .css-8mmkcg {
    margin-right: 8px;
  }
  .css-qc6sy-singleValue {
  }
  .css-417lad-placeholder {
    color: #a187ab;
    grid-area: 1 / 1 / 2 / 3;
    margin-left: 2px;
    margin-right: 2px;
    box-sizing: border-box;
  }
`;

const SText = styled.title`
  display: block;
  width: ${(props) => (props.isFlex ? '31%' : '100%')};
  font-size: 16px;
  line-height: 25px;
  margin-bottom: 10px;
  font-weight: 700;
  margin-bottom: 10px;
`;
export default BaseSelect;
