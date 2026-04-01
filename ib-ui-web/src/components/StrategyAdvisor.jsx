import React from 'react';
import { Lightbulb, TrendingUp, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

const StrategyAdvisor = ({ advice, onApplySimulation, t }) => {
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
        <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#fff', margin: 0 }}>{t('ai_strategy_advisor')}</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {advice.map((item, idx) => (
          <div 
            key={idx} 
            className="glass-panel" 
            style={{ 
              padding: '20px', 
              background: 'rgba(255, 255, 255, 0.03)', 
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <div style={{ 
                  background: 'rgba(59, 130, 246, 0.1)', 
                  padding: '6px', 
                  borderRadius: '10px',
                  display: 'flex', alignItems: 'center'
                }}>
                  {getIcon(item.category)}
                </div>
                <span style={{ fontSize: '11px', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {item.category === 'FINANCIAL' ? t('financial_category') : 
                     item.category === 'CAPITAL' ? t('capital_category') : 
                     item.category === 'RISK_CONTROL' ? t('risk_control_category') : item.category}
                </span>
              </div>
              
              <h4 style={{ fontSize: '16px', fontWeight: '900', color: '#fff', marginBottom: '10px' }}>{t(item.title)}</h4>
              <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.6', marginBottom: '20px' }}>{t(item.description)}</p>
            </div>

            <div style={{ marginTop: 'auto' }}>
              <div style={{ 
                fontSize: '13px', 
                fontWeight: '900', 
                color: 'var(--risk-aa)', 
                marginBottom: '16px',
                display: 'flex', alignItems: 'center', gap: '6px'
              }}>
                <TrendingUp size={16} /> {t(item.impact)}
              </div>
              
              <button 
                onClick={() => onApplySimulation(item)}
                className="glass-button" 
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  fontSize: '12px', 
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  borderRadius: '12px',
                  fontWeight: '900'
                }}
                onMouseEnter={(e) => { e.target.style.background = 'rgba(16, 185, 129, 0.4)'; }}
                onMouseLeave={(e) => { e.target.style.background = 'rgba(16, 185, 129, 0.2)'; }}
              >
                {t('simulate_scenario_now')} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StrategyAdvisor;
