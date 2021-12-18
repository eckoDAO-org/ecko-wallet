import styled from 'styled-components';
import { memo, useState } from 'react';
import images from 'src/images';

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
  onWheel?:any;
  onBlur?:any;
  typeInput?: String;
};
const BaseTextInput = memo(
  ({
    title, inputProps = {}, typeInput, image, height = '44px', isFlex, onChange, numberOptions, onKeyPress, onWheel, onBlur,
  }: Props) => {
    const [type, setType] = useState('password');
    const { readOnly } = inputProps;
    let styles = {
      border: '1px solid #c4c4c4',
      background: 'none',
      color: '#461A57',
    };
    if (readOnly) {
      styles = {
        border: 'none',
        background: 'none',
        color: '#461A57',
      };
    }
    return (
      <SDivRoot height={height} isFlex={isFlex}>
        <SText isFlex={isFlex}>{title}</SText>
        <InputWrapper isFlex={isFlex} readOnly={readOnly}>
          {
            typeInput === 'password' ? (
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
                <ImageWrapper readOnly={readOnly}>
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
            )
          }
          {
            image && <ImageWrapper readOnly={readOnly}><SImage {...image} src={image.src} alt="image" onClick={image.callback} /></ImageWrapper>
          }
          {
            numberOptions && <ImageWrapper readOnly={readOnly}>{numberOptions.content}</ImageWrapper>
          }
        </InputWrapper>
      </SDivRoot>
    );
  },
);

const SDivRoot = styled.div<{ height: string }>`
  display: block;
  height: ${($props) => $props.height};
  ${(props) => (props.isFlex ? 'display: flex' : '')};
  ${(props) => (props.isFlex ? 'margin-bottom: 10px' : '')};
  border-radius: 10px;
  width: 100%;
`;
const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: ${(props) => (props.border ? props.border : '1px solid #c4c4c4')};
  border-radius: 4px;
  ${(props) => (props.isFlex ? 'flex-grow: 1' : '')};
  background: ${(props) => (props.readOnly ? '#EEE6F3' : 'none')};
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
const SText = styled.title`
  display: block;
  font-size: 16px;
  line-height: 19px;
  margin-bottom: ${(props) => (props.isFlex ? '0' : '10px')};
  ${(props) => (props.isFlex ? 'width: 31%' : '')};
  ${(props) => (props.isFlex ? 'align-self: center' : '')};
  color: #461A57;
  font-weight: 700;
`;
const SInput = styled.input`
  width: 100%;
  background: ${(props) => props.background};
  color: ${(props) => props.color};
  box-sizing: border-box;
  font-size: 16px;
  height: 40px;
  padding: 0 0 0 13px;
  font-family: 'Play', sans-serif;
  outline: none;
  border: none;
  &::placeholder{
    color: #A187AB;
  }
`;

export default BaseTextInput;
