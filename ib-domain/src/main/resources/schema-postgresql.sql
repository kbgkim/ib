-- M&A Synergy & Valuation Engine Schema (v1.0)
-- PostgreSQL 14+

-- 1. Synergy Items Table
CREATE TABLE IF NOT EXISTS synergy_items (
    id BIGSERIAL PRIMARY KEY,
    deal_id VARCHAR(50) NOT NULL,
    category VARCHAR(20) NOT NULL, -- COST, REVENUE, FINANCIAL
    name VARCHAR(100) NOT NULL,
    estimated_value DECIMAL(19, 4),
    realization_year INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Valuation Results Table
CREATE TABLE IF NOT EXISTS valuation_results (
    id BIGSERIAL PRIMARY KEY,
    deal_id VARCHAR(50) NOT NULL,
    method VARCHAR(20) NOT NULL, -- DCF, MULTIPLES
    value DECIMAL(19, 4),
    weight DECIMAL(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. M&A Scenarios Table
CREATE TABLE IF NOT EXISTS mna_scenarios (
    id BIGSERIAL PRIMARY KEY,
    deal_id VARCHAR(50) NOT NULL,
    scenario_name VARCHAR(50) NOT NULL, -- Bear, Base, Bull
    synergy_capture_rate DECIMAL(5, 2), -- e.g., 0.80 for 80%
    wacc_adjustment DECIMAL(5, 4), -- e.g., +0.02 for +2% risk
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_synergy_deal ON synergy_items(deal_id);
CREATE INDEX idx_valuation_deal ON valuation_results(deal_id);
