import { useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { groupBy } from 'lodash';
import { DivFlex, SecondaryLabel } from 'src/components';
import ActivityGroup from './ActivityGroup';
import Filters from './Filters/index';
import { LocalActivity } from './types';
import { StatusValue } from './Filters/types';

const Div = styled.div`
  cursor: pointer;
`;
const DivChild = styled.div`
  margin-right: ${(props) => props.marginRight};
  color: ${(props) => props.color};
  font-size: ${(props) => props.fontSize};
`;

const DivScroll = styled.div`
  display: block;
`;

interface Props {
  activities: LocalActivity[];
  pendingCrossChainRequestKeys: string[];
  openActivityDetail: (activity: LocalActivity) => void;
}

const List = ({
  activities,
  pendingCrossChainRequestKeys,
  openActivityDetail,
}: Props) => {
  const [status, setStatus] = useState<StatusValue>();

  const filteredActivities = status ? activities.filter(
    (activity) => {
      switch (status) {
        case 'IN':
          return activity.direction === 'IN';
        case 'OUT':
          return activity.direction === 'OUT';
        case 'PENDING':
          return activity.status === 'pending';
        default:
          return true;
      }
    },
  ) : activities;

  const grouped = groupBy(filteredActivities, (activity) => moment(new Date(activity.createdTime)).format('DD/MM/YYYY'));
  const todayString = moment().format('DD/MM/YYYY');
  const yesterdayString = moment().subtract(1, 'days').format('DD/MM/YYYY');

  return (
    <Div>
      <Filters status={status} onChangeStatus={setStatus} />
      {Object.keys(grouped)?.length ? (
        <>
          <DivChild>
            <DivScroll>
              {grouped && grouped[todayString] && (
                <ActivityGroup
                  label="Today"
                  activities={grouped[todayString]}
                  pendingCrossChainRequestKeys={pendingCrossChainRequestKeys}
                  openActivityDetail={openActivityDetail}
                />
              )}

              {grouped && grouped[yesterdayString] && (
                <ActivityGroup
                  label="Yesterday"
                  activities={grouped[yesterdayString]}
                  pendingCrossChainRequestKeys={pendingCrossChainRequestKeys}
                  openActivityDetail={openActivityDetail}
                />
              )}

              {Object.keys(grouped)
                .filter((key) => key !== yesterdayString && key !== todayString)
                .map((date) => (
                  <ActivityGroup
                    key={date}
                    label={moment(date, 'DD/MM/YYYY').format('DD/MM/YYYY')}
                    activities={grouped[date]}
                    pendingCrossChainRequestKeys={pendingCrossChainRequestKeys}
                    openActivityDetail={openActivityDetail}
                  />
                ))}
            </DivScroll>
          </DivChild>
        </>
      ) : (
        <DivFlex marginTop="200px">
          <SecondaryLabel textCenter style={{ flex: 1 }}>
            You have no transactions
          </SecondaryLabel>
        </DivFlex>
      )}
    </Div>
  );
};

export default List;
