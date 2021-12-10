import styled from 'styled-components';

type ImageProps = {
  width?: string;
  height?: string;
  src: string;
  callback: () => void;
};
type Props = {
  title: String;
  label: String;
  image?: ImageProps;
};
const BaseInfoDisable = (props: Props) => {
  const {
    image, title, label,
  } = props;
  return (
    <DivRoot>
      <Title>{title}</Title>
      <AdrressBox>
        <AddressText>{label}</AddressText>
        {image && (
        <Image {...image} src={image?.src} alt="copy" onClick={image?.callback} />
        )}
      </AdrressBox>
    </DivRoot>
  );
};
const DivRoot = styled.div``;
const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #444444;
  margin-bottom: 10px;
`;
const AdrressBox = styled.div`
  display: flex;
  gap: 10px;
  justify-content: space-between;
  background: rgb(242, 242, 242);
  color: rgb(104, 104, 104);
  margin: auto 0;
  padding: 12.5px 13px;
  outline: none;
`;
const AddressText = styled.div`
  color: rgb(104, 104, 104);
  word-break: break-word;
  margin: auto 0;
`;
const Image = styled.img<{ size: string; top: string; width: string }>`
  height: ${($props) => $props.size};
  width: ${($props) => ($props.width ? $props.width : $props.size)};
  margin-top: 4px;
  cursor: pointer;
`;
export default BaseInfoDisable;
