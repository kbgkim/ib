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
import { TrendingUp, Activity, LayoutDashboard, Database, Shield, Layers, Grid } from 'lucide-react';
import { Chart as ChartJS } from 'chart.js';
import './App.css';

ChartJS.defaults.font.family = "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif";

const API_BASE = 'http://localhost:8080/api/v1/mna';

function App() {
  const [dealId] = useState('DEAL-001');
  const [activeTab, setActiveTab] = useState('mna'); // 'mna' | 'pf'
  const [view, setView] = useState('fleet'); // 'fleet' | 'detail'
  const [selectedProjectId, setSelectedProjectId] = useState('PF-001');
  const [synergyItems, setSynergyItems] = useState([]);
  const [scenarioData, setScenarioData] = useState(null); // { BEAR: {}, BASE: {}, BULL: {} }
  const [weights, setWeights] = useState({ bear: 20, base: 50, bull: 30 });
  const [riskProfile, setRiskProfile] = useState([80, 70, 85, 60, 50, 12.5]);

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

  // Real-time Weighted Average Calculation (Latency-free Simulation)
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
      return (valBear * wBear) + (valBase * wBase) + (valBull * wBull);
    });
  }, [scenarioData, weights]);

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
    }
  };

  return (
    <div className="app-container">
      <nav className="sidebar">
        <div className="logo"><LayoutDashboard size={24} /> IB 통합 플랫폼</div>
        <div className="nav-items">
          <div
            className={`nav-item ${view === 'fleet' ? 'active' : ''}`}
            onClick={() => setView('fleet')}
            style={{ cursor: 'pointer' }}
          >
            <Grid size={18} /> 딜 플릿 현황
          </div>
          <div style={{ padding: '16px 0 8px 12px', fontSize: '10px', color: '#475569', fontWeight: '800' }}>자산 유형 (ASSETS)</div>
          <div
            className={`nav-item ${view === 'detail' && activeTab === 'mna' ? 'active' : ''}`}
            onClick={() => { setView('detail'); setActiveTab('mna'); }}
            style={{ cursor: 'pointer' }}
          >
            <Activity size={18} /> M&A 엔진
          </div>
          <div
            className={`nav-item ${view === 'detail' && activeTab === 'pf' ? 'active' : ''}`}
            onClick={() => { setView('detail'); setActiveTab('pf'); }}
            style={{ cursor: 'pointer' }}
          >
            <Layers size={18} /> PF 파이낸스
          </div>
          <div className="nav-item" style={{ cursor: 'default', opacity: 0.4 }}>
            <Shield size={18} /> ECM/DCM <span style={{ fontSize: '10px', marginLeft: '4px' }}>(준비중)</span>
          </div>
        </div>
        <div className="db-status"><Database size={16} /> PostgreSQL 연결됨</div>
      </nav>
      
      <main className="main-content">
        <MarketTicker />
        <header>
          <h1 style={{ fontWeight: '900', letterSpacing: '-1px' }}>{view === 'fleet' ? 'IB 통합 플랫폼: 딜 플릿 총괄 현황' : `통합 IB 대시보드 (대상: ${selectedProjectId})`}</h1>
        </header>

        {view === 'fleet' ? (
          <div style={{ padding: '24px' }}>
            <DealFleetOverview onSelectProject={handleSelectProject} />
          </div>
        ) : (
          <div className="dashboard-grid">
            {activeTab === 'mna' ? (
              <>
                <div className="left-column">
                  <ScenarioSelector 
                    weights={weights} 
                    onWeightsChange={setWeights}
                  />
                  <div style={{ marginTop: '24px' }}>
                    <SynergyInput onSynergyChange={handleSynergyChange} />
                  </div>
                  <div style={{ marginTop: '24px' }}>
                    <RiskEvaluationForm onResult={handleRiskResult} />
                  </div>
                  <div style={{ marginTop: '24px' }}>
                    <VdrInsightPanel onRiskUpdate={(adj) => setRiskProfile(prev => [prev[0], prev[1], prev[2], prev[3] + adj, prev[4], prev[5]])} />
                  </div>
                  <AdvisorPanel dealId={dealId} />
                </div>
                <div className="right-column">
                  <ValuationWaterfall 
                    data={weightedValuation} 
                    scenarios={scenarioData} 
                  />
                  <div style={{ marginTop: '24px' }}>
                    <RiskRadarChart data={riskProfile} />
                  </div>
                  <div className="metrics-summary">
                    <div className="metric-card">
                      <span className="label">가중 평균 NPV</span>
                      <span className="value">${weightedValuation[4].toFixed(0)}M</span>
                    </div>
                    <div className="metric-card">
                      <span className="label">기대 가중치 (Base)</span>
                      <span className="value">{weights.base}%</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ gridColumn: '1 / -1' }}>
                <PfDashboard key={selectedProjectId} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
