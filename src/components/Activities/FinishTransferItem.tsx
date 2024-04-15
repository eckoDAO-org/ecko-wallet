import styled from 'styled-components';
import moment from 'moment';
import { ReactComponent as ArrowSendIcon } from 'src/images/arrow-send.svg';
import { ReactComponent as ArrowReceiveIcon } from 'src/images/arrow-receive.svg';
import { shortenAddress } from 'src/utils';
import { CommonLabel, DivFlex, SecondaryLabel } from 'src/components';
import { useFungibleTokensList } from 'src/hooks/fungibleTokens';

export const RoundedArrow = styled.div`
  box-shadow: 0px 167px 67px rgba(36, 8, 43, 0.01), 0px 94px 57px rgba(36, 8, 43, 0.03), 0px 42px 42px rgba(36, 8, 43, 0.06),
    0px 10px 23px rgba(36, 8, 43, 0.06), 0px 0px 0px rgba(36, 8, 43, 0.07);
  border-radius: 30px;
  background: ${({ theme, background }) => background || theme.iconBackground};
  width: 41px;
  height: 41px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
  svg {
    path {
      fill: ${(props) => props.color};
    }
  }
`;

const ActivityElement = styled(DivFlex)`
  border-bottom: 1px solid #dfdfed;
`;

const FinishTransferItem = ({
  createdTime,
  value,
  symbol,
  receiver,
  status,
  isFinishing,
  isIncoming = false,
  module,
}: {
  createdTime: string;
  value: string;
  symbol: string;
  receiver: string;
  status: string;
  isFinishing?: boolean;
  isIncoming?: boolean;
  module?: string;
}) => {
  const tokens = useFungibleTokensList();
  const inferredToken = (tokens.find((t) => t.contractAddress === module))?.symbol || symbol;

  let color = '#ff6058';
  if (status === 'pending' || isFinishing) {
    color = '#ffa500';
  } else if (status === 'success') {
    color = isIncoming ? '#00d395' : '#ff6058';
  }

  const Icon = isIncoming ? ArrowReceiveIcon : ArrowSendIcon;
  const sign = isIncoming ? '+' : '-';

  return (
    <ActivityElement justifyContent="space-between" alignItems="center" padding="10px 0px">
      <DivFlex alignItems="center">
        <RoundedArrow margin="0px 5px 0px 0px" color={color}>
          <Icon />
        </RoundedArrow>
        <DivFlex flexDirection="column" justifyContent="flex-start">
          <CommonLabel fontWeight={700}>{`${shortenAddress(receiver)}`}</CommonLabel>
          <SecondaryLabel>{moment(new Date(createdTime)).format('DD/MM/YYYY HH:mm')}</SecondaryLabel>
        </DivFlex>
      </DivFlex>
      <CommonLabel fontWeight={500} color={color} fontSize={12}>
        {sign} {value} {inferredToken}
      </CommonLabel>
    </ActivityElement>
  );
};

export default FinishTransferItem;
