Deal ERD(개념 + 물리 모델)를 단계적으로 정리해드릴게요.

📌 1️⃣ 전체 ERD 개요 (핵심 구조)
Deal
 ├─ Deal_Type
 ├─ Counterparty
 ├─ Loan (Tranche)
 │    ├─ Interest
 │    ├─ Repayment_Schedule
 ├─ Collateral
 ├─ Limit (한도)
 ├─ Deal_Event (스케줄/이벤트)
 ├─ Financial_Info
 └─ Additional_Info

👉 핵심 포인트

Deal = 최상위
Loan(Tranche) = 실제 자금 단위
나머지는 전부 “부속 정보”

📊 2️⃣ 주요 엔터티 상세

🧱 1. Deal (핵심 테이블)

CREATE TABLE deal (
    deal_id           VARCHAR(20) PRIMARY KEY,
    deal_name         VARCHAR(200),
    deal_type         VARCHAR(20),   -- PF / NON-PF / CORPORATE / LOC
    start_date        DATE,
    end_date          DATE,
    status            VARCHAR(20),   -- 진행중 / 종료
    total_amount      DECIMAL(18,2),
    created_at        DATETIME
);

👉 역할

모든 데이터의 “부모”
리스크/보고 기준 단위

🧩 2. Deal_Type (코드 테이블)

CREATE TABLE deal_type (
    type_code   VARCHAR(20) PRIMARY KEY,
    type_name   VARCHAR(50)
);

예:

PF
NON_PF
CORPORATE
LOC

🏢 3. Counterparty (거래상대방)


CREATE TABLE counterparty (
    cp_id        VARCHAR(20) PRIMARY KEY,
    cp_name      VARCHAR(200),
    cp_type      VARCHAR(50),   -- 시행사, 시공사, 차주 등
    credit_grade VARCHAR(10)
);

CREATE TABLE deal_counterparty (
    deal_id VARCHAR(20),
    cp_id   VARCHAR(20),
    role    VARCHAR(50), -- 차주, 보증인 등
    PRIMARY KEY (deal_id, cp_id)
);

💰 4. Loan (Tranche 구조 핵심)

CREATE TABLE loan (
    loan_id     VARCHAR(20) PRIMARY KEY,
    deal_id     VARCHAR(20),
    loan_type   VARCHAR(50),  -- 선순위 / 후순위 / 브릿지
    amount      DECIMAL(18,2),
    interest_rate DECIMAL(5,2),
    start_date  DATE,
    end_date    DATE
);

👉 핵심

하나의 Deal에 여러 Loan 가능
PF에서 특히 중요 (트랜치 구조)

📈 5. Repayment_Schedule (상환)

CREATE TABLE repayment_schedule (
    schedule_id VARCHAR(20) PRIMARY KEY,
    loan_id     VARCHAR(20),
    due_date    DATE,
    principal   DECIMAL(18,2),
    interest    DECIMAL(18,2),
    status      VARCHAR(20)
);

🏦 6. Collateral (담보)
CREATE TABLE collateral (
    collateral_id VARCHAR(20) PRIMARY KEY,
    deal_id       VARCHAR(20),
    collateral_type VARCHAR(50), -- 토지, 건물 등
    value         DECIMAL(18,2),
    ltv_ratio     DECIMAL(5,2)
);

📊 7. Limit (한도)
CREATE TABLE deal_limit (
    limit_id    VARCHAR(20) PRIMARY KEY,
    deal_id     VARCHAR(20),
    limit_amount DECIMAL(18,2),
    used_amount  DECIMAL(18,2)
);

👉 LOC에서 중요

📅 8. Deal_Event (이벤트/스케줄)

CREATE TABLE deal_event (
    event_id   VARCHAR(20) PRIMARY KEY,
    deal_id    VARCHAR(20),
    event_type VARCHAR(50), -- 이자지급, 만기 등
    event_date DATE,
    status     VARCHAR(20)
);


📉 9. Financial_Info
CREATE TABLE financial_info (
    fin_id     VARCHAR(20) PRIMARY KEY,
    deal_id    VARCHAR(20),
    metric     VARCHAR(50),  -- LTV, DSCR 등
    value      DECIMAL(10,2),
    base_date  DATE
);

➕ 10. Additional_Info (유연성 확보)

CREATE TABLE deal_additional_info (
    info_id   VARCHAR(20) PRIMARY KEY,
    deal_id   VARCHAR(20),
    key_name  VARCHAR(100),
    key_value VARCHAR(500)
);

👉 유형별 확장 대응 (PF / NON-PF 차이 해결)

📌 3️⃣ 관계 (Relationship)
Deal 1 ─── N Loan
Deal 1 ─── N Collateral
Deal 1 ─── N Event
Deal 1 ─── N Financial_Info
Deal 1 ─── N Additional_Info

Loan 1 ─── N Repayment_Schedule

Deal N ─── N Counterparty

📌 4️⃣ 유형별 확장 구조 (중요🔥)

✔ PF일 경우 추가 테이블

pf_project
pf_sales (분양률)
pf_cost (사업비)

✔ NON-PF

rental_income
occupancy_rate

✔ 비부동산

corporate_financials

✔ LOC

credit_line_usage
guarantee_info

📌 5️⃣ 설계 핵심 포인트

✔ 1. Deal 중심 구조

모든 데이터는 Deal에 종속

✔ 2. Tranche 구조 필수

Loan 테이블로 분리 (실무 핵심)

✔ 3. 유형별 확장 분리

공통 vs 특화 분리

✔ 4. 유연성 확보

additional_info 필수

📌 6️⃣ 한 줄 정리

👉 Deal ERD는 “Deal 중심 + Loan(트랜치) 중심 + 유형별 확장 구조”가 핵심

원하면 다음 단계도 바로 이어서 가능해요:

👉 실제 ERD 다이어그램 이미지
👉 샘플 데이터 + 시나리오
👉 Spring/JPA 엔티티 구조
👉 리스크 계산 (LTV, DSCR) 로직 설계