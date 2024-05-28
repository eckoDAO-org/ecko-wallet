import styled from 'styled-components';
import Chart, { Props } from 'react-apexcharts';
import { TokenBalance, useAccountBalanceContext } from 'src/contexts/AccountBalanceContext';
import useLocalStorage from 'src/hooks/useLocalStorage';
import { IFungibleToken, IFungibleTokensByNetwork, LOCAL_DEFAULT_FUNGIBLE_TOKENS, LOCAL_KEY_FUNGIBLE_TOKENS } from 'src/pages/ImportToken';
import { LabeledContainer } from '../UI';

const ChartAllocation = () => {
  const accountBalance = useAccountBalanceContext();
  const [fungibleTokens] = useLocalStorage<IFungibleTokensByNetwork>(LOCAL_KEY_FUNGIBLE_TOKENS, LOCAL_DEFAULT_FUNGIBLE_TOKENS);

  if (!accountBalance.allAccountsBalanceUsd) return null;

  const summedTokenBalance = Object.values(accountBalance.allAccountsBalanceUsd).reduce(
    (sumPerAccount, account) => account.reduce(
      (sumPerNetwork, tokenBalance) => Object.keys(tokenBalance).reduce(
        (sumPerToken, contractAddress) => ({
          ...sumPerToken,
          [contractAddress]: (sumPerToken[contractAddress] || 0) + tokenBalance[contractAddress],
        }), sumPerNetwork,
      ), sumPerAccount,
  ), {} as TokenBalance);

  const { series, labels } = Object.keys(summedTokenBalance).reduce(
    (acc, contractAddress) => {
      const sum = Number(summedTokenBalance[contractAddress].toFixed(2));
      if (sum === 0) return acc;

      let token: IFungibleToken | undefined;

      if (contractAddress === 'coin') {
        token = {
          contractAddress: 'coin',
          symbol: 'KDA',
        };
      } else if (fungibleTokens) {
        Object.values(fungibleTokens).every((tokens) => {
          const foundToken = tokens.find((t) => t.contractAddress === contractAddress);
          if (foundToken) {
            token = foundToken;
            return false;
          }

          return true;
        });
      }

      const symbol = token?.symbol.toUpperCase() || contractAddress;

      return {
        series: [...acc.series, sum],
        labels: [...acc.labels, symbol],
      };
    }, {
      series: [] as number[],
      labels: [] as string[],
    },
  );

  const options: Props['options'] = {
    chart: {
      type: 'donut',
      height: 180,
    },
    labels,
    stroke: {
      width: 2,
      colors: ['#1a1e3e'],
    },
    plotOptions: {
      pie: {
        customScale: 1,
        startAngle: -90,
        endAngle: 90,
        donut: {
          size: '85%',
          labels: {
            show: true,
            name: {
              offsetY: -55,
            },
            value: {
              offsetY: -45,
              color: '#fff',
              fontWeight: 'bold',
              formatter: (value) => `$ ${Number(value).toFixed(2).toLocaleString()}`,
            },
            total: {
              show: true,
              color: '#fff',
              label: 'TOT',
              fontWeight: 'bold',
              formatter: (value) => `$ ${Number(value.globals.series.reduce((acc, v: number) => acc + v, 0)).toFixed(2).toLocaleString()}`,
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: 'bottom',
      offsetY: -45,
      labels: {
        colors: '#fff',
      },
    },
    grid: {
      padding: {
        bottom: -90,
      },
    },
  };

  // const series = [44, 55, 41, 17, 15];

  return (
    <LabeledContainer label="CHART">
      <Chart options={options} series={series} type="donut" height={360} />
    </LabeledContainer>
  );
};

export default ChartAllocation;
