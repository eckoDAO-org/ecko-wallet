import React from 'react';
import Chart, { Props } from 'react-apexcharts';

const PortfolioValueChart = () => {
  const series = [{
    name: 'value',
    data: [
      [1327359600000, 240124.44],
      [1327446000000, 237112.23],
      [1327532400000, 236312.56],
      [1327618800000, 236312.56],
      [1327878000000, 230849.71],
      [1327964400000, 233175.38],
      [1328050800000, 238540.37],
      [1328137200000, 235583.13],
      [1328223600000, 237691.88],
      [1328482800000, 238010.34],
      [1328569200000, 237423.13],
      [1328655600000, 233461.15],
      [1328742000000, 236120.23],
      [1328828400000, 235984.17],
      [1329087600000, 232881.58],
      [1329174000000, 231483.17],
      [1329260400000, 234185.29],
    ],
  }];

  const options: Props['options'] = {
    chart: {
      id: 'portfolio-value-chart',
      toolbar: { show: false },
      background: 'transparent',
    },
    xaxis: {
      type: 'datetime',
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
      max: Math.max(...series[0].data.map((value) => value[1])),
    },
    tooltip: {
      y: {
        formatter: (value) => `$ ${Number(value.toFixed(2)).toLocaleString()}`,
      },
    },
    grid: {
      show: false,
      padding: { left: -9, right: 0 },
    },
    dataLabels: { enabled: false },
    colors: ['#ED1CB5'],
    stroke: {
      width: 2,
      curve: 'straight',
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 1,
        opacityTo: 0,
        gradientToColors: ['transparent'],
      },
    },
    theme: { mode: 'dark' },
  };

  return (
    <Chart options={options} series={series} type="area" height="100%" />
  );
};

export default PortfolioValueChart;
