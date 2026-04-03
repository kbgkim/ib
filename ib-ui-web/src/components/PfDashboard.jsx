import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend as ChartLegend } from 'chart.js';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, XCircle, BarChart2, Layers, Activity, Save, List, History, ShieldAlert, Lightbulb, Settings } from 'lucide-react';
import StrategyAdvisor from './StrategyAdvisor';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, ChartLegend);

const PF_API = 'http://localhost:8082/api/v1/pf';

// Grade badge helper
const GradeBadge = ({ grade, t }) => {
  const meta = {
    SAFE: { class: 'neon-glow-aa', label: t('safe') },
    WARNING: { class: 'neon-glow-a', label: t('warning') },
    CAUTION: { class: 'neon-glow-b', label: t('caution') },
    BREACH: { class: 'neon-glow-d', label: t('breach') },
  };
  const m = meta[grade] || meta.WARNING;
  return (
    <span className={m.class} style={{ 
      background: 'rgba(255,255,255,0.05)', 
      padding: '4px 12px', 
      borderRadius: '8px', 
      fontSize: '11px', 
      fontWeight: '800',
      border: '1px solid rgba(255,255,255,0.1)',
      letterSpacing: '0.5px'
    }}>
      {m.label}
    </span>
  );
};

// DSCR Gauge
const DscrGauge = ({ value, label, threshold = 1.20 }) => {
  const pct = Math.min((value / 2.0) * 100, 100);
  const color = value >= 1.30 ? 'var(--risk-aa)' : value >= 1.20 ? 'var(--risk-a)' : 'var(--risk-d)';
  const glowClass = value >= 1.30 ? 'neon-glow-aa' : value >= 1.20 ? 'neon-glow-a' : 'neon-glow-d';
  
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px', fontWeight: '500' }}>{label}</div>
      <div style={{ position: 'relative', width: '90px', height: '90px', margin: '0 auto' }}>
        <svg width="90" height="90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          <circle cx="40" cy="40" r="34" fill="none" stroke={color} strokeWidth="6"
            strokeDasharray={`${2 * Math.PI * 34 * pct / 100} ${2 * Math.PI * 34 * (1 - pct / 100)}`}
            strokeLinecap="round" transform="rotate(-90 40 40)"
            className={glowClass}
            style={{ transition: 'stroke-dasharray 1s cubic-bezier(0.4, 0, 0.2, 1)' }} />
        </svg>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
          <div className={glowClass} style={{ fontSize: '18px', fontWeight: '900' }}>{value?.toFixed(2)}<span style={{fontSize: '10px'}}>x</span></div>
        </div>
      </div>
      <div style={{ fontSize: '10px', color: '#475569', marginTop: '6px' }}>Target: {threshold}x</div>
    </div>
  );
};

