import React, { useState } from 'react';
import axios from 'axios';
import { Shield, Cpu, ShieldAlert, MessageSquare, Activity, RefreshCcw, AlertCircle } from 'lucide-react';

const API_BASE = 'http://localhost:8080/api/v1/risk';

const RiskEvaluationForm = ({ onResult }) => {
  const [inputs, setInputs] = useState({
    financial: 80,
    legal: 70,
    operational: 85,
    security: 60,
    evaluatorId: 'IB_USER_01',
    evalComment: 'DEAL-001 리스크 심사 초안'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

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
      
      // Phase 2: Map nested backend record to UI flat structure
      const mapped = {
        totalScore: res.data.master.totalScore,
        finalGrade: res.data.master.finalGrade,
        mlScore: res.data.mlResponse ? res.data.mlResponse.mlScore : 0,
        vdrScore: res.data.vdrMetrics ? res.data.vdrMetrics.totalRisk : 0,
        topFactors: res.data.mlResponse ? res.data.mlResponse.topFactors : [],
        rawData: payload.rawData
      };

      setResult(mapped);
      if (onResult) onResult(mapped);
    } catch (err) {
      console.error(err);
      alert('분석에 실패했습니다. 백엔드 상태를 확인해주세요.');
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
          <Activity size={18} /> 리스크 시뮬레이터 (v1.6)
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            {[
              { key: 'financial', label: '재무 리스크' },
              { key: 'legal', label: '법무 리스크' },
              { key: 'operational', label: '운영 리스크' },
              { key: 'security', label: '보안 리스크' }
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

          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
              <MessageSquare size={11} /> 정성적 심사 코멘트
            </label>
            <textarea
              value={inputs.evalComment}
              onChange={(e) => setInputs({ ...inputs, evalComment: e.target.value })}
              style={{
                width: '100%', padding: '8px', borderRadius: '8px', color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)',
                minHeight: '60px', boxSizing: 'border-box', resize: 'vertical', fontSize: '12px'
              }}
            />
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
            {loading ? 'AI 분석 중...' : '통합 리스크 정밀 분석 실행'}
          </button>
        </form>
      </div>

      {/* Results Panel */}
      {!result ? (
        <div className="glass-panel" style={{
          padding: '24px', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center',
          color: '#64748b', gap: '10px'
        }}>
          <Shield size={36} color="#334155" />
          <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5 }}>
            데이터를 입력하고<br />리스크 분석을 실행하세요
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Score Card */}
          <div className="glass-panel animate-fade-in" style={{ padding: '20px', borderRadius: '16px', textAlign: 'center' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Risk Score</span>
            <div style={{ fontSize: '52px', fontWeight: 'bold', color: '#3b82f6', lineHeight: 1.1, margin: '4px 0' }}>
              {result.totalScore.toFixed(0)}
            </div>
            <div className={`risk-grade-badge ${getGradeClass(result.finalGrade)}`}
              style={{ fontSize: '24px', display: 'inline-block', padding: '2px 16px', borderRadius: '8px' }}>
              {result.finalGrade}
            </div>
            {result.description && (
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>{result.description}</div>
            )}
          </div>

          {/* AI & VDR Stats */}
          <div className="glass-panel animate-fade-in" style={{
            padding: '14px', borderRadius: '14px',
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'
          }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Cpu color="#3b82f6" size={18} />
              <div>
                <div style={{ fontSize: '10px', color: '#94a3b8' }}>AI Confidence</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{result.mlScore ? result.mlScore.toFixed(1) : '0.0'}%</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <ShieldAlert color="#10b981" size={18} />
              <div>
                <div style={{ fontSize: '10px', color: '#94a3b8' }}>VDR 보안 탐지</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{result.vdrScore ? result.vdrScore.toFixed(1) : '0.0'}</div>
              </div>
            </div>
          </div>

          {/* Top Factors */}
          {result.topFactors && result.topFactors.length > 0 && (
            <div className="glass-panel animate-fade-in" style={{ padding: '14px', borderRadius: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', color: '#10b981', fontSize: '12px', fontWeight: 'bold' }}>
                <ShieldAlert size={14} /> AI 주요 리스크 탐지 요인 (Top 3)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {result.topFactors.map((f, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                      <span style={{ color: '#e2e8f0' }}>{f.factor}</span>
                      <span style={{ color: '#10b981', fontWeight: 'bold' }}>{f.weight}%</span>
                    </div>
                    <div style={{ height: '3px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${f.weight}%`, background: 'linear-gradient(90deg, #10b981, #059669)', transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default RiskEvaluationForm;
