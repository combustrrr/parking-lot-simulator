/**
 * Parking Lot Manager - Occupancy Chart Component
 * 
 * Displays a bar chart of used vs. free space for each parking slot, assisting managers
 * in monitoring lot occupancy. Uses Chart.js for visualization.
 * 
 * @author Sarthak Kulkarni (23101B0019)
 * @author Pulkit Saini (23101B0021)
 * @author Dhruv Tikhande (23101B00005)
 * @version 0.2.0
 */

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { SpaceAllocation } from '../ParkingLot';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface OccupancyChartProps {
  spaces: number[];
  allocations: SpaceAllocation[];
}

const OccupancyChart: React.FC<OccupancyChartProps> = ({ spaces, allocations }) => {
  // Calculate used space per slot
  const usedSpace = spaces.map((_, index) => {
    return allocations
      .filter(alloc => alloc.spaceIndex === index)
      .reduce((sum, alloc) => sum + alloc.vehicleSize, 0);
  });
  // Calculate free space per slot
  const freeSpace = spaces.map((size, index) => size - usedSpace[index]);

  const data = {
    labels: spaces.map((_, index) => `Space ${index + 1}`),
    datasets: [
      {
        label: 'Used Space',
        data: usedSpace,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill: true,
      },
      {
        label: 'Free Space',
        data: freeSpace,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
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
      title: { display: true, text: 'Parking Space Occupancy' },
    },
    scales: {
      x: { stacked: true, title: { display: true, text: 'Spaces' } },
      y: { 
        stacked: true, 
        title: { display: true, text: 'Size' },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="chart-container">
      <div style={{ height: '300px' }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default OccupancyChart;