import images from 'src/images';
import styled from 'styled-components';

type Props = {
  title: string;
  style?: any;
  onBack: any;
}
const Header = styled.div`
  margin: 1.5em 0;
`;
const Title = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  display: flex;
  cursor: pointer;
  line-height: 25px;
  text-align: left;
  width: fit-content;
`;
const Img = styled.img`
  height: 16px;
  width: 16px;
  margin-right: 10px;
  margin-top: 4px;
`;
const Back = (props: Props) => {
  const { title = 'Back', style, onBack } = props;
  return (
    <Header style={style}>
      <Title onClick={onBack}>
        <Img src={images.back} />
        {title}
      </Title>
    </Header>
  );
};

export default Back;
