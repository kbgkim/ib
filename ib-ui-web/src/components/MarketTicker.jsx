import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { TrendingUp, TrendingDown, Minus, Clock } from 'lucide-react';

const API_BASE = 'http://localhost:8080/api/v1/market';

const MarketTicker = () => {
    const [data, setData] = useState(null);
    const [prevData, setPrevData] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${API_BASE}/latest`);
                setPrevData(data);
                setData(res.data);
                setLastUpdated(new Date());
            } catch (err) {
                console.error("Market Feed Error:", err);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, [data]);

    const renderItem = (label, key, suffix = "") => {
        if (!data) return null;
        
        const current = data[key];
        const previous = prevData ? prevData[key] : current;
        const diff = current - previous;

        let color = "#94a3b8"; // slate-400
        let Icon = Minus;

        if (diff > 0) {
            color = "#10b981"; // emerald-500
            Icon = TrendingUp;
        } else if (diff < 0) {
            color = "#ef4444"; // red-500
            Icon = TrendingDown;
        }

        return (
            <div className="ticker-item" style={{ borderLeft: `2px solid ${color}` }}>
                <span className="ticker-label">{label}</span>
                <span className="ticker-value" style={{ color }}>
                    {current.toLocaleString()}{suffix}
                </span>
                <span className="ticker-icon" style={{ color }}>
                    <Icon size={12} />
                </span>
            </div>
        );
    };

    const getStatusColor = () => {
        if (!data) return "transparent";
        switch (data.covenantStatus) {
            case 'BREACH': return "rgba(239, 68, 68, 0.4)"; // red-500
            case 'WARNING': return "rgba(251, 146, 60, 0.2)"; // orange-400
            default: return "rgba(15, 17, 21, 0.8)";
        }
    };

    const getMoodLabel = () => {
        if (!data) return "CONNECTING";
        if (data.covenantStatus === 'BREACH') return "HIGH RISK";
        if (data.wti > 100 || data.ust10y > 4.5) return "VOLATILE";
        return "STABLE";
    };

    const getMoodColor = () => {
        const mood = getMoodLabel();
        if (mood === 'HIGH RISK') return 'var(--risk-d)';
        if (mood === 'VOLATILE') return '#f59e0b';
        return 'var(--risk-aa)';
    };

    return (
        <div 
            className={`market-ticker-container ${data?.covenantStatus === 'BREACH' ? 'pulse-red-bg' : ''}`}
            style={{ backgroundColor: getStatusColor() }}
        >
            <div className="ticker-status-indicator" style={{ borderColor: getMoodColor() }}>
                <div style={{ 
                    width: '6px', height: '6px', borderRadius: '50%', 
                    background: getMoodColor(), marginRight: '8px',
                    boxShadow: `0 0 10px ${getMoodColor()}`
                }} className={getMoodLabel() !== 'STABLE' ? 'animate-pulse' : ''} />
                <span className="status-label" style={{ color: getMoodColor() }}>
                    {getMoodLabel()}
                </span>
            </div>
            <div className="ticker-scroll">
                {renderItem("UST 10Y", "ust10y", "%")}
                {renderItem("KOR 3Y", "kst3y", "%")}
                {renderItem("USD/KRW", "usdkrw")}
                {renderItem("Credit Spread", "creditSpread", "bps")}
                {renderItem("Carbon Price", "carbonPrice")}
                {renderItem("WTI Oil", "wti", "$")}
            </div>
            <div className="ticker-time">
                <Clock size={12} />
                <span style={{ marginLeft: '4px' }}>
                    {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
            </div>
        </div>
    );
};

export default MarketTicker;
