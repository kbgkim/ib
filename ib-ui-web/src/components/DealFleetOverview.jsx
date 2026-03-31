import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layers, Activity, TrendingUp, AlertTriangle, ChevronRight, PieChart } from 'lucide-react';

const DealFleetOverview = ({ onSelectProject }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('http://localhost:8082/api/v1/pf/projects');
        setProjects(res.data);
      } catch (e) {
        console.error('Failed to fetch projects', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>Fleet Data Loading...</div>;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '900', color: '#fff' }}>Deal Fleet Management</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>Active Investment Banking Pipeline Monitoring</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
           <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', color: '#475569' }}>ACTIVE DEALS</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--neon-blue)' }}>{projects.length}</div>
           </div>
           <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', color: '#475569' }}>TOTAL AUM</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--risk-aa)' }}>{projects.reduce((acc, p) => acc + (p.totalCapex || 0), 0).toLocaleString()}B</div>
           </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {projects.map((p) => (
          <div 
            key={p.id} 
            className="glass-panel card-hover" 
            onClick={() => onSelectProject(p.id)}
            style={{ 
              padding: '20px', 
              borderRadius: '16px', 
              cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.05)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'absolute', top: 0, right: 0, padding: '12px' }}>
               <span style={{ 
                 fontSize: '10px', 
                 fontWeight: '800', 
                 padding: '2px 8px', 
                 borderRadius: '4px',
                 background: p.status === 'ACTIVE' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                 color: p.status === 'ACTIVE' ? '#4ade80' : '#60a5fa',
                 border: '1px solid rgba(255,255,255,0.05)'
               }}>
                 {p.status}
               </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(99,102,241,0.1)', padding: '8px', borderRadius: '10px' }}>
                <Layers size={20} color="var(--neon-blue)" />
              </div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#f1f5f9' }}>{p.projectName}</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                 <div>
                   <div style={{ fontSize: '10px', color: '#475569' }}>DEAL TYPE</div>
                   <div style={{ fontSize: '13px', color: '#94a3b8' }}>{p.dealType}</div>
                 </div>
                 <div style={{ textAlign: 'right' }}>
                   <div style={{ fontSize: '10px', color: '#475569' }}>CAPEX</div>
                   <div style={{ fontSize: '13px', color: '#f1f5f9', fontWeight: '700' }}>{p.totalCapex?.toLocaleString()}B</div>
                 </div>
              </div>

              <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '4px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Activity size={14} color="#64748b" />
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Health Index</span>
                 </div>
                 <div style={{ 
                   fontSize: '14px', 
                   fontWeight: '900', 
                   color: 'var(--risk-aa)',
                   display: 'flex', alignItems: 'center', gap: '4px'
                 }}>
                   A+ <ChevronRight size={14} />
                 </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Deal Placeholder */}
        <div 
          className="glass-panel" 
          style={{ 
            padding: '20px', 
            borderRadius: '16px', 
            border: '2px dashed rgba(255,255,255,0.05)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '160px',
            cursor: 'pointer',
            color: '#475569'
          }}
        >
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '50%', marginBottom: '12px' }}>
            <Layers size={24} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: '700' }}>+ 신규 프로젝트 등록</span>
        </div>
      </div>
    </div>
  );
};

export default DealFleetOverview;
