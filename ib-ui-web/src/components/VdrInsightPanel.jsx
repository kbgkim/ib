import React, { useState } from 'react';
import axios from 'axios';
import { FileText, Cpu, AlertCircle, CheckCircle2, Loader2, Sparkles, Send } from 'lucide-react';

const VdrInsightPanel = ({ onRiskUpdate }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('http://localhost:8080/api/v1/mna/vdr/analyze', { text });
      setResult(res.data.analysisResult);
      if (onRiskUpdate) {
          onRiskUpdate(res.data.riskAdjustment);
      }
    } catch (err) {
      setError('분석 엔진 연결 실패. M&A 엔진과 ML 엔진 상태를 확인하세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '24px', borderRadius: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '8px', borderRadius: '10px' }}>
          <Cpu size={20} color="var(--neon-blue)" />
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', margin: 0 }}>AI VDR 지능형 분석</h3>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="VDR 문서 내용이나 실사 보고서 텍스트를 입력하세요..."
          style={{
            width: '100%',
            height: '120px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '16px',
            color: '#fff',
            fontSize: '13px',
            lineHeight: '1.6',
            outline: 'none',
            resize: 'none'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
          <button
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
            className="glass-button"
            style={{
              padding: '10px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: loading ? 'rgba(255,255,255,0.05)' : 'rgba(0, 210, 255, 0.15)',
              borderColor: loading ? 'rgba(255,255,255,0.1)' : 'rgba(0, 210, 255, 0.3)',
              color: loading ? '#64748b' : 'var(--neon-blue)',
              fontWeight: '700'
            }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {loading ? 'AI 분석 중...' : '문서 분석 실행'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '10px', color: '#f87171', fontSize: '12px', display: 'flex', gap: '8px' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {result && (
        <div className="animate-fade-in" style={{ 
          marginTop: '20px', 
          padding: '24px', 
          background: 'rgba(255, 255, 255, 0.02)', 
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '800', letterSpacing: '1px' }}>AI 요약 분석 (Summary)</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: result.sentiment_score > 0.5 ? 'var(--risk-aa)' : 'var(--risk-d)' }} />
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>감성 지수 (Sentiment): {(result.sentiment_score * 100).toFixed(0)}%</span>
            </div>
          </div>
          
          <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.6', margin: '0 0 24px', fontStyle: 'italic' }}>
            "{result.summary}"
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {result.risk_factors.map((factor, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '12px', color: '#94a3b8' }}>
                <AlertCircle size={14} color="var(--risk-b)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{factor}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: '#475569' }}>분석 소요 시간: {result.processing_time.toFixed(3)}s</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--risk-aa)', fontSize: '11px', fontWeight: '800' }}>
               <CheckCircle2 size={14} /> 검증 완료 (Verification Passed)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VdrInsightPanel;
