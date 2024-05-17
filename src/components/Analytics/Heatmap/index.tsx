import { useTokensPerformance } from 'src/hooks/tokensPerformance';
import styled from 'styled-components';
import TimeSelector from '../TimeSelector';
import { LabeledContainer } from '../UI';
import Treemap from './Treemap';

const Container = styled.div`
  width: 100%;
  height: 450px;
`;

const Heatmap = () => {
  const tokens = useTokensPerformance();
  console.log(`🚀 ~ tokens:`, tokens);
  return (
    <LabeledContainer label="HEATMAP">
      <Container>
        <Treemap />
      </Container>
      <TimeSelector />
    </LabeledContainer>
  );
};

export default Heatmap;
