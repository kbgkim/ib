import React from 'react';
import { Settings, TrendingDown, TrendingUp, Minus, Info } from 'lucide-react';

/**
 * Premium Scenario Selector with 3-Segment Probability Weights
 * Implements Proportional Auto-balancing logic
 */
const ScenarioSelector = ({ weights, onWeightsChange, t }) => {
  const { bear = 20, base = 50, bull = 30 } = weights;

  const handleWeightChange = (key, newValue) => {
    const val = parseInt(newValue);
    const otherKeys = ['bear', 'base', 'bull'].filter(k => k !== key);
    
    // Calculate how much we need to adjust the others
    const currentVal = weights[key];
    const diff = val - currentVal;
    
    let newWeights = { ...weights, [key]: val };
    
    // Proportional adjustment for others
    const othersSum = weights[otherKeys[0]] + weights[otherKeys[1]];
    
    if (othersSum === 0) {
      // If others are both zero, split the diff equally
      newWeights[otherKeys[0]] = Math.max(0, Math.floor((100 - val) / 2));
      newWeights[otherKeys[1]] = 100 - val - newWeights[otherKeys[0]];
    } else {
      // Distribute diff proportionally
      const r0 = weights[otherKeys[0]] / othersSum;
      const r1 = weights[otherKeys[1]] / othersSum;
      
      newWeights[otherKeys[0]] = Math.max(0, Math.round(weights[otherKeys[0]] - diff * r0));
      newWeights[otherKeys[1]] = Math.max(0, 100 - val - newWeights[otherKeys[0]]);
    }

    onWeightsChange(newWeights);
  };

  const ConfigRow = ({ label, value, color, icon, id }) => (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: color }}>
          {icon}
          <span style={{ fontSize: '13px', fontWeight: '500' }}>{label}</span>
        </div>
        <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#fff' }}>{value}%</span>
      </div>
      <input 
        type="range" 
        min="0" 
        max="100" 
        value={value}
        onChange={(e) => handleWeightChange(id, e.target.value)}
        className={`custom-slider slider-${id}`}
        style={{ '--accent': color }}
      />
    </div>
  );

  return (
    <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
      <h3 style={{ fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#60a5fa' }}>
        <Settings size={22} className="spinning-slow" /> {t('scenario_simulator')}
      </h3>

      {/* Distribution Bar */}
      <div style={{ 
        height: '12px', 
        width: '100%', 
        display: 'flex', 
        borderRadius: '6px', 
        overflow: 'hidden', 
        marginBottom: '28px',
        background: 'rgba(255,255,255,0.05)',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
      }}>
        <div style={{ width: `${bear}%`, background: '#ef4444', transition: 'width 0.3s ease' }} />
        <div style={{ width: `${base}%`, background: '#3b82f6', transition: 'width 0.3s ease' }} />
        <div style={{ width: `${bull}%`, background: '#10b981', transition: 'width 0.3s ease' }} />
      </div>

      <ConfigRow id="bear" label={t('bearish')} value={bear} color="#ef4444" icon={<TrendingDown size={16} />} />
      <ConfigRow id="base" label={t('neutral')} value={base} color="#3b82f6" icon={<Minus size={16} />} />
      <ConfigRow id="bull" label={t('bullish')} value={bull} color="#10b981" icon={<TrendingUp size={16} />} />

      <div style={{ 
        marginTop: '20px', 
        padding: '12px', 
        background: 'rgba(96, 165, 250, 0.05)', 
        borderRadius: '12px', 
        fontSize: '11px', 
        color: '#94a3b8',
        display: 'flex',
        gap: '8px',
        border: '1px solid rgba(96, 165, 250, 0.1)'
      }}>
        <Info size={14} style={{ flexShrink: 0, color: 'var(--neon-blue)' }} />
        <span>{t('scenario_help')}</span>
      </div>

      <style>{`
        .spinning-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .custom-slider {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          appearance: none;
          background: rgba(255,255,255,0.1);
          outline: none;
          cursor: pointer;
        }
        
        .custom-slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid var(--accent);
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
          cursor: pointer;
          transition: transform 0.1s;
        }
        
        .custom-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
};

export default ScenarioSelector;
