import React, { useState } from 'react';
import { Lock, ShieldCheck, FileText, LayoutDashboard, Globe, ExternalLink, Activity, BarChart, ChevronRight } from 'lucide-react';
import MarketTicker from './MarketTicker';
import AdvisorPanel from './AdvisorPanel';
import InvestorTierCard from './InvestorTierCard';

const ClientPortal = ({ dealId = "DEAL-TITAN-2024", valuation, esgScore, t, lang, onToggleLang }) => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [passcode, setPasscode] = useState("");
    const [error, setError] = useState(false);
    const [notification, setNotification] = useState(null);

    const handleAccess = (e) => {
        e.preventDefault();
        if (passcode.toUpperCase() === "DEAL-TITAN") {
            setIsScanning(true);
            setError(false);
            setTimeout(() => {
                setIsScanning(false);
                setIsAuthorized(true);
            }, 2500);
        } else {
            setError(true);
        }
    };

    const showNotif = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 4000);
    };

    if (!isAuthorized) {
        return (
            <div className="portal-wrapper">
                <div className="portal-login-screen animate-fade-in">
                    <div className={`glass-panel portal-login-card ${isScanning ? 'glow-border-green' : ''}`} style={{ position: 'relative', overflow: 'hidden' }}>
                        {isScanning && <div className="scanline" />}
                        
                        <div style={{ position: 'absolute', top: '24px', right: '24px' }}>
                            <button className="lang-toggle" onClick={onToggleLang}>
                                <Globe size={16} /> {lang.toUpperCase()}
                            </button>
                        </div>
                        
                        {isScanning ? (
                            <div className="animate-fade-in" style={{ padding: '40px 0' }}>
                                <ShieldCheck size={64} color="var(--neon-green)" className="pulse-glow" style={{ marginBottom: '24px' }} />
                                <h2 style={{ fontSize: '24px', color: '#fff', marginBottom: '8px' }}>{t('analyzing')}</h2>
                                <p style={{ fontSize: '12px', color: '#475569', fontWeight: '800', letterSpacing: '2px' }}>
                                    {t('encrypted_session').toUpperCase()}
                                </p>
                                <div style={{ marginTop: '32px', display: 'flex', gap: '4px', justifyContent: 'center' }}>
                                   {[1,2,3,4,5].map(i => <div key={i} className="pulse-glow" style={{ width: '6px', height: '6px', background: 'var(--neon-green)', borderRadius: '50%', animationDelay: `${i*0.2}s` }} />)}
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="login-header">
                                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '20px', borderRadius: '50%', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                                            <Lock size={40} color="var(--neon-green)" />
                                        </div>
                                    </div>
                                    <h2>{t('secure_gateway')}</h2>
                                    <p style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>
                                        {t('enter_passcode')} <strong>{dealId}</strong>
                                    </p>
                                </div>
                                <form onSubmit={handleAccess}>
                                    <input 
                                        type="password" 
                                        placeholder="••••••••" 
                                        className="portal-input"
                                        value={passcode}
                                        onChange={(e) => setPasscode(e.target.value)}
                                        autoFocus
                                    />
                                    {error && (
                                        <p style={{ fontSize: '12px', color: 'var(--risk-d)', marginBottom: '16px', fontWeight: '900' }}>
                                            ⚠️ {t('access_denied_ext')}
                                        </p>
                                    )}
                                    <button type="submit" className="portal-btn">
                                        <ShieldCheck size={20} />
                                        {t('access_intel')}
                                    </button>
                                </form>
                                <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '11px', color: '#475569', fontWeight: '900', letterSpacing: '1px' }}>
                                    <ShieldCheck size={14} /> {t('encrypted_session').toUpperCase()}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="portal-wrapper animate-fade-in">
            <nav className="portal-nav">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '8px', borderRadius: '10px' }}>
                        <LayoutDashboard size={20} color="var(--neon-green)" />
                    </div>
                    <div>
                        <div style={{ fontSize: '16px', fontWeight: '900', color: '#fff', letterSpacing: '-0.5px', textTransform: 'uppercase' }}>{t('stakeholder_portal_title')}</div>
                        <div style={{ fontSize: '10px', color: '#475569', fontWeight: '800' }}>{t('allocation_engine')}</div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="pulse-glow" style={{ width: '8px', height: '8px', background: 'var(--neon-green)', borderRadius: '50%', boxShadow: '0 0 10px var(--neon-green)' }} />
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '10px', color: '#475569', fontWeight: '800' }}>{t('active_session_lbl')}</div>
                                <div style={{ fontSize: '12px', color: 'var(--neon-green)', fontWeight: '900' }}>{dealId}</div>
                            </div>
                        </div>
                        <button className="lang-toggle" onClick={onToggleLang} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <Globe size={16} /> {lang.toUpperCase()}
                        </button>
                    </div>
                    <button className="export-report-btn" onClick={() => window.open(`http://localhost:8080/api/v1/mna/report/download/${dealId}`)}>
                        <FileText size={18} /> {t('report_pdf')}
                    </button>
                </div>
            </nav>

            <MarketTicker t={t} />

            <main className="portal-main">
                {notification && (
                    <div className="portal-notification animate-fade-in">
                        <ShieldCheck size={18} color="var(--neon-green)" />
                        {notification}
                    </div>
                )}

                <div className="portal-header">
                    <div style={{ marginBottom: '32px' }}>
                        <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#fff', marginBottom: '8px', letterSpacing: '-1px' }}>{t('strategic_overview')}</h1>
                        <p style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>{t('real_time_consensus')}</p>
                    </div>
                </div>

                <div className="portal-grid stagger-fade-in">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--neon-green)', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Activity size={20} /> {t('kpi_performance')}
                                </h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div className="pulse-glow" style={{ width: '8px', height: '8px', background: 'var(--neon-green)', borderRadius: '50%' }} />
                                    <span style={{ fontSize: '10px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--neon-green)', padding: '4px 10px', borderRadius: '20px', fontWeight: '900' }}>{t('live_update')}</span>
                                </div>
                            </div>
                            <div className="kpi-grid">
                                <div className="kpi-card" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <label>{t('target_valuation_npv')}</label>
                                        <BarChart size={16} color="#475569" />
                                    </div>
                                    <div className="value">{valuation ? `${valuation.toLocaleString(undefined, { maximumFractionDigits: 1 })}${t('unit_m')}` : `4,250.2${t('unit_m')}`} <small style={{fontSize: '14px', color: '#475569'}}>{t('unit_usd')}</small></div>
                                    <div style={{ marginTop: '8px', fontSize: '10px', color: '#10b981', fontWeight: '800' }}>• {t('tax_netting_applied')}</div>
                                </div>
                                <div className="kpi-card" style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <label>{t('ai_safety_score_esg')}</label>
                                        <ShieldCheck size={16} color="var(--neon-green)" />
                                    </div>
                                    <div className="value green">{esgScore ? `${esgScore.toFixed(1)}` : "88.4"} <small style={{fontSize: '14px', color: '#10b981'}}>/ 100</small></div>
                                </div>
                                <div className="kpi-card" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <label>{t('leverage_multiplier')}</label>
                                        <Activity size={16} color="#475569" />
                                    </div>
                                    <div className="value">4.2<small style={{fontSize: '14px', color: '#475569'}}>x</small></div>
                                </div>
                            </div>
                            <p style={{ marginTop: '24px', fontSize: '11px', color: '#475569', fontStyle: 'italic', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                                {t('portal_disclaimer')}
                            </p>
                        </div>

                        <AdvisorPanel dealId={dealId} onApplyStrategy={(a) => showNotif(t('read_only_notif').replace('{{strategy}}', a.label))} t={t} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <InvestorTierCard tier="T1" t={t} />
                        
                        <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px' }}>
                            <h3 style={{ fontSize: '14px', color: '#fff', fontWeight: '900', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <BarChart size={18} color="var(--neon-green)" /> {t('allocation_status')}
                            </h3>
                            <div style={{ position: 'relative', height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', overflow: 'hidden', marginBottom: '12px' }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '75%', background: 'linear-gradient(to right, var(--neon-green), #34d399)', boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' }}></div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '800' }}>
                                <span style={{ color: '#64748b' }}>{t('allocated')}: 750{t('unit_m')}</span>
                                <span style={{ color: '#fff' }}>{t('total_cap')}: 1,000{t('unit_m')}</span>
                            </div>
                        </div>

                        <div className="glass-panel" style={{ padding: '24px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                            <div style={{ fontSize: '13px', color: '#fff', fontWeight: '900', marginBottom: '8px' }}>{t('security_protocol')}</div>
                            <p style={{ fontSize: '11px', color: '#10b981', lineHeight: '1.6', marginBottom: 0 }}>
                                {t('security_protocol_desc')}
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ClientPortal;
