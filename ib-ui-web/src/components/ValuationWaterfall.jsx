import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * Premium Waterfall Chart for M&A Valuation Bridge
 * Uses Floating Bar data format [min, max]
 */
const ValuationWaterfall = ({ data }) => {
  // data = [baseValue, costSynergy, revenueSynergy, integrationCost, postDealValue]
  const [base, cost, rev, integ, post] = data || [2000, 500, 300, -200, 2600];

  const labels = ['현재 가치', '비용 시너지', '매출 시너지', '통합 비용', '통합 가치'];

  // Calculate floating ranges
  const bridgeData = [
    [0, base],                        // 현재 가치 (Start)
    [base, base + cost],              // 비용 시너지
    [base + cost, base + cost + rev], // 매출 시너지
    [base + cost + rev, base + cost + rev + integ], // 통합 비용 (integ is negative)
    [0, post]                         // 통합 가치 (End)
  ];

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Valuation ($M)',
        data: bridgeData,
        backgroundColor: (context) => {
          const index = context.dataIndex;
          if (index === 0 || index === 4) return '#3b82f6'; // Start/End
          const val = bridgeData[index][1] - bridgeData[index][0];
          return val >= 0 ? '#10b981' : '#ef4444'; // Green for +, Red for -
        },
        borderRadius: 6,
        borderSkipped: false,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const range = context.raw;
            const diff = (range[1] - range[0]).toFixed(1);
            return `변동폭: ${diff > 0 ? '+' : ''}${diff}M ($${range[1].toFixed(1)}M)`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#94a3b8' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8' }
      }
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', height: '400px' }}>
      <h3 style={{ fontSize: '18px', marginBottom: '20px', color: '#60a5fa' }}>M&A 밸류에이션 브릿지 ($M)</h3>
      <div style={{ height: '300px' }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ValuationWaterfall;
