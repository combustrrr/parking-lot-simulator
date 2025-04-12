/**
 * Parking Lot Manager - Usage Chart Component
 * 
 * Displays a line chart of vehicles parked per session, helping managers track
 * parking lot usage trends over time. Uses Chart.js for visualization.
 * 
 * @author Sarthak Kulkarni (23101B0019)
 * @author Pulkit Saini (23101B0021)
 * @author Dhruv Tikhande (23101B00005)
 * @version 0.2.0
 */

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface UsageChartProps {
  history: number[];
}

const UsageChart: React.FC<UsageChartProps> = ({ history }) => {
  const data = {
    labels: history.map((_, index) => `Session ${index + 1}`),
    datasets: [
      {
        label: 'Vehicles Parked',
        data: history,
        borderColor: 'rgba(153, 102, 255, 0.6)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Parking Usage Over Time' },
    },
    scales: {
      x: { title: { display: true, text: 'Sessions' } },
      y: { 
        title: { display: true, text: 'Vehicles' },
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
      
    },
  };

  return (
    <div className="chart-container">
      <div style={{ height: '300px' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default UsageChart;