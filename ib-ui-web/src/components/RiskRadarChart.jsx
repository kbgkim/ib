import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const RiskRadarChart = ({ data }) => {
  const chartData = {
    labels: ['재무', '법무', '운영', '보안', 'AI 신뢰도', 'VDR 보안'],
    datasets: [
      {
        label: '현재 딜 리스크 프로파일',
        data: data || [0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(16, 185, 129, 0.25)', // Emerald 500 transparent
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(16, 185, 129, 1)',
        tension: 0.1 // Smooth animation/curve
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
