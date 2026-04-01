import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const RiskRadarChart = ({ data, t }) => {
  const chartData = {
    labels: [
      t('risk_fin'), 
      t('risk_legal'), 
      t('risk_ops'), 
      t('risk_sec'), 
      t('risk_ai'), 
      t('risk_vdr')
    ],
    datasets: [
      {
        label: t('risk_profile_title'),
        data: data || [0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(16, 185, 129, 0.2)', // Emerald 500 transparent
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
        angleLines: { color: 'rgba(255,255,255,0.1)' },
        grid: { color: 'rgba(255,255,255,0.1)' },
        pointLabels: { color: '#94a3b8', font: { size: 12, weight: '700' } },
        ticks: { backdropColor: 'transparent', color: '#64748b', stepSize: 20 },
        suggestedMin: 0,
        suggestedMax: 100
      }
    },
    plugins: {
      legend: { labels: { color: '#fff', font: { weight: '800' } } }
    }
  };

  return (
    <div className="radar-container glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
      <Radar data={chartData} options={options} />
    </div>
  );
};

export default RiskRadarChart;
