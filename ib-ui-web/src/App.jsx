import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SynergyInput from './components/SynergyInput';
import ValuationWaterfall from './components/ValuationWaterfall';
import RiskRadarChart from './components/RiskRadarChart';
import RiskEvaluationForm from './components/RiskEvaluationForm';
import { TrendingUp, Activity, LayoutDashboard, Database, Shield } from 'lucide-react';
import { Chart as ChartJS } from 'chart.js';
import './App.css';

ChartJS.defaults.font.family = "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif";


const API_BASE = 'http://localhost:8080/api/v1/mna';

function App() {
  const [dealId] = useState('DEAL-001');
  const [valuationData, setValuationData] = useState([2000, 0, 0, -200, 1800]);
  const [riskProfile, setRiskProfile] = useState([0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    fetchRealData();
  }, []);

  const fetchRealData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/synergies/${dealId}`);
      handleSynergyChange(res.data);
    } catch (err) {
      console.warn("Backend not reachable, using mock data.");
    }
  };

  const handleSynergyChange = (items) => {
    const costTotal = items.filter(i => i.category === 'COST').reduce((a, b) => a + (b.value || b.estimatedValue), 0);
    const revenueTotal = items.filter(i => i.category === 'REVENUE').reduce((a, b) => a + (b.value || b.estimatedValue), 0);
    const postValue = 2000 + costTotal + revenueTotal - 200;
    setValuationData([2000, costTotal, revenueTotal, -200, postValue]);
  };

  const handleRiskResult = (result) => {
    console.log("Risk Evaluation Result:", result);
    if (result.rawData) {
      setRiskProfile([
        result.rawData.financialScore,
        result.rawData.legalScore,
        result.rawData.operationalScore,
        result.rawData.securityScore,
        result.mlScore || 0,
        result.vdrScore || 0
      ]);
    } else {
      // Fallback
      setRiskProfile([80, 70, 85, 60, 50, 12.5]); 
    }
  };

  return (
    <div className="app-container">
      <nav className="sidebar">
        <div className="logo"><LayoutDashboard size={24} /> IB PLATFORM</div>
        <div className="nav-items">
          <div className="nav-item active"><Activity size={18} /> M&A 엔진</div>
          <div className="nav-item"><Shield size={18} /> 리스크 센터</div>
          <div className="nav-item"><TrendingUp size={18} /> PF 리스크</div>
        </div>
        <div className="db-status"><Database size={16} /> PostgreSQL 연결됨</div>
      </nav>
      
      <main className="main-content">
        <header>
          <h1>통합 IB 대시보드 (대상: {dealId})</h1>
          <div className="scenario-selector">
            <button className="scenario-btn active">기본 시나리오</button>
            <button className="scenario-btn">보수적 시나리오</button>
            <button className="scenario-btn">낙관적 시나리오</button>
          </div>
        </header>

        <div className="dashboard-grid">
          <div className="left-column">
            <SynergyInput onSynergyChange={handleSynergyChange} />
            <div style={{ marginTop: '24px' }}>
              <RiskEvaluationForm onResult={handleRiskResult} />
            </div>
          </div>
          <div className="right-column">
            <ValuationWaterfall data={valuationData} />
            <div style={{ marginTop: '24px' }}>
              <RiskRadarChart data={riskProfile} />
            </div>
            <div className="metrics-summary">
              <div className="metric-card">
                <span className="label">NPV (시너지)</span>
                <span className="value">$1,118M</span>
              </div>
              <div className="metric-card">
                <span className="label">거래 후 멀티플</span>
                <span className="value">12.6x</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
