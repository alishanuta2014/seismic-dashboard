import React from 'react';
import { SeismicEvent } from '../types';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement);

const MagnitudeChart: React.FC<{ events: SeismicEvent[] }> = ({ events }) => {
  const magnitudes = events.map(e => e.mag);
  const labels = events.map(e => new Date(e.time).toLocaleTimeString());

  const data = {
    labels,
    datasets: [
      {
        label: 'Magnitude',
        data: magnitudes,
        backgroundColor: magnitudes.map(mag => 
          mag > 5 ? '#ff4d4f' : 
          mag > 3 ? '#faad14' : '#52c41a'
        ),
      }
    ]
  };

  return (
    <div className="chart-container">
      <h3>Recent Earthquake Magnitudes</h3>
      <Bar data={data} />
    </div>
  );
};

export default MagnitudeChart;