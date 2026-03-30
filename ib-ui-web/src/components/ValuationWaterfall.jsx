import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ValuationWaterfall = ({ data }) => {
  const chartData = {
    labels: ['Current Value', 'Cost Synergies', 'Revenue Synergies', 'Integration Costs', 'Post-Deal Value'],
    datasets: [
      {
        label: 'Valuation Bridge ()',
        data: data || [2000, 500, 300, -200, 2600],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)', // Current
          'rgba(75, 192, 192, 0.6)', // Cost
          'rgba(153, 102, 255, 0.6)', // Revenue
          'rgba(255, 99, 132, 0.6)', // Costs
          'rgba(255, 159, 64, 0.6)'  // Final
        ],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'M&A Valuation Bridge', color: '#fff' }
    },
    scales: {
      y: { ticks: { color: '#aaa' }, grid: { color: '#444' } },
      x: { ticks: { color: '#aaa' } }
    }
  };

  return (
    <div className="waterfall-container" style={{ background: '#1a1d21', padding: '20px', borderRadius: '12px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ValuationWaterfall;
