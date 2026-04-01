import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bot, Shield, TrendingUp, Zap, MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react';

const API_BASE = 'http://localhost:8080/api/v1/mna/advisor';

const AdvisorPanel = ({ dealId, onApplyStrategy, t }) => {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchAnalysis = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE}/analyze/${dealId}`, {});
            setAnalysis(res.data);
        } catch (err) {
            console.error("Advisor analysis error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalysis();
        const interval = setInterval(fetchAnalysis, 30000); // 30s auto-refresh for consensus
        return () => clearInterval(interval);
    }, [dealId]);

    const getAgentIcon = (name) => {
        switch (name) {
            case 'Lex': return <Shield size={16} />;
            case 'Quantara': return <TrendingUp size={16} />;
            case 'Synergy': return <Zap size={16} />;
            default: return <Bot size={16} />;
        }
    };

    const getRiskColor = (level) => {
        switch (level) {
            case 'HIGH': return '#ef4444';
            case 'MEDIUM': return '#fb923c';
            case 'LOW': return '#10b981';
            default: return '#94a3b8';
        }
    };

    return (
        <div className="advisor-panel-container glass-panel animate-fade-in">
            <div className="advisor-header">
                <div className="title">
                    <Bot size={20} className="neon-blue" />
                    <span>{t('aura_advisor_title')}</span>
                </div>
                <button className="refresh-btn" onClick={fetchAnalysis} disabled={loading}>
                    {loading ? t('analyzing') : t('refresh')}
                </button>
            </div>

            {analysis && (
                <div className="advisor-content">
                    <div className="summary-card">
                        <div className="summary-title">{t('consensus_summary')}</div>
                        <p className="summary-text">{analysis.summary}</p>
                    </div>

                    <div className="agent-reports">
                        {analysis.individual_reports.map((report, idx) => (
                            <div key={idx} className="agent-card">
                                <div className="agent-info">
                                    <div className="agent-avatar" style={{ backgroundColor: getRiskColor(report.risk_level) }}>
                                        {getAgentIcon(report.agent)}
                                    </div>
                                    <div className="agent-meta">
                                        <div className="agent-name">{report.agent} <span className="risk-tag" style={{ color: getRiskColor(report.risk_level) }}>[{report.risk_level}]</span></div>
                                        <div className="agent-persona">{report.persona}</div>
                                    </div>
                                </div>
                                <div className="agent-comment">
                                    <MessageSquare size={14} className="quote-icon" />
                                    <span>{report.comment}</span>
                                </div>
                                {report.action_link && (
                                    <div className="agent-action">
                                        <button 
                                            className="apply-strategy-btn"
                                            onClick={() => onApplyStrategy(report.action_link)}
                                        >
                                            <Zap size={12} fill="currentColor" />
                                            {report.action_link.label}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdvisorPanel;
