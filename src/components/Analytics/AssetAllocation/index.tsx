import { forwardRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';
import { DivFlex, SecondaryLabel } from 'src/components';
import { useAccountBalanceContext } from 'src/contexts/AccountBalanceContext';
import { LabeledContainer } from '../UI';

const assetGroups = [
  {
    name: 'Tokens',
    fill: '#e794e7',
  },
  {
    name: 'DeFi',
    fill: '#00ff2a',
    modules: ['kaddex.kdx', 'kdlaunch.token', 'kdlaunch.kdswap-token', 'kaddex.skdx'],
  },
  {
    name: 'Meme',
    fill: '#e33a3c',
    modules: [
      'free.maga',
      'free.kapybara-token',
      'free.elon',
      'free.kishu-ken',
      'free.SHIB',
      'free.kpepe',
      'n_e309f0fa7cf3a13f93a8da5325cdad32790d2070.heron',
    ],
  },
  {
    name: 'Stable Coins',
    fill: '#e7e494',
    modules: ['n_b742b4e9c600892af545afb408326e82a6c0c6ed.zUSD'],
  },
];

const CustomLegend = ({ payload, assetGroupsData }: { payload?: any; assetGroupsData: any }) => (
  <DivFlex flexDirection="column" alignItems="start">
    {payload.map((entry) => (
      <DivFlex key={entry.dataKey} marginBottom="5px" alignItems="center">
        <div style={{ backgroundColor: entry.color, width: 10, height: 10, borderRadius: '50%', marginRight: 10 }} />
        <SecondaryLabel>
          {entry.dataKey} <strong>$ {(assetGroupsData[0][entry.dataKey] || 0).toFixed(2)}</strong>
        </SecondaryLabel>
      </DivFlex>
    ))}
  </DivFlex>
);

export const AssetAllocationChart = forwardRef<HTMLDivElement>((_, ref) => {
  const { allAccountsBalanceUsd } = useAccountBalanceContext();

  const sumSelectedKeys = (obj, keys) => {
    const objKeys = Object.keys(obj);
    return keys.reduce((sum, key) => {
      if (objKeys.includes(key)) {
        sum += obj[key];
      }
      return sum;
    }, 0);
  };

  const summedData = {};

  Object.entries(allAccountsBalanceUsd ?? {}).forEach(([, arrayOfEntries]) => {
    arrayOfEntries.forEach((entry) => {
      Object.entries(entry).forEach(([token, value]) => {
        if (!summedData[token]) {
          summedData[token] = 0;
        }
        summedData[token] += value;
      });
    });
  });

  const summedBalances = summedData;
  const assetGroupsData = [{ Tokens: 0 }];
  assetGroups.forEach((assetGroup) => {
    const modules =
      assetGroup.modules ||
      Object.keys(summedBalances).filter(
        (key) =>
          !assetGroups
            .map((g) => g.modules)
            .flat()
            .includes(key),
      );
    assetGroupsData[0][assetGroup.name] = sumSelectedKeys(summedBalances, modules);
  });
  const maxValue = Math.max(Object.values(assetGroupsData[0]) as any);
  return (
    <LabeledContainer label="ASSET ALLOCATION" ref={ref}>
      {Object.keys(summedBalances).length ? (
        <ResponsiveContainer height={170}>
          <BarChart layout="vertical" barSize={30} height={80} data={assetGroupsData as any} margin={{ top: -20 }} barGap="5px">
            <Legend content={<CustomLegend assetGroupsData={assetGroupsData} />} />
            {/* <Tooltip content={<CustomTooltip />} /> */}
            <XAxis type="number" height={0} domain={[0, maxValue]} />
            <YAxis type="category" dataKey="name" width={0} />
            {assetGroups.map((assetGroup, i) => (
              <Bar
                key={assetGroup.name}
                dataKey={assetGroup.name}
                stackId="a"
                fill={assetGroup.fill}
                // eslint-disable-next-line no-nested-ternary
                radius={i === 0 ? [10, 0, 0, 10] : i === assetGroups.length - 1 ? [0, 10, 10, 0] : [0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      ) : null}
    </LabeledContainer>
  );
});