// Tornado Chart (Sensitivity)
const TornadoChart = ({ data, t }) => {
  if (!data || data.length === 0) return null;
  const maxRange = Math.max(...data.map(d => d.sensitivityRange));
  return (
    <div>
      {data.sort((a, b) => b.sensitivityRange - a.sensitivityRange).map((d, i) => {
        const pctDown = Math.abs(d.dscrChangeDown / maxRange) * 100;
        const pctUp = Math.abs(d.dscrChangeUp / maxRange) * 100;
        return (
          <div key={i} style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
              <span style={{ color: '#f1f5f9', fontWeight: '500' }}>{d.variable}</span>
              <span style={{ color: '#64748b' }}>{t('range_label')}: <span style={{color: 'var(--neon-blue)'}}>±{d.sensitivityRange.toFixed(3)}</span></span>
            </div>
            <div style={{ display: 'flex', height: '12px', borderRadius: '6px', overflow: 'hidden', gap: '4px', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '2px' }}>
              {/* 하락 바 (왼쪽) */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{
                  width: `${pctDown}%`, height: '100%', background: 'linear-gradient(90deg, var(--risk-d), #991b1b)',
                  borderRadius: '4px', transition: 'width 1s ease-out'
                }} />
              </div>
              <div style={{ width: '1px', height: '100%', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
              {/* 상승 바 (오른쪽) */}
              <div style={{ flex: 1 }}>
                <div style={{
                  width: `${pctUp}%`, height: '100%', background: 'linear-gradient(90deg, #065f46, var(--risk-aa))',
                  borderRadius: '4px', transition: 'width 1s ease-out'
                }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#475569', marginTop: '4px', fontVariantNumeric: 'tabular-nums' }}>
              <span>{d.dscrChangeDown.toFixed(3)}</span>
              <span>+{d.dscrChangeUp.toFixed(3)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Scenario Comparison Chart
const ScenarioComparisonChart = ({ scenarios }) => {
  if (!scenarios || scenarios.length === 0) return null;
  
  const displayScenarios = [...scenarios].reverse().slice(-5); // Show last 5
  
  const data = {
    labels: displayScenarios.map(s => s.scenarioName),
    datasets: [
      {
        label: 'Average DSCR',
        data: displayScenarios.map(s => {
          try {
            const metrics = JSON.parse(s.metrics);
            return metrics.avgDscr || 0;
          } catch(e) { return 0; }
        }),
        backgroundColor: 'rgba(0, 210, 255, 0.4)',
        borderColor: 'var(--neon-blue)',
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { 
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#64748b', font: { size: 10 } },
        suggestedMin: 1.0,
        suggestedMax: 2.0
      },
      y: {
        grid: { display: false },
        ticks: { color: '#f1f5f9', font: { size: 11, weight: '600' } }
      }
    }
  };

  return <Bar data={data} options={options} />;
};

// Waterfall Table
const WaterfallTable = ({ data, t }) => {
  if (!data || data.length === 0) return null;
  return (
    <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
            {[t('year'), t('gross_revenue'), t('opex'), t('tax'), t('senior_ds'), t('dsra'), t('mezzanine'), t('dividend'), 'DSCR'].map(h => (
              <th key={h} style={{ padding: '12px 8px', color: '#64748b', textAlign: 'right', whiteSpace: 'nowrap', fontWeight: '900', textTransform: 'uppercase' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            const isConstruction = row.grossRevenue === 0;
            const dscrColor = row.dscr >= 1.30 ? 'var(--risk-aa)' : row.dscr >= 1.20 ? 'var(--risk-a)' : row.dscr > 0 ? 'var(--risk-d)' : '#475569';
            return (
              <tr key={i} className="animate-fade-in" style={{ 
                borderBottom: '1px solid rgba(255,255,255,0.03)', 
                background: isConstruction ? 'rgba(99,102,241,0.03)' : 'transparent',
                transition: 'background 0.2s ease',
                animationDelay: `${i * 0.05}s`
              }}>
                <td style={{ padding: '10px 8px', color: isConstruction ? '#818cf8' : '#94a3b8', textAlign: 'right', fontWeight: '500' }}>Y{row.year}</td>
                <td style={{ padding: '10px 8px', textAlign: 'right', color: '#cbd5e1' }}>{row.grossRevenue?.toLocaleString()}</td>
                <td style={{ padding: '10px 8px', textAlign: 'right', color: '#94a3b8' }}>{row.opexPaid?.toLocaleString()}</td>
                <td style={{ padding: '10px 8px', textAlign: 'right', color: '#94a3b8' }}>{row.taxPaid?.toLocaleString()}</td>
                <td style={{ padding: '10px 8px', textAlign: 'right', color: 'var(--accent-blue)' }}>{row.seniorDsPaid?.toLocaleString()}</td>
                <td style={{ padding: '10px 8px', textAlign: 'right', color: '#818cf8' }}>{row.dsraFunded?.toLocaleString()}</td>
                <td style={{ padding: '10px 8px', textAlign: 'right', color: '#a78bfa' }}>{row.mezzPaid?.toLocaleString()}</td>
                <td style={{ padding: '10px 8px', textAlign: 'right', color: 'var(--risk-aa)', fontWeight: '600' }}>{row.equityDist?.toLocaleString()}</td>
                <td style={{ padding: '10px 8px', textAlign: 'right', color: dscrColor, fontWeight: '800' }}>
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
const PfDashboard = ({ t, lang, riskData, marketRate, formatCurrency }) => {
  const [metrics, setMetrics] = useState(null);
  const [waterfall, setWaterfall] = useState(null);
  const [sensitivity, setSensitivity] = useState(null);
  const [project, setProject] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newScenarioName, setNewScenarioName] = useState('');
  const [saving, setSaving] = useState(false);
  const [advice, setAdvice] = useState([]);
  const [simulationMode, setSimulationMode] = useState(false);
  const [originalProject, setOriginalProject] = useState(null);

  const PROJECT_ID = 'PF-001';

  useEffect(() => {
    const fetchAll = async () => {
    try {
        const [projRes, metRes, wfRes, senRes, scRes, adRes] = await Promise.all([
          axios.get(`${PF_API}/${PROJECT_ID}`),
          axios.get(`${PF_API}/${PROJECT_ID}/metrics`),
          axios.get(`${PF_API}/${PROJECT_ID}/waterfall`),
          axios.get(`${PF_API}/${PROJECT_ID}/sensitivity`),
          axios.get(`${PF_API}/${PROJECT_ID}/scenarios`),
          axios.get(`${PF_API}/${PROJECT_ID}/advice`),
        ]);
        setProject(projRes.data);
        setOriginalProject(projRes.data);
        setMetrics(metRes.data);
        setWaterfall(wfRes.data);
        setSensitivity(senRes.data);
        setScenarios(scRes.data);
        setAdvice(adRes.data);
      } catch (e) {
        setError(t('pf_engine_error'));
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleSaveScenario = async () => {
    if (!newScenarioName.trim()) return;
    setSaving(true);
    try {
      const payload = {
        scenarioName: newScenarioName,
        parameters: JSON.stringify(project),
        metrics: JSON.stringify(metrics),
        waterfallData: JSON.stringify(waterfall),
        sensitivityData: JSON.stringify(sensitivity)
      };
      await axios.post(`${PF_API}/${PROJECT_ID}/scenario`, payload);
      const scRes = await axios.get(`${PF_API}/${PROJECT_ID}/scenarios`);
      setScenarios(scRes.data);
      setShowSaveModal(false);
      setNewScenarioName('');
    } catch (e) {
      alert('시나리오 저장 실패');
    } finally {
      setSaving(false);
    }
  };

  const handleLoadScenario = (sc) => {
    try {
      setProject(JSON.parse(sc.parameters));
      setMetrics(JSON.parse(sc.metrics));
      if (sc.waterfallData) setWaterfall(JSON.parse(sc.waterfallData));
      if (sc.sensitivityData) setSensitivity(JSON.parse(sc.sensitivityData));
      
      // 알림 표시 (성공 메시지)
      alert(`시나리오 [${sc.scenarioName}]를 로드했습니다.`);
    } catch (e) {
      alert('시나리오 로드 실패: 데이터 형식이 올바르지 않습니다.');
    }
  };

  const handleDownloadReport = () => {
    window.open(`${PF_API}/${PROJECT_ID}/report`, '_blank');
  };

  const handleApplySimulation = (item) => {
    if (simulationMode) {
       // Reset first if already in simulation
       setProject(originalProject);
    }
    
    setSimulationMode(true);
    // Mock simulation effect based on advice category
    if (item.actionType === 'REFINANCE') {
       setProject(prev => ({ ...prev, interestRate: item.diffValue, status: 'REFINANCING SIMULATED' }));
    } else if (item.actionType === 'EQUITY_INJECTION') {
       setProject(prev => ({ ...prev, totalOpeningCash: prev.totalOpeningCash + item.diffValue, status: 'EQUITY SIMULATED' }));
    }
    
    alert(`시나리오 [${item.title}]를 가상으로 적용했습니다. 차트 데이터를 확인하세요.`);
  };

  const handleResetSimulation = () => {
    setProject(originalProject);
    setSimulationMode(false);
  };

  const handleMacroUpdate = async (field, value) => {
    const updatedProject = { ...project, [field]: value };
    setProject(updatedProject);
    setSimulationMode(true);
    
    // In a real app, this would be a POST to update the project or a specialized simulation API
    // For the MVP, we re-fetch metrics based on the updated local state if possible, 
    // but here we'll mock the re-calculation for UI responsiveness.
    try {
        const metRes = await axios.get(`${PF_API}/${PROJECT_ID}/metrics`); // In reality, we'd pass updated params
        setMetrics(metRes.data);
    } catch(e) {}
  };

  if (loading) return (
    <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
      <Activity size={32} style={{ margin: '0 auto 12px', display: 'block', color: '#3b82f6' }} />
      <p>{t('loading_pf')}</p>
    </div>
  );

  if (error) return (
    <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', color: '#ef4444' }}>
      <XCircle size={32} style={{ margin: '0 auto 12px', display: 'block' }} />
      <p style={{ margin: 0 }}>{error}</p>
      <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
        Check PF Engine status (Port 8082).
      </p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Smart Alert Banner */}
      {metrics?.minDscr < 1.15 && (
        <div className="glass-panel animate-fade-in" style={{ 
          padding: '12px 20px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.3)',
          background: 'rgba(239, 68, 68, 0.05)', display: 'flex', alignItems: 'center', gap: '12px'
        }}>
          <AlertTriangle color="var(--risk-d)" size={20} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff' }}>{t('covenant_breach_warning')}</div>
            <div style={{ fontSize: '11px', color: '#fca5a5' }}>{t('covenant_breach_desc')}</div>
          </div>
          <button style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline' }}>{t('check_strategy')}</button>
        </div>
      )}

      {/* Strategy Advisor Section */}
      <StrategyAdvisor advice={advice} onApplySimulation={handleApplySimulation} t={t} />

      {/* Macro Scenario Controls */}
      <div className="glass-panel animate-fade-in" style={{ padding: '24px', borderRadius: '16px', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--neon-blue)', fontWeight: '900', fontSize: '14px', borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '24px' }}>
          <TrendingUp size={18} /> {t('macro_stress_test')}
        </div>
        <div style={{ display: 'flex', gap: '24px', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase' }}>{t('yield_curve')}</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => handleMacroUpdate('yieldCurveId', 'STEEP')}
                className="glass-button" 
                style={{ fontSize: '11px', padding: '8px 16px', background: project?.yieldCurveId === 'STEEP' ? 'var(--neon-blue)' : '', color: project?.yieldCurveId === 'STEEP' ? '#000' : '', fontWeight: '900' }}>{t('steepening')}</button>
              <button 
                onClick={() => handleMacroUpdate('yieldCurveId', 'INVERTED')}
                className="glass-button" 
                style={{ fontSize: '11px', padding: '8px 16px', background: project?.yieldCurveId === 'INVERTED' ? 'var(--risk-d)' : '', color: project?.yieldCurveId === 'INVERTED' ? '#fff' : '', fontWeight: '900' }}>{t('inverted')}</button>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase' }}>{t('cpi_shock')}</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => handleMacroUpdate('inflationRate', 0.02)}
                className="glass-button" 
                style={{ fontSize: '11px', padding: '8px 16px', background: project?.inflationRate === 0.02 ? 'var(--risk-aa)' : '', color: project?.inflationRate === 0.02 ? '#000' : '', fontWeight: '900' }}>{t('base_inflation')}</button>
              <button 
                onClick={() => handleMacroUpdate('inflationRate', 0.05)}
                className="glass-button" 
                style={{ fontSize: '11px', padding: '8px 16px', background: project?.inflationRate === 0.05 ? 'var(--risk-b)' : '', color: project?.inflationRate === 0.05 ? '#000' : '', fontWeight: '900' }}>{t('shock_inflation')}</button>
            </div>
          </div>
        </div>
      </div>

      {/* Simulation Mode Banner */}
      {simulationMode && (
        <div className="glass-panel animate-fade-in" style={{ 
          padding: '12px 20px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.4)',
          background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', gap: '12px'
        }}>
          <Settings color="var(--risk-aa)" size={18} className="animate-spin" />
          <div style={{ flex: 1, fontSize: '12px', fontWeight: '900', color: '#fff' }}>
             {t('sim_mode_on')}
          </div>
          <button onClick={handleResetSimulation} className="glass-button" style={{ fontSize: '11px', padding: '6px 12px' }}>{t('stop_sim')}</button>
        </div>
      )}

      {/* 프로젝트 헤더 */}
      <div className="glass-panel animate-fade-in" style={{ padding: '24px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
          <div style={{ background: 'rgba(99,102,241,0.1)', padding: '10px', borderRadius: '12px' }}>
            <Layers size={24} color="var(--neon-blue)" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '900', letterSpacing: '-0.5px', color: '#fff' }}>{project?.projectName}</h2>
            <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
              <span style={{ fontSize: '11px', color: 'var(--neon-blue)', background: 'rgba(0,210,255,0.1)', padding: '3px 10px', borderRadius: '20px', fontWeight: '700' }}>
                {project?.dealType}
              </span>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                {t('total_project_cost')} <span style={{color: '#fff', fontWeight: '900'}}>
                    {formatCurrency(project?.totalCapex / marketRate * 1000 / 1000)}
                </span>
              </span>
            </div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('status_label')}</div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--risk-aa)' }}>{project?.status}</div>
            </div>
            
                <button 
                   onClick={handleDownloadReport}
                   className="glass-button" 
                   style={{ 
                     padding: '8px 16px', 
                     background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)',
                     color: '#fff', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: '900'
                   }}>
                   <Activity size={14} /> {t('report_pdf')}
                </button>
             </div>
             <div style={{ marginLeft: '12px' }}>
                <button 
                  onClick={() => setShowSaveModal(true)}
                  className="glass-button" 
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', 
                    background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.4)',
                    color: '#fff', borderRadius: '10px', fontSize: '13px', cursor: 'pointer',
                    fontWeight: '900'
                  }}>
                  <Save size={16} /> {t('save_scenario')}
                </button>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '16px', paddingTop: '16px', display: 'flex', gap: '24px', fontSize: '12px', color: '#64748b' }}>
          <span>{t('loan_tenure')}: <strong style={{color: '#94a3b8'}}>{project?.loanTenure}Y</strong></span>
          <span>{t('construction_period_lbl')}: <strong style={{color: '#94a3b8'}}>{project?.constructionPeriod}Y</strong></span>
          <span>{t('wacc')}: <strong style={{color: 'var(--accent-green)'}}>{(project?.discountRate * 100)?.toFixed(2)}%</strong></span>
        </div>
      </div>

      <div className="dashboard-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* 핵심 지표 */}
          <div className="glass-panel animate-fade-in" style={{ padding: '24px', borderRadius: '16px', animationDelay: '0.1s' }}>
            <h3 style={{ margin: '0 0 24px', fontSize: '16px', color: 'var(--neon-blue)', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '900', textTransform: 'uppercase' }}>
              <BarChart2 size={18} /> {t('core_financial_metrics')}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
              <DscrGauge value={metrics?.minDscr} label={t('min_dscr_label')} threshold={1.20} />
              <DscrGauge value={metrics?.llcr} label={t('llcr_label')} threshold={1.30} />
              <DscrGauge value={metrics?.plcr} label={t('plcr_label')} threshold={1.50} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
              {[
                { label: t('dscr_grade_label'), grade: metrics?.dscrGrade },
                { label: t('llcr_grade_label'), grade: metrics?.llcrGrade },
                { label: t('plcr_grade_label'), grade: metrics?.plcrGrade },
              ].map(({ label, grade }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: '#475569', marginBottom: '6px', fontWeight: '800', letterSpacing: '0.5px' }}>{label}</div>
                  <GradeBadge grade={grade} t={t} />
                </div>
              ))}
            </div>
          </div>

          {/* Cash Flow Waterfall 테이블 */}
          <div className="glass-panel animate-fade-in" style={{ padding: '24px', borderRadius: '16px', animationDelay: '0.3s' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '16px', color: 'var(--neon-blue)', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '900', textTransform: 'uppercase' }}>
              <TrendingUp size={18} /> {t('cash_flow_waterfall')}
            </h3>
            <WaterfallTable data={waterfall} t={t} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* 요약 메트릭 카드 */}
          <div className="glass-panel animate-fade-in" style={{ padding: '24px', borderRadius: '16px', animationDelay: '0.2s' }}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="metric-card">
                  <span className="label">{t('annual_debt_service')}</span>
                  <span className="value" style={{color: 'var(--accent-blue)', fontSize: '28px'}}>
                    {formatCurrency(metrics?.annualDebtService / marketRate * 10, 'B')}
                  </span>
                </div>
                <div className="metric-card">
                  <span className="label">{t('total_debt_balance')}</span>
                  <span className="value" style={{color: '#94a3b8', fontSize: '28px'}}>
                    {formatCurrency(metrics?.totalDebt / marketRate * 10, 'B')}
                  </span>
                </div>
                <div className="metric-card">
                  <span className="label">{t('avg_ops_dscr')}</span>
                  <span className="value" style={{color: 'var(--risk-aa)', fontSize: '28px'}}>{metrics?.avgDscr?.toFixed(3)}x</span>
                </div>
                <div className="metric-card" style={{ border: '1px solid rgba(245, 158, 11, 0.2)', background: 'rgba(245, 158, 11, 0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="label" style={{ color: '#f59e0b' }}>VDR {t('real_time_risk_label')}</span>
                    <ShieldAlert size={16} color="#f59e0b" />
                  </div>
                  <span className="value" style={{color: '#f59e0b', fontSize: '28px'}}>{riskData[5] || '12.5'} <span style={{fontSize: '14px'}}>pts</span></span>
                  <div style={{ fontSize: '10px', color: '#92400e', marginTop: '4px' }}>* {t('vdr_data_basis')}</div>
                </div>
             </div>
          </div>

          {/* 민감도 분석 (Tornado) */}
          <div className="glass-panel animate-fade-in" style={{ padding: '24px', borderRadius: '16px', animationDelay: '0.4s' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '16px', color: 'var(--neon-blue)', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '900', textTransform: 'uppercase' }}>
              <Activity size={18} /> {t('sensitivity_analysis_tornado')}
            </h3>
            <TornadoChart data={sensitivity} t={t} />
            <p style={{ margin: '12px 0 0', fontSize: '11px', color: '#475569', lineHeight: '1.5', fontWeight: '500' }}>
              {t('tornado_desc')}
            </p>
          </div>

          {/* 저장된 시나리오 목록 */}
          <div className="glass-panel animate-fade-in" style={{ padding: '24px', borderRadius: '16px', animationDelay: '0.5s' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '900', textTransform: 'uppercase' }}>
              <History size={18} /> {t('recent_scenarios')} ({scenarios.length})
            </h3>
            
            {scenarios.length > 1 && (
              <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '12px', fontWeight: '700', letterSpacing: '0.5px' }}>{t('scenario_comparison_title')}</div>
                <ScenarioComparisonChart scenarios={scenarios} />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {scenarios.length === 0 ? (
                <div style={{ fontSize: '12px', color: '#475569', textAlign: 'center', padding: '20px' }}>{t('no_saved_scenarios')}</div>
              ) : (
                scenarios.slice(0, 3).map((sc, idx) => (
                  <div key={idx} style={{ 
                    padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#e2e8f0' }}>{sc.scenarioName}</div>
                      <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>{new Date(sc.createdAt).toLocaleString()}</div>
                    </div>
                    <button 
                      onClick={() => handleLoadScenario(sc)}
                      className="glass-button" 
                      style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '6px' }}>{t('load_scenario_btn')}</button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save Scenario Modal */}
      {showSaveModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="glass-panel" style={{ width: '400px', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 style={{ margin: '0 0 12px', fontSize: '24px', fontWeight: '900', color: '#fff' }}>{t('save_scenario_title')}</h2>
            <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '32px', lineHeight: '1.6' }}>{t('save_scenario_desc')}</p>
            
            <div style={{ marginBottom: '32px' }}>
              <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('scenario_name_lbl')}</label>
              <input 
                type="text" 
                value={newScenarioName}
                onChange={(e) => setNewScenarioName(e.target.value)}
                placeholder={t('scenario_placeholder')}
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px', padding: '16px', color: '#fff', fontSize: '14px', outline: 'none', transition: 'all 0.3s'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <button 
                onClick={() => setShowSaveModal(false)}
                style={{ flex: 1, padding: '14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: '#94a3b8', cursor: 'pointer', fontWeight: '900', fontSize: '14px' }}>
                {t('cancel')}
              </button>
              <button 
                onClick={handleSaveScenario}
                disabled={saving}
                style={{ 
                  flex: 1, padding: '14px', background: 'var(--neon-blue)', border: 'none', 
                  borderRadius: '14px', color: '#000', fontWeight: '900', cursor: 'pointer',
                  fontSize: '14px', opacity: saving ? 0.5 : 1
                }}>
                {saving ? t('saving_lbl') : t('confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PfDashboard;
