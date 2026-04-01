import React, { useState } from 'react';
import { LayoutGrid, Globe, TrendingUp, ShieldAlert, BarChart, Server, Zap, ArrowDownRight, ArrowUpRight } from 'lucide-react';

const PortfolioCommandCenter = ({ t, lang }) => {
  const [selectedScenario, setSelectedScenario] = useState('NORMAL');
  const [impactData, setImpactData] = useState({ aumChange: 0, dscrChange: 0, riskAdjust: 0 });

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

  return (
    <div className="command-center animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '20px' }}>
      
      {/* Portfolio Header Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' }}>{t('total_aum')}</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
            <span style={{ fontSize: '36px', fontWeight: '900', color: '#fff' }}>${(4.2 + (impactData.aumChange || 0)).toFixed(2)}B</span>
            {impactData.aumChange !== 0 && (
              <span style={{ fontSize: '14px', color: impactData.aumChange > 0 ? 'var(--risk-aa)' : 'var(--risk-d)', display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                {impactData.aumChange > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {Math.abs(impactData.aumChange * 100).toFixed(1)}%
              </span>
            )}
          </div>
          <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', marginTop: '16px', borderRadius: '2px' }}>
             <div style={{ width: '85%', height: '100%', background: 'var(--neon-blue)', borderRadius: '2px', boxShadow: '0 0 10px var(--neon-blue)' }} />
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' }}>{t('weighted_risk')}</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
            <span style={{ fontSize: '36px', fontWeight: '900', color: impactData.riskAdjust > 0 ? 'var(--risk-b)' : 'var(--risk-aa)' }}>
              {(32.4 + (impactData.riskAdjust || 0)).toFixed(1)} <small style={{ fontSize: '14px' }}>pts</small>
            </span>
          </div>
          <div style={{ display: 'flex', gap: '4px', marginTop: '16px' }}>
             {[1,2,3,4,5,6,7,8,9,10].map(i => (
               <div key={i} style={{ flex: 1, height: '8px', background: i <= 7 ? 'var(--risk-aa)' : 'rgba(255,255,255,0.05)', borderRadius: '2px' }} />
             ))}
          </div>
        </div>
      </div>

      {/* Main Command Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Risk Heatmap (Treemap Mockup) */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px' }}>
           <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px' }}>
             <Server size={20} color="var(--neon-blue)" /> {t('sector_concentration')}
           </h3>
           <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gridTemplateRows: '200px 150px', gap: '12px' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.4)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                 <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '800' }}>RENEWABLES (PF)</div>
                 <div style={{ fontSize: '20px', fontWeight: '900' }}>42%</div>
              </div>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                 <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '800' }}>INFRA (PF)</div>
                 <div style={{ fontSize: '20px', fontWeight: '900' }}>18%</div>
              </div>
              <div style={{ gridColumn: '1 / span 2', background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                 <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '800' }}>TECH M&A</div>
                 <div style={{ fontSize: '20px', fontWeight: '900' }}>40%</div>
              </div>
           </div>
        </div>

        {/* Macro Stress Simulator */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px', background: 'rgba(15, 23, 42, 0.4)' }}>
           <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px' }}>
             <Zap size={20} color="#f59e0b" /> {t('macro_scenario')}
           </h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {scenarios.map(s => (
                <button 
                  key={s.id}
                  onClick={() => handleScenarioChange(s)}
                  style={{
                    width: '100%', textAlign: 'left', padding: '16px', borderRadius: '14px',
                    background: selectedScenario === s.id ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${selectedScenario === s.id ? 'var(--neon-blue)' : 'rgba(255,255,255,0.05)'}`,
                    color: '#fff', cursor: 'pointer', transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', gap: '12px'
                  }}
                >
                  <s.icon size={18} color={selectedScenario === s.id ? 'var(--neon-blue)' : '#64748b'} />
                  <span style={{ flex: 1, fontSize: '13px', fontWeight: '700' }}>{s.label}</span>
                </button>
              ))}
           </div>

           <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', marginBottom: '12px' }}>{t('impact_forecast')}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: '#94a3b8' }}>Portfolio DSCR</span>
                    <span style={{ color: impactData.dscrChange < 0 ? 'var(--risk-d)' : '#fff' }}>{impactData.dscrChange > 0 ? '+' : ''}{impactData.dscrChange}x</span>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: '#94a3b8' }}>Valuation Delta</span>
                    <span style={{ color: impactData.aumChange < 0 ? 'var(--risk-d)' : '#fff' }}>${(impactData.aumChange * 1000).toFixed(0)}M</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

    </div>
  );
};

export default PortfolioCommandCenter;
