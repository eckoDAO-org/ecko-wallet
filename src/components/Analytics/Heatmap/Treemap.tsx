import React from 'react';
import Chart, { Props } from 'react-apexcharts';

const Treemap = () => {
  const series = [
    {
      name: 'treemap',
      data: [
        {
          x: 'New Delhi',
          y: 218,
        },
        {
          x: 'Kolkata',
          y: 149,
        },
        {
          x: 'Mumbai',
          y: 184,
        },
        {
          x: 'Ahmedabad',
          y: 55,
        },
        {
          x: 'Bangaluru',
          y: 84,
        },
        {
          x: 'Pune',
          y: 31,
        },
        {
          x: 'Chennai',
          y: 70,
        },
      ],
    },
  ];

  const options: Props['options'] = {
    chart: {
      id: 'treemap-chart',
    },
  };

  return <Chart options={options} series={series} type="treemap" height="100%" />;
};

export default Treemap;
