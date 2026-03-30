import React from 'react';
import { Settings, TrendingDown, TrendingUp, Minus } from 'lucide-react';

const ScenarioSelector = ({ multiplier, activePreset, onMultiplierChange, onPresetChange }) => {
  
  const presets = [
    { id: 'BEAR', label: '보수적 (Bear)', value: 0.70, color: '#ef4444', icon: <TrendingDown size={18} /> },
    { id: 'BASE', label: '표준 (Base)', value: 1.00, color: '#3b82f6', icon: <Minus size={18} /> },
    { id: 'BULL', label: '낙관적 (Bull)', value: 1.30, color: '#10b981', icon: <TrendingUp size={18} /> }
  ];

  const handleSliderChange = (e) => {
    onMultiplierChange(parseFloat(e.target.value));
  };

  return (
    <div className="glass-panel scenario-selector-card" style={{ padding: '24px', borderRadius: '16px' }}>
      <h3 style={{ fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#60a5fa' }}>
        <Settings size={22} className="spinning-slow" /> 시나리오 시뮬레이터
      </h3>

      {/* Preset Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {presets.map(p => (
          <button
            key={p.id}
            onClick={() => onPresetChange(p.id, p.value)}
            style={{
              padding: '12px 8px',
              borderRadius: '10px',
              border: `1px solid ${activePreset === p.id ? p.color : 'rgba(255,255,255,0.1)'}`,
              background: activePreset === p.id ? `${p.color}22` : 'rgba(255,255,255,0.05)',
              color: activePreset === p.id ? p.color : '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
              fontWeight: activePreset === p.id ? 'bold' : 'normal'
            }}
          >
            {p.icon}
            <span style={{ fontSize: '11px' }}>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Slider Section */}
      <div className="slider-wrapper">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>시너지 가처율 (Capture Rate)</span>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>
            {(multiplier * 100).toFixed(0)}%
          </span>
        </div>
        <input 
          type="range" 
          min="0.5" 
          max="1.5" 
          step="0.01" 
          value={multiplier}
          onChange={handleSliderChange}
          style={{ 
            width: '100%', 
            height: '6px', 
            borderRadius: '3px', 
            appearance: 'none', 
            background: `linear-gradient(90deg, #ef4444 0%, #3b82f6 50%, #10b981 100%)`, 
            cursor: 'pointer'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '10px', color: '#64748b' }}>
          <span>보수 (50%)</span>
          <span>표준 (100%)</span>
          <span>공격 (150%)</span>
        </div>
      </div>

      <style>{`
        .spinning-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        input[type=range]::-webkit-slider-thumb {
          appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
          cursor: pointer;
          border: 2px solid #3b82f6;
        }
      `}</style>
    </div>
  );
};

export default ScenarioSelector;
