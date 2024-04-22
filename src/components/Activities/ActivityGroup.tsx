import styled from 'styled-components';
import moment from 'moment';
import { SecondaryLabel } from 'src/components';
import FinishTransferItem from 'src/components/Activities/FinishTransferItem';
import { LocalActivity } from './types';

const Div = styled.div`
  cursor: pointer;
`;

const DayLabel = styled(SecondaryLabel)`
  display: block;
  margin-top: 24px;
  padding: 0 24px;
  font-size: 12px;
  font-weight: 700;
`;

const compareByCreatedTime = (a: LocalActivity, b: LocalActivity) => {
  const timeA = moment(a.createdTime, 'ddd MMM DD YYYY HH:mm:ss ZZ');
  const timeB = moment(b.createdTime, 'ddd MMM DD YYYY HH:mm:ss ZZ');
  return timeB.unix() - timeA.unix();
};

interface Props {
  label: string;
  activities: LocalActivity[];
  pendingCrossChainRequestKeys: string[];
  openActivityDetail: (activity: LocalActivity) => void;
}

const ActivityGroup = ({
  label,
  activities,
  pendingCrossChainRequestKeys,
  openActivityDetail,
}: Props) => (
  <>
    <DayLabel uppercase>{label}</DayLabel>
    {activities.sort(compareByCreatedTime).map((item) => {
      if (!item || !item.receiverChainId) return null;
      return (
        <Div key={`${item.requestKey}${item.direction}${item.sender}${item.receiver}`} style={{ padding: '0px 24px' }} onClick={() => openActivityDetail(item)}>
          <FinishTransferItem
            isFinishing={pendingCrossChainRequestKeys.includes(item.requestKey)}
            activity={item}
          />
        </Div>
      );
    })}
  </>
);

export default ActivityGroup;
