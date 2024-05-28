import { useMemo } from 'react';
import styled from 'styled-components';
import ApexChart, { Props as ApexProps } from 'react-apexcharts';
import { AccountBalanceProps, TokenBalance } from 'src/contexts/AccountBalanceContext';
import { IFungibleToken, IFungibleTokensByNetwork } from 'src/pages/ImportToken';
import { DivFlex } from 'src/components';
import images from 'src/images';
import { LabeledContainer } from '../UI';

const TokensContainer = styled.div`
  display: grid;
  justify-content: center;
  grid-template-columns: 50% 50%;
  justify-items: center;
  gap: 12px;
  font-size: 13px;
  color: #E6E6E6;
`;

const Token = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 8px;
`;

const TokenName = styled.div`
  padding-right: 8px;
`;

const TokenPercentual = styled.span`
  font-weight: bold;
`;

const Dot = styled.div<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  margin-right: 8px;
`;

const COLORS = ['#E25F5F', '#E1E794', '#E3E3E3', '#94AEE7', '#B7E794', '#ED1CB5', '#FD9F28', '#E794E7', '#E7E494', '#94E7DA'];

interface Props {
  allAccountsBalanceUsd: AccountBalanceProps;
  fungibleTokens: IFungibleTokensByNetwork;
}

const Chart = ({
  allAccountsBalanceUsd,
  fungibleTokens,
}: Props) => {
  const summedTokenBalance = Object.values(allAccountsBalanceUsd).reduce(
    (sumPerAccount, account) => account.reduce(
      (sumPerNetwork, tokenBalance) => Object.keys(tokenBalance).reduce(
        (sumPerToken, contractAddress) => ({
          ...sumPerToken,
          [contractAddress]: (sumPerToken[contractAddress] || 0) + tokenBalance[contractAddress],
        }), sumPerNetwork,
      ), sumPerAccount,
  ), {} as TokenBalance);

  const { series, labels, addresses, total } = useMemo(() => {
    const data = Object.keys(summedTokenBalance).reduce(
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
          addresses: [...acc.addresses, contractAddress],
        };
      }, {
        series: [] as number[],
        labels: [] as string[],
        addresses: [] as string[],
      },
    );
    const totalSum = Number(data.series.reduce((acc, value) => acc + value, 0).toFixed(2));

    return {
      series: data.series,
      labels: data.labels,
      addresses: data.addresses,
      total: totalSum,
    };
  }, [summedTokenBalance, fungibleTokens]);

  const options: ApexProps['options'] = {
    chart: {
      type: 'donut',
      height: 180,
    },
    colors: COLORS,
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
              formatter: () => `$ ${total.toFixed(2).toLocaleString()}`,
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
      position: 'bottom',
      offsetY: -45,
      labels: {
        colors: '#fff',
      },
    },
    grid: {
      padding: {
        bottom: -168,
      },
    },
  };

  return (
    <LabeledContainer label="CHART">
      <ApexChart options={options} series={series} type="donut" height={360} />
      <TokensContainer>
        {series.map((value, index) => (
          <DivFlex key={labels[index]} alignItems="center">
            <Token src={images.wallet.tokens[addresses[index]] || images.wallet.iconUnknownKadenaToken} />
            <Dot color={COLORS[index % COLORS.length]} />
            <TokenName>{labels[index]}</TokenName>
            <TokenPercentual>{((value / total) * 100).toFixed(2)}%</TokenPercentual>
          </DivFlex>
        ))}
      </TokensContainer>
    </LabeledContainer>
  );
};

export default Chart;
