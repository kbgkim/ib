import React, { useState } from 'react';
import axios from 'axios';
import { Shield, AlertTriangle, CheckCircle, User, MessageSquare, Cpu, ShieldAlert, Zap, TrendingUp, RefreshCcw } from 'lucide-react';
import RiskRadarChart from './RiskRadarChart';

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
      setResult(res.data);
      if (onResult) onResult(res.data);
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

  const getRadarData = (res) => {
    if (!res) return [0, 0, 0, 0, 0, 0];
    return [
      res.rawData.financialScore,
      res.rawData.legalScore,
      res.rawData.operationalScore,
      res.rawData.securityScore,
      res.mlScore,
      res.vdrScore
    ];
  };

  return (
    <div className="risk-dashboard-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: '24px' }}>
        
        {/* Left: Input Panel */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', color: '#60a5fa' }}>
            <Zap size={22} fill="#60a5fa" /> 리스크 시뮬레이터
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              {[
                { key: 'financial', label: '재무 리스크' },
                { key: 'legal', label: '법무 리스크' },
                { key: 'operational', label: '운영 리스크' },
                { key: 'security', label: '보안 리스크' }
              ].map(({ key, label }) => (
                <div key={key}>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>{label}</label>
                  <input 
                    type="range" min="0" max="100"
                    value={inputs[key]}
                    onChange={(e) => setInputs({...inputs, [key]: parseInt(e.target.value)})}
                    style={{ width: '100%', accentColor: '#3b82f6', height: '6px', borderRadius: '3px' }}
                  />
                  <div style={{ textAlign: 'right', fontSize: '14px', fontWeight: 'bold', marginTop: '4px' }}>{inputs[key]}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
                  <User size={14} style={{ marginRight: '4px' }} /> 분석 책임자
                </label>
                <input 
                  type="text" 
                  value={inputs.evaluatorId}
                  onChange={(e) => setInputs({...inputs, evaluatorId: e.target.value})}
                  className="glass-panel"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', color: '#fff', border: 'none', background: 'rgba(255,255,255,0.05)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
                  <MessageSquare size={14} style={{ marginRight: '4px' }} /> 정성적 심사 코멘트
                </label>
                <textarea 
                  value={inputs.evalComment}
                  onChange={(e) => setInputs({...inputs, evalComment: e.target.value})}
                  className="glass-panel"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', color: '#fff', border: 'none', background: 'rgba(255,255,255,0.05)', minHeight: '80px' }}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="primary-btn"
              style={{ 
                width: '100%', 
                background: 'linear-gradient(90deg, #3b82f6, #6366f1)', 
                color: '#fff', border: 'none', padding: '16px', borderRadius: '12px', 
                fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'all 0.3s'
              }}
            >
              {loading ? <RefreshCcw className="spinning" size={20} /> : <TrendingUp size={20} />}
              {loading ? '데이터 엔진 연동 중...' : '통합 AI 리스크 분석 실행'}
            </button>
          </form>
        </div>

        {/* Right: Results Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {!result ? (
            <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center', color: '#64748b' }}>
              <Shield size={64} color="#334155" style={{ marginBottom: '24px' }} />
              <h3>데이터를 입력하고 리스크 분석을 실행하세요</h3>
              <p>재무, 법무, 운영, 보안 지표와 AI 예측 엔진이 결합된 <br/>통합 리스크 프로파일링이 제공됩니다.</p>
            </div>
          ) : (
            <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', flex: 1 }}>
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div className="risk-score-display">
                  <span style={{ fontSize: '14px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Risk Score</span>
                  <div className="risk-grade-badge" style={{ color: '#fff' }}>
                    {result.totalScore.toFixed(1)}
                  </div>
                  <div className={`risk-grade-badge ${getGradeClass(result.finalGrade)}`} style={{ fontSize: '5rem', marginTop: '-10px' }}>
                    {result.finalGrade}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '14px' }}>{result.description}</div>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '16px', color: '#94a3b8' }}>카테고리별 리스크 편차 (Radar)</h3>
                <RiskRadarChart data={getRadarData(result)} />
              </div>
            </div>
          )}

          {result && (
            <div className="glass-panel animate-fade-in" style={{ padding: '24px', borderRadius: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '12px' }}>
                  <Cpu color="#3b82f6" size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>AI 기반 정밀 분석 (Confidence)</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{result.mlScore ? result.mlScore.toFixed(1) : '0.0'}%</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '12px' }}>
                  <ShieldAlert color="#10b981" size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>VDR 보안 결함 탐지</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{result.vdrScore ? result.vdrScore.toFixed(1) : '0.0'} / 100</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        .spinning { animation: spin 2s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .primary-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.5); }
        .primary-btn:active { transform: translateY(0); }
      `}</style>
    </div>
  );
};

export default RiskEvaluationForm;
