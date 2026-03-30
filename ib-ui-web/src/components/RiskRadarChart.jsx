import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const RiskRadarChart = ({ data }) => {
  const chartData = {
    labels: ['Financial', 'Legal', 'Operational', 'Security'],
    datasets: [
      {
        label: 'Current Deal Risk Profile',
        data: data || [0, 0, 0, 0],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255, 99, 132, 1)'
      }
    ]
  };

  const options = {
    scales: {
      r: {
        angleLines: { color: '#444' },
        grid: { color: '#444' },
        pointLabels: { color: '#aaa', font: { size: 14 } },
        ticks: { backdropColor: 'transparent', color: '#888', stepSize: 20 },
        suggestedMin: 0,
        suggestedMax: 100
      }
    },
    plugins: {
      legend: { labels: { color: '#fff' } }
    }
  };

  return (
    <div className="radar-container" style={{ background: '#1a1d21', padding: '20px', borderRadius: '12px' }}>
      <Radar data={chartData} options={options} />
    </div>
  );
};

export default RiskRadarChart;
