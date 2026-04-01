import React, { useState } from 'react';
import { LayoutGrid, Globe, TrendingUp, ShieldAlert, BarChart, Server, Zap, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import AIPortfolioOptimizer from './AIPortfolioOptimizer';

const PortfolioCommandCenter = ({ t, lang }) => {
  const [selectedScenario, setSelectedScenario] = useState('NORMAL');
  const [impactData, setImpactData] = useState({ aumChange: 0, dscrChange: 0, riskAdjust: 0 });
  const [weights, setWeights] = useState({
    "RENEWABLES": 42.0,
    "INFRA": 18.0,
    "TECH": 40.0
  });

  const scenarios = [
    { id: 'NORMAL', label: t('reset'), icon: Globe, aum: 4.2 },
    { id: 'HIKE', label: t('rate_hike'), icon: TrendingUp, aum: -0.35, dscr: -0.15, risk: +8.5 },
    { id: 'VOLATILE', label: t('high_volatility'), icon: Zap, aum: -0.22, dscr: -0.05, risk: +12.0 },
    { id: 'SHOCK', label: t('energy_shock'), icon: ShieldAlert, aum: -0.48, dscr: -0.25, risk: +15.5 },
  ];

  const handleScenarioChange = (s) => {
    setSelectedScenario(s.id);
    if (s.id === 'NORMAL') {
      setImpactData({ aumChange: 0, dscrChange: 0, riskAdjust: 0 });
    } else {
      setImpactData({ aumChange: s.aum, dscrChange: s.dscr, riskAdjust: s.risk });
    }
  };

  const handleApplyRebalance = (rec) => {
    setWeights(rec.recommended_weights);
    setImpactData(prev => ({
        ...prev,
        riskAdjust: prev.riskAdjust - rec.predicted_risk_reduction
    }));
    
    // Visual feedback (simulated)
    const notification = new CustomEvent('ib-notification', {
        detail: { title: t('portfolio_rebalanced_notif'), message: rec.summary }
    });
    window.dispatchEvent(notification);
  };

  return (
    <div className="command-center animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Portfolio Header Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        <div className="glass-panel stat-card">
          <div className="stat-label">{t('total_aum')}</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
            <span className="stat-value">{t('unit_usd') === 'USD' ? '$' : ''}{(4.2 + (impactData.aumChange || 0)).toFixed(2)}{t('unit_b')}</span>
            {impactData.aumChange !== 0 && (
              <span style={{ fontSize: '14px', color: impactData.aumChange > 0 ? 'var(--risk-aa)' : 'var(--risk-d)', display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '800' }}>
                {impactData.aumChange > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {Math.abs(impactData.aumChange * 100).toFixed(1)}%
              </span>
            )}
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.03)', marginTop: '20px', borderRadius: '3px', overflow: 'hidden' }}>
             <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg, var(--neon-blue), transparent)', boxShadow: '0 0 15px var(--neon-blue)' }} />
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-label">{t('weighted_risk')}</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
            <span style={{ fontSize: '32px', fontWeight: '900', color: (32.4 + (impactData.riskAdjust || 0)) > 35 ? 'var(--risk-b)' : 'var(--risk-aa)' }}>
              {(32.4 + (impactData.riskAdjust || 0)).toFixed(1)} <small style={{ fontSize: '14px', opacity: 0.6 }}>pts</small>
            </span>
          </div>
          <div style={{ display: 'flex', gap: '6px', marginTop: '20px' }}>
             {[1,2,3,4,5,6,7,8,9,10].map(i => {
               const riskVal = (32.4 + (impactData.riskAdjust || 0));
               const threshold = i * 10;
               return (
                <div key={i} style={{ flex: 1, height: '8px', background: riskVal >= threshold ? 'var(--risk-d)' : (riskVal >= threshold - 10 ? 'var(--risk-b)' : 'var(--risk-aa)'), borderRadius: '4px', opacity: threshold <= 100 ? 1 : 0.05 }} />
               );
             })}
          </div>
        </div>
      </div>

      {/* Main Command Grid */}
      <div className="command-center-grid">
        
        {/* Left Column: Heatmap & Optimizer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Risk Heatmap */}
            <div className="glass-panel" style={{ padding: '32px' }}>
               <h3 style={{ margin: '0 0 24px', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <Server size={22} color="var(--neon-blue)" /> <span>{t('sector_concentration')}</span>
               </h3>
               <div className="heatmap-grid">
                  <div className="heatmap-cell" style={{ background: 'rgba(59, 130, 246, 0.15)', borderColor: 'rgba(59, 130, 246, 0.3)' }}>
                     <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '900', letterSpacing: '0.05em' }}>{t('sector_renewables')}</div>
                     <div style={{ fontSize: '24px', fontWeight: '900' }}>{weights.RENEWABLES}%</div>
                  </div>
                  <div className="heatmap-cell" style={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                     <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '900', letterSpacing: '0.05em' }}>{t('sector_infra')}</div>
                     <div style={{ fontSize: '24px', fontWeight: '900' }}>{weights.INFRA}%</div>
                  </div>
                  <div className="heatmap-cell" style={{ gridColumn: '1 / span 2', background: 'rgba(139, 92, 246, 0.1)', borderColor: 'rgba(139, 92, 246, 0.2)' }}>
                     <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '900', letterSpacing: '0.05em' }}>{t('sector_tech')}</div>
                     <div style={{ fontSize: '24px', fontWeight: '900' }}>{weights.TECH}%</div>
                  </div>
               </div>
            </div>

            {/* AI Portfolio Optimizer Component */}
            <AIPortfolioOptimizer 
                scenario={selectedScenario} 
                currentWeights={weights} 
                t={t} 
                onApply={handleApplyRebalance} 
            />
        </div>

        {/* Right Column: Macro Stress Simulator */}
        <div className="glass-panel" style={{ padding: '32px', height: 'fit-content' }}>
           <h3 style={{ margin: '0 0 24px', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
             <Zap size={22} color="#f59e0b" /> <span>{t('macro_scenario')}</span>
           </h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {scenarios.map(s => (
                <button 
                  key={s.id}
                  className={`macro-btn ${selectedScenario === s.id ? 'active' : ''}`}
                  onClick={() => handleScenarioChange(s)}
                >
                  <s.icon size={20} color={selectedScenario === s.id ? 'var(--neon-blue)' : '#475569'} />
                  <span style={{ flex: 1, fontSize: '14px', fontWeight: '800' }}>{s.label}</span>
                </button>
              ))}
           </div>

           <div style={{ marginTop: '32px', padding: '24px', background: 'rgba(0,0,0,0.3)', borderRadius: '20px', border: '1px dashed var(--border-glass)' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '900', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.1em' }}>{t('impact_forecast')}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#94a3b8', fontWeight: '600' }}>{t('portfolio_dscr_label')}</span>
                    <span style={{ color: impactData.dscrChange < 0 ? 'var(--risk-d)' : '#fff', fontWeight: '800' }}>{impactData.dscrChange > 0 ? '+' : ''}{impactData.dscrChange}x</span>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#94a3b8', fontWeight: '600' }}>{t('valuation_delta_label')}</span>
                    <span style={{ color: impactData.aumChange < 0 ? 'var(--risk-d)' : '#fff', fontWeight: '800' }}>{t('unit_usd') === 'USD' ? '$' : ''}{(impactData.aumChange * 1000).toFixed(0)}{t('unit_m')}</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

    </div>
  );
};

export default PortfolioCommandCenter;
