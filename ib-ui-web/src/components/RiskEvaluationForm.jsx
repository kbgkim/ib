import React, { useState } from 'react';
import axios from 'axios';
import { Shield, AlertTriangle, CheckCircle, User, MessageSquare } from 'lucide-react';

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
        <Shield size={20} color="#34d399" /> Advanced Risk Evaluator
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          {['financial', 'legal', 'operational', 'security'].map(key => (
            <div key={key}>
              <label style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '4px', textTransform: 'capitalize' }}>
                {key} Score (0-100)
              </label>
              <input 
                type="number" 
                value={inputs[key]}
                onChange={(e) => setInputs({...inputs, [key]: parseInt(e.target.value)})}
                style={{ width: '100%', background: '#2d333b', border: '1px solid #444', borderRadius: '6px', color: '#fff', padding: '8px' }}
              />
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '4px' }}>
            <User size={14} /> Evaluator ID
          </label>
          <input 
            type="text" 
            value={inputs.evaluatorId}
            onChange={(e) => setInputs({...inputs, evaluatorId: e.target.value})}
            style={{ width: '100%', background: '#2d333b', border: '1px solid #444', borderRadius: '6px', color: '#fff', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '4px' }}>
            <MessageSquare size={14} /> Evaluation Comments
          </label>
          <textarea 
            value={inputs.evalComment}
            onChange={(e) => setInputs({...inputs, evalComment: e.target.value})}
            style={{ width: '100%', background: '#2d333b', border: '1px solid #444', borderRadius: '6px', color: '#fff', padding: '8px', minHeight: '60px' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', background: '#3b82f6', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '20px' }}
        >
          {loading ? 'Evaluating...' : 'Run Integrated Risk Simulation'}
        </button>
      </form>

      {result && (
        <div style={{ background: '#2d333b', padding: '16px', borderRadius: '10px', borderLeft: `5px solid ${getTrafficLightColor(result.finalGrade)}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '14px', color: '#aaa' }}>Calculated Grade</span>
              <h3 style={{ fontSize: '24px', margin: '4px 0', color: getTrafficLightColor(result.finalGrade) }}>{result.finalGrade}</h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '14px', color: '#aaa' }}>Total Score</span>
              <h3 style={{ fontSize: '24px', margin: '4px 0' }}>{result.totalScore.toFixed(1)}</h3>
            </div>
          </div>
          <p style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '10px', fontStyle: 'italic' }}>
            "{result.description}"
          </p>
        </div>
      )}
    </div>
  );
};

export default RiskEvaluationForm;
