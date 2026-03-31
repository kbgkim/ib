-- V5: PF (Project Finance) Core Tables
-- Created: 2026-03-31

-- 프로젝트 기본 정보
CREATE TABLE pf_project (
    id              VARCHAR(36)    PRIMARY KEY,
    project_name    VARCHAR(200)   NOT NULL,
    deal_type       VARCHAR(20)    DEFAULT 'PF',
    total_capex     DECIMAL(20,2)  NOT NULL,
    equity_ratio    DECIMAL(5,2)   NOT NULL,
    debt_ratio      DECIMAL(5,2)   NOT NULL,
    loan_tenure     INT            NOT NULL,
    construction_period INT        NOT NULL,
    discount_rate   DECIMAL(5,4)   NOT NULL,
    project_life    INT            NOT NULL,
    status          VARCHAR(20)    DEFAULT 'STRUCTURING',
    inflation_rate  DECIMAL(19,4)  DEFAULT 0.02,
    yield_curve_id  VARCHAR(50)    DEFAULT 'STEEP',
    created_at      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);

-- 연도별 현금흐름 (year -> project_year, tax -> tax_amount: H2 예약어 회피)
CREATE TABLE pf_cashflow (
    id              BIGINT         AUTO_INCREMENT PRIMARY KEY,
    project_id      VARCHAR(36)    NOT NULL,
    project_year    INT            NOT NULL,
    revenue         DECIMAL(20,2)  DEFAULT 0,
    opex            DECIMAL(20,2)  DEFAULT 0,
    tax_amount      DECIMAL(20,2)  DEFAULT 0,
    capex           DECIMAL(20,2)  DEFAULT 0,
    cfads           DECIMAL(20,2)  DEFAULT 0,
    FOREIGN KEY (project_id) REFERENCES pf_project(id)
);

-- 트랜치 구조 (선순위/후순위)
CREATE TABLE pf_tranche (
    id              BIGINT         AUTO_INCREMENT PRIMARY KEY,
    project_id      VARCHAR(36)    NOT NULL,
    tranche_name    VARCHAR(100)   NOT NULL,
    seniority       VARCHAR(20)    NOT NULL,
    principal       DECIMAL(20,2)  NOT NULL,
    interest_rate   DECIMAL(5,4)   NOT NULL,
    tenure          INT            NOT NULL,
    grace_period    INT            DEFAULT 0,
    FOREIGN KEY (project_id) REFERENCES pf_project(id)
);

-- Waterfall 분배 결과 스냅샷 (year -> project_year: H2 예약어 회피)
CREATE TABLE pf_waterfall (
    id              BIGINT         AUTO_INCREMENT PRIMARY KEY,
    project_id      VARCHAR(36)    NOT NULL,
    project_year    INT            NOT NULL,
    gross_revenue   DECIMAL(20,2)  DEFAULT 0,
    opex_paid       DECIMAL(20,2)  DEFAULT 0,
    tax_paid        DECIMAL(20,2)  DEFAULT 0,
    senior_ds_paid  DECIMAL(20,2)  DEFAULT 0,
    dsra_funded     DECIMAL(20,2)  DEFAULT 0,
    mezz_paid       DECIMAL(20,2)  DEFAULT 0,
    equity_dist     DECIMAL(20,2)  DEFAULT 0,
    residual        DECIMAL(20,2)  DEFAULT 0,
    dscr            DECIMAL(8,4)   DEFAULT 0,
    FOREIGN KEY (project_id) REFERENCES pf_project(id)
);

-- 시나리오별 결과 스냅샷 저장 (Simulation Results Snapshot)
CREATE TABLE pf_scenario (
    id              VARCHAR(36)    PRIMARY KEY,
    project_id      VARCHAR(36)    NOT NULL,
    scenario_name   VARCHAR(100)   NOT NULL,
    parameters      TEXT,
    metrics         TEXT,
    waterfall_data  TEXT,
    sensitivity_data TEXT,
    created_at      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES pf_project(id)
);

-- 초기 데모 프로젝트 데이터
INSERT INTO pf_project (id, project_name, deal_type, total_capex, equity_ratio, debt_ratio,
    loan_tenure, construction_period, discount_rate, project_life, status, inflation_rate, yield_curve_id)
VALUES ('PF-001', '한강변 복합에너지 발전소 PF딜', 'ENERGY',
    100000.00, 30.00, 70.00, 15, 3, 0.0750, 25, 'STRUCTURING', 0.0200, 'STEEP');

-- 건설기간 현금흐름 (project_year 1~3: 인출만 발생)
INSERT INTO pf_cashflow (project_id, project_year, revenue, opex, tax_amount, capex, cfads)
VALUES ('PF-001', 1, 0, 0, 0, 25000, 0);
INSERT INTO pf_cashflow (project_id, project_year, revenue, opex, tax_amount, capex, cfads)
VALUES ('PF-001', 2, 0, 0, 0, 30000, 0);
INSERT INTO pf_cashflow (project_id, project_year, revenue, opex, tax_amount, capex, cfads)
VALUES ('PF-001', 3, 0, 0, 0, 15000, 0);

-- 운영기간 현금흐름 (project_year 4~10)
INSERT INTO pf_cashflow (project_id, project_year, revenue, opex, tax_amount, capex, cfads)
VALUES ('PF-001', 4,  18000, 5000, 1200, 0, 11800);
INSERT INTO pf_cashflow (project_id, project_year, revenue, opex, tax_amount, capex, cfads)
VALUES ('PF-001', 5,  18500, 5100, 1240, 0, 12160);
INSERT INTO pf_cashflow (project_id, project_year, revenue, opex, tax_amount, capex, cfads)
VALUES ('PF-001', 6,  19000, 5200, 1280, 0, 12520);
INSERT INTO pf_cashflow (project_id, project_year, revenue, opex, tax_amount, capex, cfads)
VALUES ('PF-001', 7,  19500, 5300, 1320, 0, 12880);
INSERT INTO pf_cashflow (project_id, project_year, revenue, opex, tax_amount, capex, cfads)
VALUES ('PF-001', 8,  20000, 5400, 1360, 0, 13240);
INSERT INTO pf_cashflow (project_id, project_year, revenue, opex, tax_amount, capex, cfads)
VALUES ('PF-001', 9,  20000, 5500, 1370, 0, 13130);
INSERT INTO pf_cashflow (project_id, project_year, revenue, opex, tax_amount, capex, cfads)
VALUES ('PF-001', 10, 20000, 5600, 1370, 0, 13030);

-- 트랜치 구조
INSERT INTO pf_tranche (project_id, tranche_name, seniority, principal, interest_rate, tenure, grace_period)
VALUES ('PF-001', 'Senior Loan', 'SENIOR', 60000, 0.0550, 15, 3);
INSERT INTO pf_tranche (project_id, tranche_name, seniority, principal, interest_rate, tenure, grace_period)
VALUES ('PF-001', 'Mezzanine', 'MEZZANINE', 10000, 0.0900, 12, 3);
