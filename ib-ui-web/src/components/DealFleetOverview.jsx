import React from 'react';
import { Briefcase, TrendingUp, Shield, BarChart2, ArrowRight, Clock, MapPin, Users } from 'lucide-react';

const DealFleetOverview = ({ onSelectProject, t }) => {
  const deals = [
    {
      id: 'PF-001',
      name: t('deal_aurora'),
      type: t('type_renewables_pf'),
      region: t('region_busan'),
      status: t('status_review'),
      metrics: { primary: '1.24x', label: t('min_dscr'), grade: 'SAFE' },
      risk: 12.5,
      progress: 75,
      lastUpdated: t('time_ago_10m'),
      category: 'pf'
    },
    {
      id: 'DEAL-001',
      name: t('deal_tech_mna'),
      type: t('type_crossborder_mna'),
      region: t('region_seoul_sv'),
      status: t('status_due_diligence'),
      metrics: { primary: 'AA', label: t('risk_grade'), grade: 'SAFE' },
      risk: 45.2,
      progress: 40,
      lastUpdated: t('time_ago_2h'),
      category: 'mna'
    },
    {
      id: 'PF-002',
      name: t('deal_incheon_dc'),
      type: t('type_infra_pf'),
      region: t('region_incheon'),
      status: t('status_planning'),
      metrics: { primary: '1.14x', label: t('min_dscr'), grade: 'WARNING' },
      risk: 28.1,
      progress: 15,
      lastUpdated: t('time_ago_1d'),
      category: 'pf'
    },
    {
      id: 'DEAL-002',
      name: t('deal_bio_korea'),
      type: t('type_buyout_mna'),
      region: t('region_daejeon'),
      status: t('status_premod'),
      metrics: { primary: 'B', label: t('risk_grade'), grade: 'CAUTION' },
      risk: 62.8,
      progress: 10,
      lastUpdated: t('time_ago_5m'),
      category: 'mna'
    }
  ];

  const getGradeClass = (grade) => {
    switch (grade) {
      case 'SAFE': return 'text-risk-aa';
      case 'WARNING': return 'text-risk-a';
      case 'CAUTION': return 'text-risk-b';
      case 'BREACH': return 'text-risk-d';
      default: return '';
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
        <div>
          <div style={{ color: 'var(--neon-blue)', fontSize: '11px', fontWeight: '900', letterSpacing: '2px', marginBottom: '8px', textTransform: 'uppercase' }}>
            {t('fleet_management')}
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '-0.025em' }}>
            {t('fleet_overview_title')}
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '16px 24px', borderRadius: '16px', textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>
                {t('total_aum')}
            </div>
            <div style={{ fontSize: '20px', fontWeight: '900', color: '#fff' }}>$4.2B</div>
          </div>
          <div className="glass-panel" style={{ padding: '16px 24px', borderRadius: '16px', textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>
                {t('active_deals_count')}
            </div>
            <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--risk-aa)' }}>12</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '32px' }}>
        {deals.map((deal) => (
          <div 
            key={deal.id} 
            className="glass-panel animate-fade-in" 
            style={{ 
              borderRadius: '24px', 
              overflow: 'hidden', 
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer'
            }}
            onClick={() => onSelectProject(deal.id)}
          >
            <div style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ 
                    background: deal.category === 'pf' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
                    padding: '12px', 
                    borderRadius: '14px',
                    display: 'flex', alignItems: 'center',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    {deal.category === 'pf' ? <TrendingUp size={24} color="var(--neon-blue)" /> : <Shield size={24} color="#10b981" />}
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{deal.type}</div>
                    <h3 style={{ fontSize: '20px', fontWeight: '900', margin: '4px 0 0', color: '#fff' }}>{deal.name}</h3>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className={getGradeClass(deal.metrics.grade)} style={{ fontSize: '22px', fontWeight: '900' }}>{deal.metrics.primary}</div>
                  <div style={{ fontSize: '10px', color: '#475569', fontWeight: '800', textTransform: 'uppercase' }}>{deal.metrics.label}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>
                  <MapPin size={16} /> {deal.region}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>
                  <Clock size={16} /> {deal.lastUpdated}
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '10px' }}>
                  <span style={{ color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>{t('deal_progress_lbl')}</span>
                  <span style={{ color: '#fff', fontWeight: '900' }}>{deal.progress}%</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${deal.progress}%`, 
                    height: '100%', 
                    background: `linear-gradient(90deg, var(--neon-blue), ${deal.category === 'pf' ? '#3b82f6' : '#10b981'})`,
                    borderRadius: '4px',
                    transition: 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1)'
                  }} />
                </div>
              </div>

              <div style={{ 
                background: 'rgba(0,0,0,0.2)', 
                border: '1px solid var(--border-glass)',
                borderRadius: '16px',
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                   <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '18px', fontWeight: '900', color: deal.risk > 50 ? 'var(--risk-d)' : 'var(--risk-aa)' }}>{deal.risk}</div>
                      <div style={{ fontSize: '9px', color: '#475569', fontWeight: '900', textTransform: 'uppercase' }}>{t('risk_score_lbl')}</div>
                   </div>
                   <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />
                   <div style={{ fontSize: '13px', fontWeight: '800', color: '#cbd5e1' }}>{deal.status}</div>
                </div>
                <button 
                  className="lang-toggle"
                  style={{ padding: '8px 16px', fontSize: '12px', background: 'rgba(0, 210, 255, 0.1)', borderColor: 'var(--neon-blue)', color: '#fff' }}
                >
                  {t('view_details_btn')} <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DealFleetOverview;
