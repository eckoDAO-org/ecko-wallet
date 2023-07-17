import { DivFlex } from 'src/components';
import styled from 'styled-components';

export const NftPageContainer = styled.div`
  padding: 10px;
  text-align: center;
  margin-bottom: 60px;
`;

export const NftContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
export const NftTableRow = styled(DivFlex)`
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  width: 100%;
  max-width: 300px;
`;
