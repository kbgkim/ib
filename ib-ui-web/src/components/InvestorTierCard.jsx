import React from 'react';
import { Award, Zap, Lock, ShieldCheck } from 'lucide-react';

const InvestorTierCard = ({ tier = "T1", t }) => {
    const tierMeta = {
        T1: {
            name: t('tier_anchor'),
            badgeClass: "tier-t1",
            desc: t('anchor_privilege'),
            priority: t('priority_highest'),
            benefits: [t('benefit_30_priority'), t('benefit_gov_rights'), t('benefit_dividend')]
        },
        T2: {
            name: t('tier_institutional'),
            badgeClass: "tier-t2",
            desc: t('tier_desc_institutional'),
            priority: t('priority_normal'),
            benefits: [t('benefit_prorata'), t('benefit_reporting'), t('benefit_voting')]
        },
        T3: {
            name: t('tier_retail'),
            badgeClass: "tier-t3",
            desc: t('tier_desc_retail'),
            priority: t('priority_adjusted'),
            benefits: [t('benefit_market_alloc'), t('benefit_realtime_data')]
        }
    };

    const current = tierMeta[tier] || tierMeta.T1;

    return (
        <div className={`glass-panel animate-fade-in ${tier === 'T1' ? 'glow-border-green' : (tier === 'T2' ? 'glow-border-blue' : '')}`} 
             style={{ 
                 padding: '24px', 
                 borderRadius: '20px', 
                 border: '1px solid rgba(255,255,255,0.05)', 
                 position: 'relative', 
                 overflow: 'hidden',
                 background: tier === 'T1' ? 'rgba(191, 149, 63, 0.05)' : (tier === 'T2' ? 'rgba(117, 127, 154, 0.05)' : 'var(--panel-glass)')
             }}>
            {tier === 'T1' && <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'var(--gold-metallic)' }} />}
            {tier === 'T2' && <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'var(--silver-metallic)' }} />}
            <div className="scanline" style={{ opacity: 0.05 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                    <span className={`tier-badge ${current.badgeClass}`}>{tier}</span>
                    <h3 style={{ margin: '12px 0 4px', fontSize: '18px', color: '#fff', fontWeight: '900' }}>{current.name}</h3>
                    <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ShieldCheck size={14} /> {current.desc}
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '10px', color: '#475569', fontWeight: '900', letterSpacing: '1px' }}>{t('priority_lbl')}</div>
                    <div style={{ fontSize: '16px', fontWeight: '900', color: tier === 'T1' ? 'var(--neon-green)' : '#fff' }}>{current.priority}</div>
                </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '14px', padding: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '900', marginBottom: '12px', letterSpacing: '0.5px' }}>{t('tier_benefits_title')}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {current.benefits.map((b, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#cbd5e1', fontWeight: '600' }}>
                            <Zap size={14} color="var(--neon-green)" /> {b}
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                <Lock size={16} color="var(--neon-green)" />
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '11px', color: '#10b981', fontWeight: '900' }}>{t('lock_up_status')}</div>
                    <div style={{ fontSize: '13px', color: '#fff', fontWeight: '700' }}>{t('mandatory_lockup')}</div>
                </div>
                <div style={{ padding: '4px 8px', background: tier === 'T1' ? 'rgba(0,0,0,0.4)' : 'rgba(16, 185, 129, 0.2)', borderRadius: '6px', fontSize: '10px', color: tier === 'T1' ? '#fff' : '#fff', fontWeight: '900' }}>{t('status_active')}</div>
            </div>
        </div>
    );
};

export default InvestorTierCard;
