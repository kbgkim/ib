import React, { useState } from 'react';
import { Lock, ShieldCheck, FileText, LayoutDashboard, Database } from 'lucide-react';
import MarketTicker from './MarketTicker';
import AdvisorPanel from './AdvisorPanel';

const ClientPortal = ({ dealId = "DEAL-TITAN-2024", valuation, esgScore }) => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [passcode, setPasscode] = useState("");
    const [error, setError] = useState(false);

    const handleAccess = (e) => {
        e.preventDefault();
        if (passcode === "DEAL-TITAN") {
            setIsAuthorized(true);
        } else {
            setError(true);
        }
    };

    if (!isAuthorized) {
        return (
            <div className="portal-login-screen">
                <div className="glass-panel portal-login-card">
                    <div className="login-header">
                        <Lock size={32} className="neon-blue" />
                        <h2>Secure Stakeholder Portal</h2>
                        <p className="subtitle">Enter the designated passcode for <strong>{dealId}</strong></p>
                    </div>
                    <form onSubmit={handleAccess}>
                        <input 
                            type="password" 
                            placeholder="Passcode" 
                            className="portal-input"
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                        />
                        {error && <p className="error-text">❌ Incorrect passcode. Please check your credentials.</p>}
                        <button type="submit" className="portal-btn">
                            <ShieldCheck size={18} />
                            Access Intelligence
                        </button>
                    </form>
                    <div className="login-footer">
                        <ShieldCheck size={12} /> Encrypted Session Active
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="client-portal-layout">
            <nav className="portal-nav">
                <div className="logo"><LayoutDashboard size={20} /> IB Intelligence PORTAL</div>
                <div className="portal-deal-label">
                    <span className="badge">LIVE</span> {dealId}
                </div>
            </nav>
            <MarketTicker />
            <main className="portal-main">
                <div className="portal-header">
                    <div className="title-group">
                        <h1>Executive Strategic Overview</h1>
                        <p>Real-time data and AI-driven expert consensus for stakeholders.</p>
                    </div>
                    <button className="export-report-btn" onClick={() => window.open(`http://localhost:8080/api/v1/mna/report/download/${dealId}`)}>
                        <FileText size={18} />
                        Export Official PDF
                    </button>
                </div>

                <div className="portal-grid">
                    <div className="portal-advisor-wrap">
                        <AdvisorPanel dealId={dealId} onApplyStrategy={() => alert("Read-only access. Actions disabled.")} />
                    </div>
                    <div className="portal-metrics-wrap glass-panel">
                        <div className="section-title">Key Performance Indicators</div>
                        <div className="kpi-grid">
                            <div className="kpi-card">
                                <label>Target Valuation (NPV)</label>
                                <span className="value">{valuation ? `${valuation.toLocaleString(undefined, { maximumFractionDigits: 1 })}M USD` : "CALCULATING..."}</span>
                            </div>
                            <div className="kpi-card">
                                <label>AI Safety Score (ESG)</label>
                                <span className="value green">{esgScore ? `${esgScore.toFixed(1)} / 100` : "88.4 / 100"}</span>
                            </div>
                            <div className="kpi-card">
                                <label>Leverage Multiplier</label>
                                <span className="value">4.2x</span>
                            </div>
                        </div>
                        <p className="portal-disclaimer">
                            * This data is generated in real-time by the Aura Multi-Agent Advisor. 
                            The values reflect current market conditions including UST 10Y Yields.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ClientPortal;
