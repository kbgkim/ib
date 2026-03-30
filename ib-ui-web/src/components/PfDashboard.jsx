import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, XCircle, BarChart2, Layers, Activity } from 'lucide-react';

const PF_API = 'http://localhost:8082/api/v1/pf';

// Grade badge helper
const GradeBadge = ({ grade }) => {
  const colors = {
    SAFE: { bg: '#064e3b', text: '#34d399', label: '안전' },
    WARNING: { bg: '#78350f', text: '#fbbf24', label: '주의' },
    CAUTION: { bg: '#7c2d12', text: '#fb923c', label: '경고' },
    BREACH: { bg: '#7f1d1d', text: '#f87171', label: '위반' },
  };
  const c = colors[grade] || colors.WARNING;
  return (
    <span style={{ background: c.bg, color: c.text, padding: '2px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>
      {c.label}
    </span>
  );
};

// DSCR Gauge
const DscrGauge = ({ value, label, threshold = 1.20 }) => {
  const pct = Math.min((value / 2.0) * 100, 100);
  const isOk = value >= threshold;
  const color = value >= 1.30 ? '#10b981' : value >= 1.20 ? '#fbbf24' : '#ef4444';
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>{label}</div>
      <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto' }}>
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
          <circle cx="40" cy="40" r="32" fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 32 * pct / 100} ${2 * Math.PI * 32 * (1 - pct / 100)}`}
            strokeLinecap="round" transform="rotate(-90 40 40)"
            style={{ transition: 'stroke-dasharray 0.8s ease' }} />
        </svg>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color }}>{value?.toFixed(2)}x</div>
        </div>
      </div>
      <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>기준: {threshold}x</div>
    </div>
  );
};

// Tornado Chart (Sensitivity)
const TornadoChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  const maxRange = Math.max(...data.map(d => d.sensitivityRange));
  return (
    <div>
      {data.sort((a, b) => b.sensitivityRange - a.sensitivityRange).map((d, i) => {
        const pctDown = Math.abs(d.dscrChangeDown / maxRange) * 100;
        const pctUp = Math.abs(d.dscrChangeUp / maxRange) * 100;
        return (
          <div key={i} style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11px' }}>
              <span style={{ color: '#e2e8f0' }}>{d.variable}</span>
              <span style={{ color: '#94a3b8' }}>Range: ±{d.sensitivityRange.toFixed(3)}</span>
            </div>
            <div style={{ display: 'flex', height: '20px', borderRadius: '4px', overflow: 'hidden', gap: '2px', alignItems: 'center' }}>
              {/* 하락 바 (왼쪽) */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{
                  width: `${pctDown}%`, height: '100%', background: 'linear-gradient(90deg, #ef4444, #dc2626)',
                  borderRadius: '4px 0 0 4px', transition: 'width 0.8s ease'
                }} />
              </div>
              <div style={{ width: '2px', background: '#475569', flexShrink: 0 }} />
              {/* 상승 바 (오른쪽) */}
              <div style={{ flex: 1 }}>
                <div style={{
                  width: `${pctUp}%`, height: '100%', background: 'linear-gradient(90deg, #059669, #10b981)',
                  borderRadius: '0 4px 4px 0', transition: 'width 0.8s ease'
                }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
              <span>{d.dscrChangeDown.toFixed(3)}</span>
              <span>+{d.dscrChangeUp.toFixed(3)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Waterfall Table
const WaterfallTable = ({ data }) => {
  if (!data || data.length === 0) return null;
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            {['연도', '매출', 'OpEx', '세금', '선순위DS', 'DSRA', '메자닌', '배당', 'DSCR'].map(h => (
              <th key={h} style={{ padding: '6px 8px', color: '#94a3b8', textAlign: 'right', whiteSpace: 'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            const isConstruction = row.grossRevenue === 0;
            const dscrColor = row.dscr >= 1.30 ? '#10b981' : row.dscr >= 1.20 ? '#fbbf24' : row.dscr > 0 ? '#ef4444' : '#64748b';
            return (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: isConstruction ? 'rgba(99,102,241,0.05)' : 'transparent' }}>
                <td style={{ padding: '5px 8px', color: isConstruction ? '#818cf8' : '#e2e8f0', textAlign: 'right' }}>Y{row.year}</td>
                <td style={{ padding: '5px 8px', textAlign: 'right', color: '#e2e8f0' }}>{row.grossRevenue?.toLocaleString()}</td>
                <td style={{ padding: '5px 8px', textAlign: 'right', color: '#f87171' }}>{row.opexPaid?.toLocaleString()}</td>
                <td style={{ padding: '5px 8px', textAlign: 'right', color: '#fb923c' }}>{row.taxPaid?.toLocaleString()}</td>
                <td style={{ padding: '5px 8px', textAlign: 'right', color: '#60a5fa' }}>{row.seniorDsPaid?.toLocaleString()}</td>
                <td style={{ padding: '5px 8px', textAlign: 'right', color: '#a78bfa' }}>{row.dsraFunded?.toLocaleString()}</td>
                <td style={{ padding: '5px 8px', textAlign: 'right', color: '#c084fc' }}>{row.mezzPaid?.toLocaleString()}</td>
                <td style={{ padding: '5px 8px', textAlign: 'right', color: '#34d399' }}>{row.equityDist?.toLocaleString()}</td>
                <td style={{ padding: '5px 8px', textAlign: 'right', color: dscrColor, fontWeight: 'bold' }}>
                  {row.dscr > 0 ? `${row.dscr?.toFixed(2)}x` : '-'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// Main PF Dashboard Component
const PfDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [waterfall, setWaterfall] = useState(null);
  const [sensitivity, setSensitivity] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const PROJECT_ID = 'PF-001';

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [projRes, metRes, wfRes, senRes] = await Promise.all([
          axios.get(`${PF_API}/${PROJECT_ID}`),
          axios.get(`${PF_API}/${PROJECT_ID}/metrics`),
          axios.get(`${PF_API}/${PROJECT_ID}/waterfall`),
          axios.get(`${PF_API}/${PROJECT_ID}/sensitivity`),
        ]);
        setProject(projRes.data);
        setMetrics(metRes.data);
        setWaterfall(wfRes.data);
        setSensitivity(senRes.data);
      } catch (e) {
        setError('PF 엔진 연결 실패. 포트 8082 서버를 확인해주세요.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return (
    <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
      <Activity size={32} style={{ margin: '0 auto 12px', display: 'block', color: '#3b82f6' }} />
      <p>PF 엔진 데이터 로딩 중...</p>
    </div>
  );

  if (error) return (
    <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', color: '#ef4444' }}>
      <XCircle size={32} style={{ margin: '0 auto 12px', display: 'block' }} />
      <p style={{ margin: 0 }}>{error}</p>
      <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
        터미널에서 <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
          ./gradlew :ib-pf-engine:bootRun
        </code> 실행 필요
      </p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* 프로젝트 헤더 */}
      <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          <Layers size={20} color="#6366f1" />
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{project?.projectName}</h2>
          <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#94a3b8', background: 'rgba(99,102,241,0.15)', padding: '3px 10px', borderRadius: '6px' }}>
            {project?.dealType} · 총사업비 {project?.totalCapex?.toLocaleString()}억원
          </span>
        </div>
        <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
          대출기간 {project?.loanTenure}년 · 건설기간 {project?.constructionPeriod}년 · 할인율(WACC) {(project?.discountRate * 100)?.toFixed(2)}% · 상태: {project?.status}
        </p>
      </div>

      {/* 핵심 지표 */}
      <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '14px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart2 size={15} /> 핵심 재무 지표 (Coverage Ratios)
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
          <DscrGauge value={metrics?.minDscr} label="Min DSCR" threshold={1.20} />
          <DscrGauge value={metrics?.llcr} label="LLCR" threshold={1.30} />
          <DscrGauge value={metrics?.plcr} label="PLCR" threshold={1.50} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {[
            { label: 'DSCR 등급', grade: metrics?.dscrGrade },
            { label: 'LLCR 등급', grade: metrics?.llcrGrade },
            { label: 'PLCR 등급', grade: metrics?.plcrGrade },
          ].map(({ label, grade }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>{label}</div>
              <GradeBadge grade={grade} />
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '14px', paddingTop: '14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
          <div style={{ color: '#94a3b8' }}>연간 원리금 상환:</div>
          <div style={{ textAlign: 'right', fontWeight: 'bold' }}>{metrics?.annualDebtService?.toLocaleString()} 억원</div>
          <div style={{ color: '#94a3b8' }}>총 부채 잔액:</div>
          <div style={{ textAlign: 'right', fontWeight: 'bold' }}>{metrics?.totalDebt?.toLocaleString()} 억원</div>
          <div style={{ color: '#94a3b8' }}>평균 DSCR:</div>
          <div style={{ textAlign: 'right', fontWeight: 'bold', color: '#10b981' }}>{metrics?.avgDscr?.toFixed(4)}x</div>
        </div>
      </div>

      {/* 민감도 분석 (Tornado) */}
      <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '14px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={15} /> 민감도 분석 (Tornado Chart) — DSCR 변동 ±20%
        </h3>
        <TornadoChart data={sensitivity} />
      </div>

      {/* Cash Flow Waterfall 테이블 */}
      <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '14px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={15} /> Cash Flow Waterfall 분배 내역 (억원)
        </h3>
        <WaterfallTable data={waterfall} />
      </div>

    </div>
  );
};

export default PfDashboard;
