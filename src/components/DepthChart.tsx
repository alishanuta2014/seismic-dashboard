import React from 'react';
import { SeismicEvent } from '../types';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

const DepthChart: React.FC<{ events: SeismicEvent[] }> = ({ events }) => {
  const depths = events.map(e => e.depth);
  const labels = events.map(e => new Date(e.time).toLocaleTimeString());

  const data = {
    labels,
    datasets: [
      {
        label: 'Depth (km)',
        data: depths,
        borderColor: '#1890ff',
        tension: 0.1
      }
    ]
  };

  return (
    <div className="chart-container">
      <h3>Earthquake Depths</h3>
      <Line data={data} />
    </div>
  );
};

export default DepthChart;