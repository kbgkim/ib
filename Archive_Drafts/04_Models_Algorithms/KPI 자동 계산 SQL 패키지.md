정의한 KPI들을
👉 실제 시스템에서 “자동 계산되는 SQL 패키지” 형태로 설계해드릴게요.

👉 목표:
“데이터 넣으면 KPI가 자동으로 계산되는 구조”

📌 1️⃣ 전체 구조

[원천 데이터]
→ Deal / Cashflow / ABCP / 담보

[중간 계산]
→ 집계 테이블 (daily snapshot)

[최종 KPI]
→ dashboard_kpi

📊 2️⃣ 기본 테이블 (가정)

✔ ① deal_master
deal_master
- deal_id
- deal_name
- total_loan_amount
- collateral_value

✔ ② cashflow
cashflow
- deal_id
- inflow_amount
- outflow_amount
- flow_date

✔ ③ abcp_issue
abcp_issue
- deal_id
- amount
- issue_date
- maturity_date
- rollover_flag

✔ ④ pf_metrics_raw
pf_metrics_raw
- deal_id
- sales_rate
- dscr
- progress_rate

📌 3️⃣ KPI 계산 SQL (핵심🔥)

① 💧 LCR (유동성)

CREATE OR REPLACE VIEW kpi_lcr AS
SELECT
    d.deal_id,
    SUM(c.inflow_amount - c.outflow_amount) AS available_liquidity,
    SUM(a.amount) FILTER (
        WHERE a.maturity_date <= CURRENT_DATE + INTERVAL '30 days'
    ) AS short_term_debt,
    CASE 
        WHEN SUM(a.amount) FILTER (
            WHERE a.maturity_date <= CURRENT_DATE + INTERVAL '30 days'
        ) = 0 THEN NULL
        ELSE
            SUM(c.inflow_amount - c.outflow_amount) /
            SUM(a.amount) FILTER (
                WHERE a.maturity_date <= CURRENT_DATE + INTERVAL '30 days'
            )
    END AS lcr
FROM deal_master d
LEFT JOIN cashflow c ON d.deal_id = c.deal_id
LEFT JOIN abcp_issue a ON d.deal_id = a.deal_id
GROUP BY d.deal_id;

② 🔁 Rollover Rate

CREATE OR REPLACE VIEW kpi_rollover AS
SELECT
    deal_id,
    SUM(CASE WHEN rollover_flag = 'Y' THEN amount ELSE 0 END) /
    SUM(amount) AS rollover_rate
FROM abcp_issue
WHERE maturity_date <= CURRENT_DATE + INTERVAL '30 days'
GROUP BY deal_id;

③ 📉 분양률 / DSCR

CREATE OR REPLACE VIEW kpi_pf_basic AS
SELECT
    deal_id,
    sales_rate,
    dscr
FROM pf_metrics_raw;

④ 🏦 LTV

CREATE OR REPLACE VIEW kpi_ltv AS
SELECT
    deal_id,
    total_loan_amount / collateral_value AS ltv
FROM deal_master;
⑤ ⚠️ PD / EL
CREATE OR REPLACE VIEW kpi_risk AS
SELECT
    deal_id,
    pd,
    lgd,
    ead,
    pd * lgd * ead AS el
FROM risk_metrics;

⑥ 🎲 VaR / CVaR

CREATE OR REPLACE VIEW kpi_var AS
SELECT
    deal_id,
    percentile_cont(0.95) 
    WITHIN GROUP (ORDER BY loss_amount) AS var_95
FROM simulation_result
GROUP BY deal_id;
CREATE OR REPLACE VIEW kpi_cvar AS
WITH var_calc AS (
    SELECT
        deal_id,
        percentile_cont(0.95) 
        WITHIN GROUP (ORDER BY loss_amount) AS var_95
    FROM simulation_result
    GROUP BY deal_id
)
SELECT
    s.deal_id,
    AVG(s.loss_amount) AS cvar_95
FROM simulation_result s
JOIN var_calc v ON s.deal_id = v.deal_id
WHERE s.loss_amount >= v.var_95
GROUP BY s.deal_id;

📌 4️⃣ 통합 KPI 뷰 (핵심🔥)

👉 대시보드용 최종 테이블

CREATE OR REPLACE VIEW dashboard_kpi AS
SELECT
    d.deal_id,
    d.deal_name,

    l.lcr,
    r.rollover_rate,
    p.sales_rate,
    p.dscr,
    t.ltv,
    k.pd,
    k.el,
    v.var_95,
    c.cvar_95

FROM deal_master d
LEFT JOIN kpi_lcr l ON d.deal_id = l.deal_id
LEFT JOIN kpi_rollover r ON d.deal_id = r.deal_id
LEFT JOIN kpi_pf_basic p ON d.deal_id = p.deal_id
LEFT JOIN kpi_ltv t ON d.deal_id = t.deal_id
LEFT JOIN kpi_risk k ON d.deal_id = k.deal_id
LEFT JOIN kpi_var v ON d.deal_id = v.deal_id
LEFT JOIN kpi_cvar c ON d.deal_id = c.deal_id;

📌 5️⃣ 위험 등급 자동화 (추가🔥)

SELECT
    *,
    CASE
        WHEN lcr < 1 OR rollover_rate < 1 THEN 'HIGH RISK'
        WHEN sales_rate < 0.7 OR dscr < 1 THEN 'MEDIUM RISK'
        ELSE 'LOW RISK'
    END AS risk_level
FROM dashboard_kpi;

📌 6️⃣ 실무 최적화 팁

✔ 1. Snapshot 테이블 사용

👉 매일 저장

kpi_snapshot
- deal_id
- base_date
- lcr
- el

✔ 2. 인덱스 필수

deal_id
maturity_date

✔ 3. Materialized View 추천

👉 성능 개선

📌 7️⃣ 전체 구조 요약

Raw Data
→ KPI View
→ Dashboard View
→ Alert System

📌 8️⃣ 한 줄 정리

👉
KPI SQL 패키지 = “데이터를 자동으로 위험 판단 숫자로 변환하는 엔진”

🚀 핵심 한마디

👉
“좋은 시스템은 사람이 계산하지 않는다 —
DB가 알아서 위험을 계산한다”

원하면 다음 단계도 이어서 가능합니다:

👉 Alert 자동 발송 시스템 (Slack / 이메일)
👉 실시간 스트리밍 KPI 구조
👉 대용량 데이터 성능 튜닝 (실무급)