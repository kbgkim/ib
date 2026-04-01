import React, { useState } from 'react';
import axios from 'axios';
import { Shield, Cpu, ShieldAlert, MessageSquare, Activity, RefreshCcw, Bell } from 'lucide-react';
import VoiceBriefing from './VoiceBriefing';

const API_BASE = 'http://localhost:8080/api/v1/risk';

const RiskEvaluationForm = ({ onResult, t, lang }) => {
  const [inputs, setInputs] = useState({
    financial: 80,
    legal: 70,
    operational: 85,
    security: 60,
    evaluatorId: 'IB_USER_01',
    evalComment: `DEAL-001 ${t('eval_draft')}`
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const showNotification = (title, message) => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification(title, { body: message, icon: '/favicon.ico' });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            new Notification(title, { body: message, icon: '/favicon.ico' });
          }
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        dealId: 'DEAL-001',
        evaluatorId: inputs.evaluatorId,
        evalComment: inputs.evalComment,
        rawData: {
          financialScore: inputs.financial,
          legalScore: inputs.legal,
          operationalScore: inputs.operational,
          securityScore: inputs.security
        }
      };
      const res = await axios.post(`${API_BASE}/evaluate`, payload);
      
      const mapped = {
        totalScore: res.data.master.totalScore,
        finalGrade: res.data.master.finalGrade,
        mlScore: res.data.mlResponse ? res.data.mlResponse.mlScore : 0,
        vdrScore: res.data.vdrMetrics ? res.data.vdrMetrics.totalRisk : 0,
        topFactors: res.data.mlResponse ? res.data.mlResponse.topFactors : [],
        advancedRisk: {
            expectedLoss: res.data.riskMetrics ? res.data.riskMetrics.expectedLoss : '150,000',
            var95: res.data.riskMetrics ? res.data.riskMetrics.var95 : '420,000',
            riskLevel: res.data.riskMetrics ? res.data.riskMetrics.riskLevel : 'MEDIUM'
        },
        rawData: payload.rawData
      };

      setResult(mapped);
      if (onResult) onResult(mapped);

      const notifTitle = t('analysis_done');
      const notifBody = `${t('final_grade_lbl')}: ${mapped.finalGrade}`;
      showNotification(notifTitle, notifBody);

    } catch (err) {
      console.error(err);
      alert(t('analysis_failed'));
    } finally {
      setLoading(false);
    }
  };

  const getGradeClass = (grade) => {
    if (!grade) return '';
    const simpleScale = grade.replace('+', '').replace('-', '');
    return `neon-glow-${simpleScale.toLowerCase()}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Input Panel */}
      <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
        <h2 style={{ fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa', margin: '0 0 16px 0' }}>
          <Activity size={18} /> {t('risk_simulator')} (v2.5)
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            {[
              { key: 'financial', label: lang === 'ko' ? '재무' : 'Finance' },
              { key: 'legal', label: lang === 'ko' ? '법무' : 'Legal' },
              { key: 'operational', label: lang === 'ko' ? '운영' : 'Operation' },
              { key: 'security', label: lang === 'ko' ? '보안' : 'Security' }
            ].map(({ key, label }) => (
              <div key={key}>
                <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>{label}</label>
                <input
                  type="range" min="0" max="100"
                  value={inputs[key]}
                  onChange={(e) => setInputs({ ...inputs, [key]: parseInt(e.target.value) })}
                  style={{ width: '100%', accentColor: '#3b82f6', height: '6px', borderRadius: '3px' }}
                />
                <div style={{ textAlign: 'right', fontSize: '12px', fontWeight: 'bold', marginTop: '2px' }}>{inputs[key]}</div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', background: 'linear-gradient(90deg, #3b82f6, #6366f1)',
              color: '#fff', border: 'none', padding: '12px', borderRadius: '10px',
              fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px', fontSize: '13px',
              transition: 'all 0.3s'
            }}
          >
            {loading ? <RefreshCcw size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Activity size={16} />}
            {loading ? t('analyzing') : t('execute_analysis')}
          </button>
        </form>
      </div>

      {/* AI Voice Briefing Panel */}
      {result && (
        <VoiceBriefing data={result.advancedRisk} lang={lang} t={t} />
      )}

      {/* Results Panel */}
      {!result ? (
        <div className="glass-panel" style={{
          padding: '24px', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center',
          color: '#64748b', gap: '10px'
        }}>
          <Shield size={36} color="#334155" />
          <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5 }}>
            {t('start_analysis_prompt')}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Score Card */}
          <div className="glass-panel animate-fade-in" style={{ padding: '20px', borderRadius: '16px', textAlign: 'center', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
               <Bell size={14} color="#3b82f6" />
               <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('total_risk_score')}</span>
            </div>
            <div style={{ fontSize: '52px', fontWeight: 'bold', color: '#3b82f6', lineHeight: 1.1, margin: '4px 0' }}>
              {result.totalScore.toFixed(0)}
            </div>
            <div className={`risk-grade-badge ${getGradeClass(result.finalGrade)}`}
              style={{ fontSize: '24px', display: 'inline-block', padding: '2px 16px', borderRadius: '8px' }}>
              {result.finalGrade}
            </div>
          </div>

          {/* Advanced Metrics */}
          <div className="glass-panel animate-fade-in" style={{ padding: '16px', borderRadius: '14px', background: 'rgba(59, 130, 246, 0.05)' }}>
             <div style={{ fontSize: '11px', color: '#60a5fa', fontWeight: 'bold', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={14} /> {t('advanced_metrics')}
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                   <div style={{ fontSize: '10px', color: '#94a3b8' }}>{t('expected_loss')}</div>
                   <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#e2e8f0' }}>${result.advancedRisk.expectedLoss}</div>
                </div>
                <div>
                   <div style={{ fontSize: '10px', color: '#94a3b8' }}>{t('value_at_risk')}</div>
                   <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ef4444' }}>${result.advancedRisk.var95}</div>
                </div>
             </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .glass-panel { transition: all 0.3s ease; }
        .glass-panel:hover { border-color: rgba(96, 165, 250, 0.4); }
      `}</style>
    </div>
  );
};

export default RiskEvaluationForm;
