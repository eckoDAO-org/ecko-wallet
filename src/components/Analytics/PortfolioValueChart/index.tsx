import Chart, { Props } from 'react-apexcharts';

interface PortfolioValueChartUIProps {
  points: number[][];
}

const PortfolioValueChart = ({ points }: PortfolioValueChartUIProps) => {
  const series = [{
    name: 'value',
    data: points,
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
