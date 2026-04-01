import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * Premium Waterfall Chart with Sensitivity Range (Error Bars)
 * Displays weighted average results and Bear~Bull range
 */
const ValuationWaterfall = ({ data, scenarios, t }) => {
  // data = [base, cost, rev, integ, post]
  const [base, cost, rev, integ, post] = data || [2000, 0, 0, -200, 1800];

  const labels = [
    t('current_val'), 
    t('cost_synergy_lbl'), 
    t('rev_synergy_lbl'), 
    t('integration_cost_lbl'), 
    t('post_deal_val_lbl')
  ];

  // Main floating bar data format [min, max]
  const bridgeData = useMemo(() => [
    [0, base],
    [base, base + cost],
    [base + cost, base + cost + rev],
    [base + cost + rev, base + cost + rev + integ],
    [0, post]
  ], [base, cost, rev, integ, post]);

  // Calculate Sensitivity Ranges (Bear to Bull)
  const ranges = useMemo(() => {
    if (!scenarios) return null;
    const { BEAR, BULL } = scenarios;
    
    // BEAR scenario points
    const bBase = BEAR.baseValue;
    const bCost = BEAR.costSynergy;
    const bRev = BEAR.revenueSynergy;
    const bInteg = BEAR.integrationCost;
    const bPost = BEAR.postDealValue;

    // BULL scenario points
    const uBase = BULL.baseValue;
    const uCost = BULL.costSynergy;
    const uRev = BULL.revenueSynergy;
    const uInteg = BULL.integrationCost;
    const uPost = BULL.postDealValue;

    // We map these to the same coordinate system as bridgeData
    return [
      [0, bBase, uBase], // Currently static at start
      [base + bCost, base + uCost],
      [base + cost + bRev, base + cost + uRev],
      [base + cost + rev + bInteg, base + cost + rev + uInteg],
      [0, bPost, uPost]
    ];
  }, [scenarios, base, cost, rev, integ, post]);

  // Custom Plugin to draw Sensitivity Lines (Error Bars)
  const sensitivityPlugin = {
    id: 'sensitivityRange',
    afterDatasetsDraw(chart) {
      if (!ranges) return;
      const { ctx, scales: { x, y } } = chart;
      ctx.save();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';

      ranges.forEach((range, i) => {
        const xPos = x.getPixelForValue(labels[i]);
        const yStart = y.getPixelForValue(range[0] || range[1]); // Bear
        const yEnd = y.getPixelForValue(range[range.length-1]); // Bull

        // Draw Vertical Line
        ctx.beginPath();
        ctx.moveTo(xPos, yStart);
        ctx.lineTo(xPos, yEnd);
        ctx.stroke();

        // Draw Caps
        ctx.beginPath();
        ctx.moveTo(xPos - 5, yStart); ctx.lineTo(xPos + 5, yStart);
        ctx.moveTo(xPos - 5, yEnd); ctx.lineTo(xPos + 5, yEnd);
        ctx.stroke();
      });
      ctx.restore();
    }
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: t('weighted_avg_val'),
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
            return `${t('weighted_avg_delta')}: ${diff > 0 ? '+' : ''}${diff}M (Result: $${range[1].toFixed(1)}M)`;
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
    <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', height: '420px' }}>
      <h3 style={{ fontSize: '18px', marginBottom: '20px', color: '#60a5fa', display: 'flex', justifyContent: 'space-between', fontWeight: '900' }}>
        <span>{t('val_bridge')}</span>
        <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '800' }}>I-P Bridge v1.5</span>
      </h3>
      <div style={{ height: '320px' }}>
        <Bar data={chartData} options={options} plugins={[sensitivityPlugin]} />
      </div>
    </div>
  );
};

export default ValuationWaterfall;
