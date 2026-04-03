-- Phase 15 & 16: 글로벌 자산 모니터링 및 자동 헤징 테이블 생성

-- 1. 글로벌 자산 마스터 테이블
CREATE TABLE IF NOT EXISTS ib.T_IB_GLOBAL_ASSET (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    asset_type VARCHAR(20),
    region VARCHAR(50),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    valuation NUMERIC(19, 4),
    base_risk_score DOUBLE PRECISION,
    status VARCHAR(20)
);

-- 2. 자산 간 리스크 전파 링크 테이블
CREATE TABLE IF NOT EXISTS ib.T_IB_ASSET_RISK_LINK (
    id BIGSERIAL PRIMARY KEY,
    source_asset_id VARCHAR(50) NOT NULL,
    target_asset_id VARCHAR(50) NOT NULL,
    propagation_weight DOUBLE PRECISION,
    link_type VARCHAR(20),
    description VARCHAR(255)
);

-- 3. 자동 헤징 전략 추천/실행 결과 테이블
CREATE TABLE IF NOT EXISTS ib.T_IB_HEDGING_STRATEGY (
    id BIGSERIAL PRIMARY KEY,
    asset_id VARCHAR(50) NOT NULL,
    strategy_type VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    recommended_amount NUMERIC(19, 2),
    expected_risk_reduction DOUBLE PRECISION,
    confidence_score DOUBLE PRECISION,
    status VARCHAR(20),
    execution_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
