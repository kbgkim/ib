import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker, Line } from "react-simple-maps";
import { Zap, AlertTriangle, ShieldCheck, Activity, Globe, Shield } from 'lucide-react';
import HedgingAdvisorPanel from './HedgingAdvisorPanel';

const geoUrl = "https://raw.githubusercontent.com/lotusms/world-map-data/master/world.json";

const GlobalRiskMonitor = ({ t }) => {
  const [assets, setAssets] = useState([]);
  const [links, setLinks] = useState([]);
  const [simulationResults, setSimulationResults] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [ecoMode, setEcoMode] = useState(false);

  // Phase 15: Real Data Sync with Backend
  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await fetch('/api/v1/monitoring/assets');
            const data = await response.json();
            if (data && data.length > 0) {
                // Map backend format to UI format
                const mappedAssets = data.map(a => ({
                    id: a.id,
                    name: a.name,
                    type: a.assetType,
                    lat: a.latitude,
                    lon: a.longitude,
                    risk: a.baseRiskScore,
                    status: a.status
                }));
                setAssets(mappedAssets);
            }
        } catch (err) {
            console.error("Failed to fetch global assets", err);
        }
    };
    
    fetchData();

    const mockLinks = [
      { from: 'ASSET_SA_OIL', to: 'ASSET_LDN_PORT', weight: 0.65 },
      { from: 'ASSET_SA_OIL', to: 'ASSET_KR_CHIP', weight: 0.45 },
      { from: 'ASSET_NY_DATA', to: 'ASSET_KR_CHIP', weight: 0.35 }
    ];
    setLinks(mockLinks);
  }, []);

  const handleApplyShock = (assetId) => {
    setIsSimulating(true);
    const asset = assets.find(a => a.id === assetId);
    setSelectedAsset(asset);
    
    // Simulate propagation (Backend API call simulation)
    setTimeout(() => {
        const results = [
            { assetId: 'ASSET_SA_OIL', riskImpact: 85.0, distance: 0 },
            { assetId: 'ASSET_LDN_PORT', riskImpact: 55.2, distance: 1 },
            { assetId: 'ASSET_KR_CHIP', riskImpact: 38.5, distance: 1 }
        ];
        setSimulationResults(results);
        setIsSimulating(false);
    }, 1500);
  };

  const getRiskColor = (risk) => {
    if (risk > 70) return "#ff003c"; // Critical Neon Red
    if (risk > 40) return "#f59e0b"; // Warning Orange
    return "#00f2ff"; // Healthy Neon Blue
  };

  return (
    <div className="global-monitor-container glass-panel animate-fade-in" style={{ padding: '40px', borderRadius: '32px', background: 'rgba(5, 10, 20, 0.8)', position: 'relative', overflow: 'hidden' }}>
      {/* Phase 16: Hedging Advisor Integration */}
      {selectedAsset && (
        <HedgingAdvisorPanel 
          assetId={selectedAsset.id} 
          currentRisk={simulationResults.find(r => r.assetId === selectedAsset.id)?.riskImpact || selectedAsset.risk} 
          t={t} 
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
           <h2 style={{ fontSize: '28px', fontWeight: '900', margin: 0, display: 'flex', alignItems: 'center', gap: '16px' }}>
             <Globe size={32} color="var(--neon-blue)" />
             <span className="text-gradient">{t('global_command_center')}</span>
           </h2>
           <p style={{ opacity: 0.6, fontSize: '14px', marginTop: '8px' }}>{t('global_monitor_subtitle')}</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
            <div className="stat-badge"><Activity size={16} /> {t('live_data_tunnel_lbl')}</div>
            <div className="stat-badge"><ShieldCheck size={16} /> {t('mesh_secure_lbl')}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>
        
        {/* Map Visualization */}
        <div className="map-wrapper" style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', bottom: '10px', left: '10px', zIndex: 10, display: 'flex', gap: '8px' }}>
             <button 
                onClick={() => setEcoMode(!ecoMode)}
                style={{ 
                    padding: '4px 10px', borderRadius: '20px', background: ecoMode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.05)', 
                    border: ecoMode ? '1px solid var(--neon-green)' : '1px solid rgba(255,255,255,0.1)',
                    color: ecoMode ? 'var(--neon-green)' : '#94a3b8', fontSize: '10px', fontWeight: '900', cursor: 'pointer'
                }}
             >
               {t('eco_mode')}: {ecoMode ? t('on') : t('off')}
             </button>
          </div>
          <ComposableMap projectionConfig={{ scale: 200 }}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="rgba(30, 41, 59, 0.5)"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "rgba(59, 130, 246, 0.2)", outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>

            {/* Dependency Links */}
            {links.map((link, i) => {
                const from = assets.find(a => a.id === link.from);
                const to = assets.find(a => a.id === link.to);
                if (!from || !to) return null;
                return (
                    <Line
                        key={i}
                        from={[from.lon, from.lat]}
                        to={[to.lon, to.lat]}
                        stroke="rgba(0, 242, 255, 0.1)"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                    />
                );
            })}

            {/* Asset Markers */}
            {assets.map((asset) => {
              const simulation = simulationResults.find(r => r.assetId === asset.id);
              const currentRisk = simulation ? simulation.riskImpact : asset.risk;
              const color = getRiskColor(currentRisk);

              return (
                <Marker key={asset.id} coordinates={[asset.lon, asset.lat]}>
                  <g 
                    style={{ cursor: 'pointer' }} 
                    onClick={() => handleApplyShock(asset.id)}
                    className={simulation && !ecoMode ? "pulse-animation" : ""}
                  >
                    <circle r={6} fill={color} />
                    {!ecoMode && <circle r={12} fill="transparent" stroke={color} strokeWidth={2} opacity={0.3} />}
                    {simulation && !ecoMode && (
                        <circle r={20} fill="transparent" stroke={color} strokeWidth={1} className="shockwave" />
                    )}
                  </g>
                  <text
                    textAnchor="middle"
                    y={-20}
                    style={{ fontSize: "10px", fontWeight: "900", fill: "#fff", pointerEvents: "none", textShadow: "0 0 10px #000" }}
                  >
                    {t(asset.name)}
                  </text>
                </Marker>
              );
            })}
          </ComposableMap>

           {isSimulating && (
              <div style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(255, 0, 60, 0.2)', padding: '12px 24px', borderRadius: '12px', border: '1px solid #ff003c', color: '#ff003c', fontWeight: '900', fontSize: '12px', animation: 'blink 1s infinite' }}>
                  {t('propagating_risk_shock')}
              </div>
          )}
        </div>

        {/* Side Panel: Impact details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '800' }}>{t('risk_propagation_chain')}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {simulationResults.length > 0 ? simulationResults.map((res, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: getRiskColor(res.riskImpact) + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {res.distance === 0 ? <Zap size={18} color={getRiskColor(res.riskImpact)} /> : <AlertTriangle size={18} color={getRiskColor(res.riskImpact)} />}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '14px', fontWeight: '800' }}>{t(res.assetName || res.assetId)}</div>
                                <div style={{ fontSize: '12px', opacity: 0.5 }}>{res.distance === 0 ? t('origin_point') : t('chain_level', { level: res.distance })}</div>
                            </div>
                            <div style={{ fontSize: '18px', fontWeight: '900', color: getRiskColor(res.riskImpact) }}>
                                {res.riskImpact.toFixed(1)}
                            </div>
                        </div>
                    )) : (
                        <div style={{ padding: '40px 0', textAlign: 'center', opacity: 0.4 }}>
                            <p style={{ fontSize: '14px' }}>{t('simulate_risk_desc')}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(0, 242, 255, 0.05), transparent)' }}>
                <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: 'var(--neon-blue)' }}>{t('recommended_action')}</h4>
                <p style={{ fontSize: '13px', lineHeight: '1.6', opacity: 0.8 }}>
                    {simulationResults.length > 0 ? 
                        t('cascading_shock_msg') :
                        t('nominal_monitoring_msg')
                    }
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalRiskMonitor;
