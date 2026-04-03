import React, { useState, useEffect } from 'react';
import { Shield, Zap, TrendingDown, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

const HedgingAdvisorPanel = ({ assetId, currentRisk, t }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sentinelMode, setSentinelMode] = useState(false);

  useEffect(() => {
    if (assetId && currentRisk > 60) {
      fetchRecommendations();
    }
  }, [assetId, currentRisk]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/hedging/recommendations/${assetId}?risk=${currentRisk}`);
      const data = await response.json();
      setRecommendations(data || []);
    } catch (err) {
      console.error('Failed to fetch hedging recommendations', err);
    } finally {
      setLoading(false);
    }
  };

  const executeHedge = async (strategyId) => {
    try {
      const response = await fetch(`/api/v1/hedging/execute/${strategyId}`, { method: 'POST' });
      const data = await response.json();
      if (data && data.status === 'EXECUTED') {
        setRecommendations(prev => prev.map(r => r.id === strategyId ? { ...r, status: 'EXECUTED' } : r));
      }
    } catch (err) {
      console.error('Failed to execute hedge', err);
    }
  };

  if (!assetId || currentRisk <= 60) return null;

  return (
    <div className="glass-panel animate-slide-in-right" style={{ 
      width: '320px', 
      height: '100%', 
      background: 'rgba(15, 23, 42, 0.95)', 
      borderLeft: '1px solid rgba(255, 255, 255, 0.14)',
      padding: '24px',
      overflowY: 'auto',
      position: 'absolute',
      right: 0,
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield color="var(--neon-blue)" size={24} />
          <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#fff', margin: 0 }}>{t('auto_hedging')}</h3>
        </div>
        <div 
          onClick={() => setSentinelMode(!sentinelMode)}
          style={{ 
            cursor: 'pointer',
            padding: '4px 10px',
            borderRadius: '20px',
            background: sentinelMode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(100, 116, 139, 0.2)',
            border: `1px solid ${sentinelMode ? 'var(--neon-green)' : '#64748b'}`,
            fontSize: '10px',
            fontWeight: '900',
            color: sentinelMode ? 'var(--neon-green)' : '#94a3b8',
            display: 'flex', alignItems: 'center', gap: '4px'
          }}
        >
          {sentinelMode ? <Zap size={10} /> : null}
          SENTINEL
        </div>
      </div>

      <div style={{ marginBottom: '24px', padding: '16px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <AlertTriangle color="#ef4444" size={16} />
          <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: '900', textTransform: 'uppercase' }}>Critical Exposure</span>
        </div>
        <div style={{ fontSize: '28px', fontWeight: '900', color: '#fff' }}>
          {currentRisk.toFixed(1)} <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: '4px' }}>Risk Points</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {recommendations.length > 0 ? recommendations.map((item) => (
          <div key={item.id} className="glass-panel" style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '11px', color: 'var(--neon-blue)', fontWeight: '900', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingDown size={14} />
              {item.expectedRiskReduction?.toFixed(1)}% {t('reduction_potential')}
            </div>
            <h4 style={{ fontSize: '15px', fontWeight: '900', color: '#fff', marginBottom: '4px' }}>
              {item.strategyType === 'FX' ? t('fx_hedging') : 
               item.strategyType === 'CREDIT' ? t('credit_hedging') : 
               item.strategyType === 'COMMODITY' ? t('commodity_hedging') : t('irs_hedging')}
            </h4>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '20px', lineHeight: '1.5' }}>{item.productName}</p>
            
            {item.status === 'EXECUTED' ? (
              <div style={{ 
                width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(34, 197, 94, 0.1)', 
                color: 'var(--neon-green)', fontSize: '12px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' 
              }}>
                <CheckCircle size={16} /> {t('status_active') || 'EXECUTED'}
              </div>
            ) : (
              <button 
                onClick={() => executeHedge(item.id)}
                className="glass-button" 
                style={{ 
                  width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)', 
                  color: '#fff', fontSize: '12px', fontWeight: '900', border: '1px solid rgba(59, 130, 246, 0.3)' 
                }}
              >
                {t('execute_hedge')}
              </button>
            )}
          </div>
        )) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b', fontSize: '13px' }}>
            {loading ? 'Analyzing markets...' : 'No hedging required for current levels.'}
          </div>
        )}
      </div>

      {sentinelMode && (
        <div className="glow-border" style={{ 
          marginTop: '24px', padding: '16px', borderRadius: '12px', 
          background: 'rgba(34, 197, 94, 0.03)', border: '1px dashed var(--neon-green)',
          display: 'flex', gap: '12px'
        }}>
          <ShieldCheck color="var(--neon-green)" size={24} />
          <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.5' }}>
            <strong style={{ color: 'var(--neon-green)', display: 'block', marginBottom: '2px' }}>Sentinel Active</strong>
            {t('sentinel_mode_desc') || 'The system will automatically execute hedging strategies for risks over 90 points.'}
          </div>
        </div>
      )}
    </div>
  );
};

export default HedgingAdvisorPanel;
