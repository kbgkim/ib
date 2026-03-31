import React from 'react';
import { Lightbulb, TrendingUp, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

const StrategyAdvisor = ({ advice, onApplySimulation }) => {
  if (!advice || advice.length === 0) return null;

  const getIcon = (category) => {
    switch (category) {
      case 'FINANCIAL': return <TrendingUp size={18} className="text-blue-400" />;
      case 'CAPITAL': return <Zap size={18} className="text-yellow-400" />;
      case 'RISK_CONTROL': return <ShieldCheck size={18} className="text-emerald-400" />;
      default: return <Lightbulb size={18} />;
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '24px', borderRadius: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <Lightbulb color="var(--risk-aa)" size={24} />
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', margin: 0 }}>AI 전략 제언 (AI Strategy Advisor)</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {advice.map((item, idx) => (
          <div 
            key={idx} 
            className="glass-panel" 
            style={{ 
              padding: '16px', 
              background: 'rgba(255, 255, 255, 0.03)', 
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div style={{ 
                  background: 'rgba(59, 130, 246, 0.1)', 
                  padding: '6px', 
                  borderRadius: '8px',
                  display: 'flex', alignItems: 'center'
                }}>
                  {getIcon(item.category)}
                </div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8' }}>{item.category}</span>
              </div>
              
              <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#f1f5f9', marginBottom: '8px' }}>{item.title}</h4>
              <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5', marginBottom: '16px' }}>{item.description}</p>
            </div>

            <div style={{ marginTop: 'auto' }}>
              <div style={{ 
                fontSize: '13px', 
                fontWeight: '800', 
                color: 'var(--risk-aa)', 
                marginBottom: '12px',
                display: 'flex', alignItems: 'center', gap: '4px'
              }}>
                <TrendingUp size={14} /> {item.impact}
              </div>
              
              <button 
                onClick={() => onApplySimulation(item)}
                className="glass-button" 
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  fontSize: '12px', 
                  background: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  color: '#4ade80',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
              >
                시나리오 즉시 시뮬레이션 <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StrategyAdvisor;
