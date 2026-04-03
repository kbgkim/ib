import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Target, Zap, ArrowRight, CheckCircle, RefreshCcw, Info } from 'lucide-react';

const AIPortfolioOptimizer = ({ scenario, currentWeights, t, onApply, formatCurrency }) => {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState(null);
  const [fixedFee, setFixedFee] = useState(0.01); // Default $10k per trade
  const [showSettings, setShowSettings] = useState(false);

  const assetRisks = {
    "RENEWABLES": 32.5,
    "INFRA": 18.2,
    "TECH": 45.8
  };

  const labels = {
    "RENEWABLES": t('sector_renewables'),
    "INFRA": t('sector_infra'),
    "TECH": t('sector_tech')
  };

  const handleOptimize = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:8000/api/v1/ml/optimizer/rebalance', {
        portfolio_id: "PF-MAIN-001",
        total_aum: 4.2, // Simulated AUM $4.2B
        current_weights: currentWeights,
        asset_risks: assetRisks,
        scenario: scenario,
        goal: "BALANCED",
        fixed_fee_per_trade: parseFloat(fixedFee)
      });
      setRecommendation(response.data);
    } catch (err) {
      console.error("ML Optimizer API Error:", err);
      // Fallback with Cost Simulation for demo
      const fallbackRec = {
        recommended_weights: {
          "RENEWABLES": scenario === 'SHOCK' ? 60.0 : 40.0,
          "INFRA": scenario === 'HIKE' ? 40.0 : 25.0,
          "TECH": scenario === 'VOLATILE' ? 20.0 : 35.0
        },
        predicted_risk_reduction: 8.5,
        total_fees: 0.45,
        estimated_tax: 1.2,
        net_impact_aum: 1.65,
        summary: "AI가 세액 상쇄(Netting) 전략을 적용하여 절세 효과를 포함한 리밸런싱 안을 도출했습니다."
      };
      setRecommendation(fallbackRec);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scenario) {
      setRecommendation(null);
    }
  }, [scenario]);

  return (
    <div className="glass-panel" style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Target size={22} color="var(--neon-blue)" /> {t('ai_rebalancing')}
            </h3>
            <button 
                onClick={() => setShowSettings(!showSettings)}
                style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'color 0.3s' }}
                onMouseEnter={(e) => (e.target.style.color = '#fff')}
                onMouseLeave={(e) => (e.target.style.color = '#475569')}
                title={t('optimization_settings')}
            >
                <RefreshCcw size={16} style={{ transform: showSettings ? 'rotate(45deg)' : '' }} />
            </button>
        </div>
        <button 
          onClick={handleOptimize}
          disabled={loading}
          style={{
            background: 'var(--neon-blue)', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '14px',
            fontSize: '13px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
            boxShadow: '0 0 20px rgba(0, 210, 255, 0.3)', transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
        >
          {loading ? <RefreshCcw size={16} className="animate-spin" /> : <Zap size={16} />}
          {t('optimize_now')}
        </button>
      </div>

      {showSettings && (
        <div className="animate-fade-in" style={{ marginBottom: '24px', padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '20px', border: '1px solid var(--border-glass)' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '900', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('optimization_settings')}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <label style={{ fontSize: '13px', color: '#64748b', fontWeight: '700' }}>{t('fixed_fee')} (M$):</label>
                <input 
                    type="number" 
                    value={fixedFee} 
                    onChange={(e) => setFixedFee(e.target.value)}
                    style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-glass)', color: '#fff', padding: '6px 12px', borderRadius: '8px', width: '100px', fontWeight: '800' }}
                />
            </div>
        </div>
      )}

      {!recommendation ? (
        <div style={{ padding: '60px 0', textAlign: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '24px', border: '1px dashed var(--border-glass)' }}>
          <Info size={40} color="#334155" style={{ marginBottom: '16px' }} />
          <div style={{ color: '#64748b', fontSize: '14px', fontWeight: '600' }}>{t('macro_scenario')}를 선택하고 최적화 버튼을 누르세요.</div>
        </div>
      ) : (
        <div className="animate-fade-in">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {Object.keys(currentWeights).map(key => (
              <div key={key} style={{ padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '900', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>{labels[key]}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                   <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '700' }}>{currentWeights[key]}%</span>
                   <ArrowRight size={14} color="#334155" />
                   <span style={{ fontSize: '20px', fontWeight: '900', color: '#fff' }}>{recommendation.recommended_weights[key]}%</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '20px', padding: '20px', marginBottom: '24px', border: '1px solid var(--border-glass)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '900', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t('rebalance_cost_breakdown')}</div>
                <div style={{ fontSize: '10px', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '3px 8px', borderRadius: '6px', fontWeight: '800' }}>{t('tax_netting_applied')}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                    <div style={{ fontSize: '11px', color: '#475569', marginBottom: '6px', fontWeight: '700' }}>{t('variable_fee')}</div>
                    <div style={{ fontSize: '18px', fontWeight: '900', color: '#94a3b8' }}>{formatCurrency(recommendation.total_fees, 'M')}</div>
                </div>
                <div>
                    <div style={{ fontSize: '11px', color: '#475569', marginBottom: '6px', fontWeight: '700' }}>{t('estimated_tax_lbl')}</div>
                    <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--risk-d)' }}>{formatCurrency(recommendation.estimated_tax, 'M')}</div>
                </div>
            </div>
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#fff', fontWeight: '900' }}>{t('net_portfolio_impact')}</span>
                <span style={{ fontSize: '22px', fontWeight: '900', color: 'var(--risk-d)' }}>-{formatCurrency(recommendation.net_impact_aum, 'M')}</span>
            </div>
          </div>

          <div style={{ padding: '20px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.2)', marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', color: '#10b981', fontWeight: '900', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.05em' }}>
              <CheckCircle size={16} /> {t('risk_reduction_ext')}
            </div>
            <div style={{ fontSize: '28px', fontWeight: '900', color: '#10b981' }}>
              -{recommendation.predicted_risk_reduction} <small style={{ fontSize: '14px', opacity: 0.8 }}>pts</small>
            </div>
            <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '10px', lineHeight: '1.6', fontWeight: '500' }}>
              {recommendation.summary}
            </div>
          </div>

          <button 
            onClick={() => onApply(recommendation)}
            style={{
              width: '100%', padding: '16px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid #10b981', color: '#fff', fontWeight: '900', cursor: 'pointer', transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => { e.target.style.background = '#10b981'; e.target.style.color = '#000'; }}
            onMouseLeave={(e) => { e.target.style.background = 'rgba(16, 185, 129, 0.2)'; e.target.style.color = '#fff'; }}
          >
            {t('apply_strategy')}
          </button>
        </div>
      )}
    </div>
  );
};

export default AIPortfolioOptimizer;
