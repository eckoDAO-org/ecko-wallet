import React, { memo, useState } from 'react';
import styled from 'styled-components';
import images from 'src/images';
import { SecondaryLabel } from 'src/components';

type ImageProps = {
  width: string;
  height: string;
  src: string;
  callback: () => void;
};
type Props = {
  title: any;
  inputProps?: any;
  height?: string;
  image?: ImageProps;
  isFlex?: boolean;
  onChange?: any;
  numberOptions?: any;
  onKeyPress?: any;
  onWheel?: any;
  onBlur?: any;
  typeInput?: String;
  wrapperStyle?: React.CSSProperties;
};
const BaseTextInput = memo(
  ({
    title,
    inputProps = {},
    typeInput,
    image,
    height = '44px',
    isFlex,
    onChange,
    numberOptions,
    onKeyPress,
    onWheel,
    onBlur,
    wrapperStyle,
  }: Props) => {
    const [type, setType] = useState('password');
    const { readOnly } = inputProps;
    let styles = {
      border: '1px solid #c4c4c4',
      background: 'none',
      color: '#000000',
    };
    if (readOnly) {
      styles = {
        border: 'none',
        background: 'none',
        color: '#787B8E',
      };
    }
    return (
      <SDivRoot height={height} isFlex={isFlex}>
        <SLabel>{title}</SLabel>
        <InputWrapper isFlex={isFlex} readOnly={readOnly} style={wrapperStyle}>
          {typeInput === 'password' ? (
            <>
              <SInput
                {...inputProps}
                border={styles.border}
                background={styles.background}
                color={styles.color}
                onChange={onChange}
                onKeyPress={onKeyPress}
                onWheel={onWheel}
                autoComplete="off"
                onBlur={onBlur}
                type={type}
              />
              <ImageWrapper>
                <SImage
                  src={type === 'password' ? images.initPage.eyeHidden : images.initPage.eye}
                  alt="image"
                  onClick={() => setType(type === 'password' ? 'text' : 'password')}
                />
              </ImageWrapper>
            </>
          ) : (
            <SInput
              {...inputProps}
              border={styles.border}
              background={styles.background}
              color={styles.color}
              onChange={onChange}
              onKeyPress={onKeyPress}
              onWheel={onWheel}
              autoComplete="off"
              onBlur={onBlur}
            />
          )}
          {image && (
            <ImageWrapper>
              <SImage {...image} src={image.src} alt="image" onClick={image.callback} />
            </ImageWrapper>
          )}
          {numberOptions && <ImageWrapper>{numberOptions.content}</ImageWrapper>}
        </InputWrapper>
      </SDivRoot>
    );
  },
);

const SDivRoot = styled.div<{ height?: string; isFlex?: boolean }>`
  display: block;
  height: ${($props) => $props.height};
  ${(props) => (props.isFlex ? 'display: flex' : '')};
  ${(props) => (props.isFlex ? 'margin-bottom: 10px' : '')};
  border-radius: 10px;
  width: 100%;
`;
const InputWrapper = styled.div<{ isFlex?: boolean; readOnly?: boolean; border?: string }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: ${(props) => props.border};
  border-radius: 4px;
  ${(props) => (props.isFlex ? 'flex-grow: 1' : '')};
  background: ${(props) => (props.readOnly ? '#ECECF5' : '#F6F6FA')};
`;
const ImageWrapper = styled.div`
  height: 34px;
  overflow: hidden;
  right: 2px;
  top: 3px;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 14px;
  flex-shrink: 0;
`;
const SImage = styled.img`
  height: ${(props) => props.width};
  width: ${(props) => props.height};
  cursor: pointer;
`;

export const SLabel = styled(SecondaryLabel)`
  line-height: 30px;
  font-weight: 700;
`;

export const SInput = styled.input<{ background: string }>`
  width: 100%;
  background: ${(props) => props.background};
  color: ${(props) => props.color};
  box-sizing: border-box;
  font-size: 16px;
  height: 40px;
  padding: 0 0 0 13px;
  font-family: 'Montserrat', sans-serif;
  outline: none;
  border: none;
  &::placeholder {
    color: #787b8e;
    font-weight: 500;
    font-size: 16px;
  }
`;

export default BaseTextInput;
