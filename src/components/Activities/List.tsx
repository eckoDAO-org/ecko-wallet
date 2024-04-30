import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { groupBy, orderBy } from 'lodash';
import moment from 'moment';
import { DivFlex, SecondaryLabel } from 'src/components';
import ActivityGroup from './ActivityGroup';
import Filters from './Filters';
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
  padding-bottom: 90px;
`;

interface Props {
  activities: LocalActivity[];
  pendingCrossChainRequestKeys: string[];
  openActivityDetail: (activity: LocalActivity) => void;
}

const List = ({ activities, pendingCrossChainRequestKeys, openActivityDetail }: Props) => {
  const [status, setStatus] = useState<StatusValue>();
  const [token, setToken] = useState<string>();

  const sorted = useMemo(() => {
    const localActivities = activities || [];
    const filteredActivitiesByStatus = status
      ? localActivities.filter((activity) => {
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
        })
      : localActivities;
    const filteredActivities = token ? filteredActivitiesByStatus.filter((activity) => activity.module === token) : filteredActivitiesByStatus;

    const groupedActivities = groupBy(filteredActivities, (activity) => moment(new Date(activity.createdTime)).format('DD/MM/YYYY'));

    const sortedActivities = Object.keys(groupedActivities).reduce((acc, key) => {
      acc[key] = orderBy(groupedActivities[key], (activity) => moment(new Date(activity.createdTime)).unix(), 'desc');
      return acc;
    }, {} as Record<string, LocalActivity[]>);

    const sortedKeys = Object.keys(groupedActivities).sort((a, b) => moment(b, 'DD/MM/YYYY').unix() - moment(a, 'DD/MM/YYYY').unix());
    const withSortedKeys = sortedKeys.reduce((acc, key) => {
      acc.set(key, sortedActivities[key]);
      return acc;
    }, new Map<string, LocalActivity[]>());

    return withSortedKeys;
  }, [activities, status, token]);

  const todayString = moment().format('DD/MM/YYYY');
  const todayActivities = sorted.get(todayString);
  const yesterdayString = moment().subtract(1, 'days').format('DD/MM/YYYY');
  const yesterdayActivities = sorted.get(yesterdayString);
  const keys = [...sorted.keys()];

  return (
    <Div>
      <Filters status={status} onChangeStatus={setStatus} token={token} onChangeToken={setToken} />
      {keys.length ? (
        <DivChild>
          <DivScroll>
            {todayActivities && (
              <ActivityGroup
                label="Today"
                activities={todayActivities}
                pendingCrossChainRequestKeys={pendingCrossChainRequestKeys}
                openActivityDetail={openActivityDetail}
              />
            )}

            {yesterdayActivities && (
              <ActivityGroup
                label="Yesterday"
                activities={yesterdayActivities}
                pendingCrossChainRequestKeys={pendingCrossChainRequestKeys}
                openActivityDetail={openActivityDetail}
              />
            )}

            {keys
              .filter((key) => key !== yesterdayString && key !== todayString)
              .map((date) => (
                <ActivityGroup
                  key={date}
                  label={moment(date, 'DD/MM/YYYY').format('DD/MM/YYYY')}
                  activities={sorted.get(date) || []}
                  pendingCrossChainRequestKeys={pendingCrossChainRequestKeys}
                  openActivityDetail={openActivityDetail}
                />
              ))}
          </DivScroll>
        </DivChild>
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
