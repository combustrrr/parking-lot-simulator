/**
 * Parking Lot Manager - Efficiency Chart Component
 * 
 * Displays a pie chart of allocation success rate (parked vs. failed attempts),
 * assisting managers in evaluating strategy effectiveness. Uses Chart.js.
 * 
 * @author Sarthak Kulkarni (23101B0019)
 * @author Pulkit Saini (23101B0021)
 * @author Dhruv Tikhande (23101B00005)
 * @version 0.2.0
 */

import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface EfficiencyChartProps {
  successRate: number;
}

const EfficiencyChart: React.FC<EfficiencyChartProps> = ({ successRate }) => {
  const data = {
    labels: ['Parked', 'Failed'],
    datasets: [
      {
        data: [successRate, 100 - successRate],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Allocation Efficiency' },
    },
  };

  return (
    <div className="chart-container">
      <div style={{ height: '300px' }}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default EfficiencyChart;