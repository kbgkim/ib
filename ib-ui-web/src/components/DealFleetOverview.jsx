import React from 'react';
import { Briefcase, TrendingUp, Shield, BarChart2, ArrowRight, Clock, MapPin, Users } from 'lucide-react';

const DealFleetOverview = ({ onSelectProject }) => {
  const deals = [
    {
      id: 'PF-001',
      name: '태양광 발전 PF (Project Aurora)',
      type: '신재생에너지 PF',
      region: '부산, 대한민국',
      status: '인수 심사 중',
      metrics: { primary: '1.24x', label: '최소 DSCR', grade: 'SAFE' },
      risk: 12.5,
      progress: 75,
      lastUpdated: '10분 전',
      category: 'pf'
    },
    {
      id: 'DEAL-001',
      name: 'Global Tech M&A 통합 프로젝트',
      type: '크로스보더 M&A',
      region: '서울 / 실리콘밸리',
      status: '실사 진행 중',
      metrics: { primary: 'AA', label: '리스크 등급', grade: 'SAFE' },
      risk: 45.2,
      progress: 40,
      lastUpdated: '2시간 전',
      category: 'mna'
    },
    {
      id: 'PF-002',
      name: '인천 데이터센터 개발사업',
      type: '인프라 PF',
      region: '인천, 대한민국',
      status: '사업 기획',
      metrics: { primary: '1.14x', label: '최소 DSCR', grade: 'WARNING' },
      risk: 28.1,
      progress: 15,
      lastUpdated: '1일 전',
      category: 'pf'
    },
    {
      id: 'DEAL-002',
      name: '바이오 코리아 지분 인수',
      type: '바이아웃 M&A',
      region: '대전, 대한민국',
      status: '조정 전 (Pre-mod)',
      metrics: { primary: 'B', label: '리스크 등급', grade: 'CAUTION' },
      risk: 62.8,
      progress: 10,
      lastUpdated: '5분 전',
      category: 'mna'
    }
  ];

  const getGradeClass = (grade) => {
    switch (grade) {
      case 'SAFE': return 'neon-glow-aa';
      case 'WARNING': return 'neon-glow-a';
      case 'CAUTION': return 'neon-glow-b';
      case 'BREACH': return 'neon-glow-d';
      default: return '';
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <div style={{ color: 'var(--neon-blue)', fontSize: '12px', fontWeight: '800', letterSpacing: '2px', marginBottom: '8px' }}>딜 종합 관리 (Fleet)</div>
          <h2 style={{ fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '-1px' }}>딜 플릿 총괄 현황</h2>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="glass-panel" style={{ padding: '12px 20px', borderRadius: '12px', textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700' }}>총 운용자산 (AUM)</div>
            <div style={{ fontSize: '18px', fontWeight: '900', color: '#fff' }}>$4.2B</div>
          </div>
          <div className="glass-panel" style={{ padding: '12px 20px', borderRadius: '12px', textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700' }}>진행 중인 딜</div>
            <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--risk-aa)' }}>12</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
        {deals.map((deal) => (
          <div 
            key={deal.id} 
            className="glass-panel animate-fade-in" 
            style={{ 
              borderRadius: '20px', 
              overflow: 'hidden', 
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s ease',
              cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.05)'
            }}
            onClick={() => onSelectProject(deal.id)}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.borderColor = 'rgba(0, 210, 255, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
            }}
          >
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ 
                    background: deal.category === 'pf' ? 'rgba(54, 162, 235, 0.1)' : 'rgba(75, 192, 192, 0.1)', 
                    padding: '10px', 
                    borderRadius: '12px',
                    display: 'flex', alignItems: 'center'
                  }}>
                    {deal.category === 'pf' ? <TrendingUp size={20} color="#36a2eb" /> : <Shield size={20} color="#4bc0c0" />}
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>{deal.type}</div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '2px 0 0', color: '#fff' }}>{deal.name}</h3>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className={getGradeClass(deal.metrics.grade)} style={{ fontSize: '18px', fontWeight: '900' }}>{deal.metrics.primary}</div>
                  <div style={{ fontSize: '9px', color: '#475569', fontWeight: '800' }}>{deal.metrics.label}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#94a3b8' }}>
                  <MapPin size={14} /> {deal.region}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#94a3b8' }}>
                  <Clock size={14} /> {deal.lastUpdated}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '8px' }}>
                  <span style={{ color: '#64748b', fontWeight: '700' }}>진행률 (Deal Progress)</span>
                  <span style={{ color: '#fff', fontWeight: '800' }}>{deal.progress}%</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${deal.progress}%`, 
                    height: '100%', 
                    background: `linear-gradient(90deg, var(--neon-blue), ${deal.category === 'pf' ? '#36a2eb' : '#4bc0c0'})`,
                    borderRadius: '3px',
                    transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                  }} />
                </div>
              </div>

              <div style={{ 
                background: 'rgba(255,255,255,0.02)', 
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '14px', fontWeight: '900', color: deal.risk > 50 ? 'var(--risk-d)' : 'var(--risk-aa)' }}>{deal.risk}</div>
                      <div style={{ fontSize: '8px', color: '#475569', fontWeight: '800' }}>리스크 점수</div>
                   </div>
                   <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }} />
                   <div style={{ fontSize: '11px', fontWeight: '700', color: '#cbd5e1' }}>{deal.status}</div>
                </div>
                <button 
                  className="glass-button"
                  style={{ padding: '6px 12px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  상세 보기 <ArrowRight size={12} />
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
