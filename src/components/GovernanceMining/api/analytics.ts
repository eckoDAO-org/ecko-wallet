import moment from 'moment';
import { useSelector } from 'react-redux';
import { getSelectedNetwork } from 'src/stores/extensions';
import { ANALYSIS_BASE_URL_DEV, ANALYSIS_BASE_URL_PROD } from '../constants';

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export const useGetData = () => {
  const selectedNetwork = useSelector(getSelectedNetwork);

  return async (startDate: Date, endDate: Date) => {
    const start = moment(startDate).format('YYYY-MM-DD');
    const end = moment(endDate).format('YYYY-MM-DD');

    const baseUrl = selectedNetwork.networkId === 'development' ? ANALYSIS_BASE_URL_DEV : ANALYSIS_BASE_URL_PROD;
    const url = `${baseUrl}get-data?dateStart=${start}&dateEnd=${end}`;
    const options = { method: 'GET', headers };

    const response = await fetch(url, options);
    const json = (await response.json());

    return json;
  };
};

export const useGetLastDayData = () => {
  const getData = useGetData();

  return async () => {
    const end = new Date();
    const start = moment(end).subtract(1, 'days').toDate();
    const response = await getData(start, end);

    return response;
  };
};

// GET analytics/get-data?dateStart=yesterda&dateEnd=today
