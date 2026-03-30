import React, { useState } from 'react';
import axios from 'axios';
import { Shield, AlertTriangle, CheckCircle, User, MessageSquare, Cpu, ShieldAlert } from 'lucide-react';

const API_BASE = 'http://localhost:8080/api/v1/risk';

const RiskEvaluationForm = ({ onResult }) => {
  const [inputs, setInputs] = useState({
    financial: 80,
    legal: 70,
    operational: 85,
    security: 60,
    evaluatorId: 'IB_USER_01',
    evalComment: 'Initial risk assessment for DEAL-001'
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
      alert('Risk evaluation failed. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const getTrafficLightColor = (grade) => {
    if (!grade) return '#444';
    if (grade.startsWith('AAA') || grade === 'AA') return '#4ade80'; // Green
    if (grade.startsWith('A') || grade.startsWith('B')) return '#facc15'; // Yellow
    return '#ef4444'; // Red (C, D)
  };

  return (
    <div className="risk-form-container" style={{ background: '#1a1d21', color: '#fff', padding: '24px', borderRadius: '12px' }}>
      <h2 style={{ fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Shield size={20} color="#34d399" /> 고급 리스크 시뮬레이터
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          {[
            { key: 'financial', label: '재무 점수' },
            { key: 'legal', label: '법무 점수' },
            { key: 'operational', label: '운영 점수' },
            { key: 'security', label: '보안 점수' }
          ].map(({ key, label }) => (
            <div key={key}>
              <label style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '4px', whiteSpace: 'nowrap' }}>
                {label} <span style={{fontSize: '10px', color: '#666'}}>(0-100)</span>
              </label>
              <input 
                type="number" 
                value={inputs[key]}
                onChange={(e) => setInputs({...inputs, [key]: parseInt(e.target.value)})}
                style={{ width: '100%', background: '#2d333b', border: '1px solid #444', borderRadius: '6px', color: '#fff', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '4px', whiteSpace: 'nowrap' }}>
            <User size={14} /> 평가자 ID
          </label>
          <input 
            type="text" 
            value={inputs.evaluatorId}
            onChange={(e) => setInputs({...inputs, evaluatorId: e.target.value})}
            style={{ width: '100%', background: '#2d333b', border: '1px solid #444', borderRadius: '6px', color: '#fff', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '4px', whiteSpace: 'nowrap' }}>
            <MessageSquare size={14} /> 코멘트 (선택사항)
          </label>
          <textarea 
            value={inputs.evalComment}
            onChange={(e) => setInputs({...inputs, evalComment: e.target.value})}
            style={{ width: '100%', background: '#2d333b', border: '1px solid #444', borderRadius: '6px', color: '#fff', padding: '8px', minHeight: '60px', boxSizing: 'border-box' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', background: '#3b82f6', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '2px', boxSizing: 'border-box' }}
        >
          {loading ? '평가 진행 중...' : '통합 리스크 분석 실행'}
        </button>
      </form>

      {result && (
        <div style={{ background: '#2d333b', padding: '20px', borderRadius: '10px', borderLeft: `5px solid ${getTrafficLightColor(result.finalGrade)}`, boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <span style={{ fontSize: '14px', color: '#aaa' }}>최종 등급</span>
              <h3 style={{ fontSize: '28px', margin: '4px 0', color: getTrafficLightColor(result.finalGrade) }}>{result.finalGrade}</h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '14px', color: '#aaa' }}>종합 리스크 점수</span>
              <h3 style={{ fontSize: '28px', margin: '4px 0', color: '#fff' }}>{result.totalScore.toFixed(1)}</h3>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: '#1a1d21', padding: '12px', borderRadius: '8px', border: '1px solid #3b82f6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa', marginBottom: '4px' }}>
                <Cpu size={16} /> 
                <span style={{ fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>AI 신뢰도</span>
              </div>
              <div style={{ fontSize: '20px', color: '#fff', fontWeight: 'bold' }}>
                {result.mlScore ? result.mlScore.toFixed(1) : '0.0'}
              </div>
            </div>
            <div style={{ background: '#1a1d21', padding: '12px', borderRadius: '8px', border: '1px solid #10b981' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', marginBottom: '4px' }}>
                <ShieldAlert size={16} /> 
                <span style={{ fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>VDR 보안 점수</span>
              </div>
              <div style={{ fontSize: '20px', color: '#fff', fontWeight: 'bold' }}>
                {result.vdrScore ? result.vdrScore.toFixed(1) : '0.0'}
              </div>
            </div>
          </div>

          <p style={{ fontSize: '13px', color: '#cbd5e1', fontStyle: 'italic', borderTop: '1px solid #444', paddingTop: '12px' }}>
            "{result.description}"
          </p>
        </div>
      )}
    </div>
  );
};

export default RiskEvaluationForm;
