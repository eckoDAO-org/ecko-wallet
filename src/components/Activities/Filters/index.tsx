import styled from 'styled-components';
import { DivFlex } from 'src/components';
import StatusFilter, { StatusFilterProps } from './Status';

const Div = styled(DivFlex)`
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme?.border};
`;

const Filters = ({
  status,
  onChangeStatus,
}: Props) => (
  <Div>
    <StatusFilter status={status} onChangeStatus={onChangeStatus} />
  </Div>
);

type Props = StatusFilterProps;

export default Filters;
