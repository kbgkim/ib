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

    return (
        <div className="market-ticker-container">
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
