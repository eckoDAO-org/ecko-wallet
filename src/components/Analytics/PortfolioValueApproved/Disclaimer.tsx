import styled from 'styled-components';
import { ReactComponent as InfoIconSVG } from 'src/images/info.svg';

const Container = styled.div`
  padding: 10px;
  display: flex;
  svg {
    margin-right: 10px;
    path {
      fill: #ffa900;
    }
  }
`;

const Info = styled.div`
  width: calc(100% - 32px);
`;

const InfoCaption = styled.div`
  text-align: left;
  font-size: 12px;
  padding-bottom: 8px;
  font-weight: bold;
`;
const InfoText = styled.div`
  text-align: left;
  font-size: 11px;
  font-weight: normal;
`;

const Disclaimer = () => (
  <Container>
    <InfoIconSVG />
    <Info>
      <InfoCaption>Info!</InfoCaption>
      <InfoText>The information displayed on this page is currently under BETA testing, and is provided on an &quot;as is&quot; and &quot;as available&quot; basis.</InfoText>
    </Info>
  </Container>
);

export default Disclaimer;
