import styled from 'styled-components';
import { DivFlex } from 'src/components';
import StatusFilter, { StatusFilterProps } from './Status';
import TokenFilter, { TokenFilterProps } from './Token';

const Div = styled(DivFlex)`
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme?.border};
  justify-content: space-between;
`;

const Filters = ({
  status,
  onChangeStatus,
  token,
  onChangeToken,
}: Props) => (
  <Div>
    <StatusFilter status={status} onChangeStatus={onChangeStatus} />
    <TokenFilter token={token} onChangeToken={onChangeToken} />
  </Div>
);

type Props = StatusFilterProps & TokenFilterProps;

export default Filters;
