import styled from 'styled-components';
import Select from 'react-select';
import { memo } from 'react';
import { useAppThemeContext } from 'src/contexts/AppThemeContext';
import { SLabel } from './BaseTextInput';

interface Props {
  title: any;
  options?: object[];
  selectProps?: object;
  height?: string;
  defaultValue?: any;
  isFlex?: boolean;
  placeholder?: string;
}

const BaseSelect = memo(
  ({ title, options = [], defaultValue, selectProps = {}, height = '44px', isFlex, placeholder = 'Select Chain ID' }: Props) => {
    const { theme } = useAppThemeContext();
    return (
      <SDivRoot height={height} isFlex={isFlex}>
        <SLabel>{title}</SLabel>
        <Select
          options={options}
          {...selectProps}
          defaultValue={defaultValue}
          placeholder={placeholder}
          styles={{
            control: (provided) => ({
              ...provided,
              borderColor: '#c4c4c4',
              borderRadius: '8px',
              minHeight: '44px',
              height: '44px',
              background: theme.input?.background,
            }),
            option: (provided, { isSelected }) => ({
              ...provided,
              color: isSelected ? theme.selectMenu?.selectedColor : theme.selectMenu?.color,
              background: isSelected ? theme.selectMenu?.selectedBackground : theme.selectMenu?.background,
              '&:hover': {
                background: '#999999',
              },
            }),
            valueContainer: (provided) => ({
              ...provided,
              height: '44px',
              color: '#20264E',
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
              color: theme.input?.color,
            }),
          }}
          isSearchable={false}
        />
      </SDivRoot>
    );
  },
);

const SDivRoot = styled.div<{ isFlex?: boolean; height?: string }>`
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
    color: ${(props) => props.theme.input.color};
  }
  .css-26l3qy-menu {
    background: ${(props) => props.theme.input.background};
  }
  .css-417lad-placeholder {
    color: ${(props) => props.theme.input.placeholder};
    grid-area: 1 / 1 / 2 / 3;
    margin-left: 2px;
    margin-right: 2px;
    box-sizing: border-box;
  }
`;

export const SText = styled.title<{ isFlex?: boolean }>`
  display: block;
  width: ${(props) => (props.isFlex ? '31%' : '100%')};
  font-size: 16px;
  line-height: 25px;
  margin-bottom: 10px;
  font-weight: 700;
  margin-bottom: 10px;
`;
export default BaseSelect;
