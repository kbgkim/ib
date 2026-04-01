import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import SynergyInput from './components/SynergyInput';
import ValuationWaterfall from './components/ValuationWaterfall';
import ScenarioSelector from './components/ScenarioSelector';
import RiskRadarChart from './components/RiskRadarChart';
import RiskEvaluationForm from './components/RiskEvaluationForm';
import PfDashboard from './components/PfDashboard';
import DealFleetOverview from './components/DealFleetOverview';
import VdrInsightPanel from './components/VdrInsightPanel';
import MarketTicker from './components/MarketTicker';
import AdvisorPanel from './components/AdvisorPanel';
import ClientPortal from './components/ClientPortal';
import PortfolioCommandCenter from './components/PortfolioCommandCenter';
import { TrendingUp, Activity, LayoutDashboard, Database, Shield, Layers, Grid, ExternalLink, FileDown, Bell, Globe, LayoutGrid } from 'lucide-react';
import { Chart as ChartJS } from 'chart.js';
import { translations } from './utils/translations';
import './App.css';

ChartJS.defaults.font.family = "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif";

const API_BASE = 'http://localhost:8080/api/v1/mna';

function App() {
  const [dealId] = useState('DEAL-001');
  const [activeTab, setActiveTab] = useState('mna'); // 'mna' | 'pf'
  const [isMitigated, setIsMitigated] = useState(false);
  const [mitigationLabel, setMitigationLabel] = useState("");
  const [view, setView] = useState('command'); // 'fleet' | 'detail' | 'portal' | 'command'
  const [selectedProjectId, setSelectedProjectId] = useState('PF-001');
  const [synergyItems, setSynergyItems] = useState([]);
  const [scenarioData, setScenarioData] = useState(null); // { BEAR: {}, BASE: {}, BULL: {} }
  const [weights, setWeights] = useState({ bear: 20, base: 50, bull: 30 });
  const [riskProfile, setRiskProfile] = useState([80, 70, 85, 60, 50, 12.5]);
  
  // Phase 10: Global State (i18n & Notifications)
  const [lang, setLang] = useState('ko');
  const [notifications, setNotifications] = useState([]);
  const [showNotifInbox, setShowNotifInbox] = useState(false);

  const t = (key) => translations[lang][key] || key;

  const handleSelectProject = (id) => {
    setSelectedProjectId(id);
    setView('detail');
    if (id.startsWith('PF')) {
      setActiveTab('pf');
    } else {
      setActiveTab('mna');
    }
  };

  useEffect(() => {
    fetchInitialSynergies();
  }, []);

  const fetchInitialSynergies = async () => {
    try {
      const res = await axios.get(`${API_BASE}/synergies/${dealId}`);
      handleSynergyChange(res.data);
    } catch (err) {
      console.warn("Backend not reachable, using placeholders.");
    }
  };

  const handleSynergyChange = async (items) => {
    setSynergyItems(items);
    try {
      const res = await axios.post(`${API_BASE}/full-scenario-data`, items);
      setScenarioData(res.data);
    } catch (err) {
      console.error("Full Scenario API Error:", err);
    }
  };

  // Real-time Weighted Average Calculation
  const weightedValuation = useMemo(() => {
    if (!scenarioData) return [2000, 0, 0, -200, 1800];
    
    const wBear = weights.bear / 100;
    const wBase = weights.base / 100;
    const wBull = weights.bull / 100;

    const keys = ['baseValue', 'costSynergy', 'revenueSynergy', 'integrationCost', 'postDealValue'];
    
    return keys.map(key => {
      const valBear = scenarioData.BEAR[key] || 0;
      const valBase = scenarioData.BASE[key] || 0;
      const valBull = scenarioData.BULL[key] || 0;
      let weighted = (valBear * wBear) + (valBase * wBase) + (valBull * wBull);
      
      if (isMitigated) {
        if (key === 'postDealValue' || key === 'baseValue') weighted *= 1.08;
        if (key === 'integrationCost') weighted *= 0.8;
      }
      return weighted;
    });
  }, [scenarioData, weights, isMitigated]);

  const handleApplyStrategy = (action) => {
    setIsMitigated(true);
    setMitigationLabel(action.label);
    
    const newNotif = {
        id: Date.now(),
        title: t('strategy_applied'),
        message: action.label,
        time: new Date().toLocaleTimeString()
    };
    setNotifications([newNotif, ...notifications]);
  };

  const handleExportReport = () => {
    window.open(`http://localhost:8080/api/v1/mna/report/download/${dealId}`);
  };

  const handleRiskResult = (result) => {
    if (result.rawData) {
      setRiskProfile([
        result.rawData.financialScore,
        result.rawData.legalScore,
        result.rawData.operationalScore,
        result.rawData.securityScore,
        result.mlScore || 0,
        result.vdrScore || 0
      ]);
      
      // Phase 9/10: Track real-time risk notifications
      const newNotif = {
          id: Date.now(),
          title: t('analysis_done'),
          message: `${t('final_grade_lbl')}: ${result.finalGrade}`,
          time: new Date().toLocaleTimeString()
      };
      setNotifications([newNotif, ...notifications]);
    }
  };

  if (view === 'portal') {
    return (
      <ClientPortal 
        dealId="DEAL-TITAN-2024" 
        valuation={weightedValuation[4]} 
        esgScore={riskProfile[4]} 
        t={t}
        lang={lang}
        onToggleLang={() => setLang(lang === 'ko' ? 'en' : 'ko')}
      />
    );
  }

  return (
    <div className={`app-container ${lang}`}>
      <aside className="sidebar">
        <div className="logo">
            <LayoutDashboard size={28} /> 
            <span className="text-gradient">{t('title')}</span>
        </div>
        <div className="nav-items">
          <div
            className={`nav-item ${view === 'command' ? 'active' : ''}`}
            onClick={() => setView('command')}
            style={{ cursor: 'pointer' }}
          >
            <LayoutGrid size={20} /> 
            <span>{t('command_center')}</span>
          </div>
          <div
            className={`nav-item ${view === 'fleet' ? 'active' : ''}`}
            onClick={() => setView('fleet')}
            style={{ cursor: 'pointer' }}
          >
            <Grid size={20} /> <span>{t('fleet_status')}</span>
          </div>
          <div
            className={`nav-item ${view === 'portal' ? 'active' : ''}`}
            onClick={() => setView('portal')}
            style={{ cursor: 'pointer' }}
          >
            <ExternalLink size={20} color="#10b981" /> <span style={{ color: '#10b981' }}>{t('stakeholder_portal')}</span>
          </div>
          
          <div style={{ padding: '32px 0 12px 18px', fontSize: '11px', color: '#475569', fontWeight: '900', letterSpacing: '0.1em' }}>{t('strategic_assets')}</div>
          
          <div
            className={`nav-item ${view === 'detail' && activeTab === 'mna' ? 'active' : ''}`}
            onClick={() => { setView('detail'); setActiveTab('mna'); }}
            style={{ cursor: 'pointer' }}
          >
            <Activity size={20} /> <span>{t('mna_engine')}</span>
          </div>
          <div
            className={`nav-item ${view === 'detail' && activeTab === 'pf' ? 'active' : ''}`}
            onClick={() => { setView('detail'); setActiveTab('pf'); }}
            style={{ cursor: 'pointer' }}
          >
            <Layers size={20} /> <span>{t('pf_finance')}</span>
          </div>
        </div>
        
        <div style={{ marginTop: 'auto', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#94a3b8' }}>
                <Database size={14} color="var(--neon-green)" />
                <span>{t('node_label')}: US-EAST-1</span>
            </div>
        </div>
      </aside>
      
      <main className="main-content">
        <MarketTicker t={t} />
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 className="text-gradient" style={{ fontSize: '32px', marginBottom: '4px' }}>
                {view === 'fleet' ? t('fleet_status') : 
                 view === 'command' ? t('command_center') : 
                 `${t('title')} / ${selectedProjectId}`}
            </h1>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>
                {t('terminal_subtitle')}
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Language Toggle */}
            <button className="lang-toggle" onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}>
                <Globe size={16} /> {lang.toUpperCase()}
            </button>

            {/* Notification Bell */}
            <div className="notification-bell" onClick={() => setShowNotifInbox(!showNotifInbox)}>
                <Bell size={20} color="#94a3b8" />
                {notifications.length > 0 && <div className="notification-dot"></div>}
            </div>

            {showNotifInbox && (
                <div className="notification-inbox animate-fade-in">
                    <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontWeight: 'bold', fontSize: '14px' }}>
                        {t('notifications')}
                    </div>
                    {notifications.length === 0 ? (
                        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#475569', fontSize: '12px' }}>
                            {t('no_notifications')}
                        </div>
                    ) : (
                        notifications.map(n => (
                            <div key={n.id} className="notification-item">
                                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>{n.title}</div>
                                <div style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0' }}>{n.message}</div>
                                <div style={{ fontSize: '10px', color: '#475569' }}>{n.time}</div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {(view === 'detail' || view === 'command') && (
              <button className="export-report-btn" onClick={handleExportReport} style={{ background: view === 'command' ? 'rgba(59, 130, 246, 0.2)' : '' }}>
                <FileDown size={18} /> {view === 'command' ? t('portfolio_report') : t('intelligence_report')}
              </button>
            )}
          </div>
        </header>

        {view === 'fleet' ? (
          <div style={{ padding: '24px' }}>
            <DealFleetOverview onSelectProject={handleSelectProject} t={t} />
          </div>
        ) : view === 'command' ? (
          <PortfolioCommandCenter t={t} lang={lang} />
        ) : (
          <div className="dashboard-grid">
            {activeTab === 'mna' ? (
              <>
                <div className="left-column">
                  <ScenarioSelector 
                    weights={weights} 
                    onWeightsChange={setWeights}
                    t={t}
                  />
                  <div style={{ marginTop: '24px' }}>
                    <SynergyInput onSynergyChange={handleSynergyChange} t={t} />
                  </div>
                  <div style={{ marginTop: '24px' }}>
                    <RiskEvaluationForm onResult={handleRiskResult} t={t} lang={lang} />
                  </div>
                </div>
                <div className="right-column">
                  <ValuationWaterfall 
                    data={weightedValuation} 
                    scenarios={scenarioData}
                    t={t} 
                  />
                  <div style={{ marginTop: '24px' }}>
                    <RiskRadarChart data={riskProfile} t={t} />
                  </div>
                </div>
              </>
            ) : (
              <div style={{ gridColumn: '1 / -1' }}>
                <PfDashboard 
                  key={selectedProjectId} 
                  t={t} 
                  lang={lang} 
                  riskData={riskProfile} 
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
