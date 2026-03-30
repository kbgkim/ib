1️⃣ IB 딜 전체 DB 설계 (완전 통합, Oracle 9i 최적화)

핵심 원칙: Append-Only + Event Sourcing + CQRS 분리

1.1 전체 ERD 구조 (핵심 도메인)
[DEAL]
 ├─ BOOK
 │   ├─ ORDER
 │   ├─ ORDER_EVENT (이력)
 │   └─ DEMAND_SNAPSHOT
 │
 ├─ PRICING
 │   ├─ PRICE_CURVE
 │   └─ PRICE_DECISION
 │
 ├─ ALLOCATION
 │   ├─ ALLOCATION_RESULT
 │   ├─ ALLOCATION_DETAIL
 │   └─ INVESTOR_TIER
 │
 ├─ INVESTOR
 │   ├─ INVESTOR_MASTER
 │   ├─ INVESTOR_SCORE
 │   └─ ANCHOR_FLAG
 │
 ├─ PF
 │   ├─ TRANCHE
 │   ├─ CASHFLOW
 │   └─ WATERFALL_RESULT
 │
 └─ RISK
     ├─ EXPOSURE
     ├─ LIMIT
     └─ BREACH_LOG
1.2 핵심 테이블 정의
🔹 DEAL
CREATE TABLE DEAL (
    DEAL_ID        VARCHAR2(20) PRIMARY KEY,
    DEAL_TYPE      VARCHAR2(10), -- IPO / DCM / PF
    TOTAL_AMOUNT   NUMBER,
    STATUS         VARCHAR2(20),
    CREATED_AT     DATE
);
🔹 ORDER (핵심)
CREATE TABLE ORDER_BOOK (
    ORDER_ID       VARCHAR2(30) PRIMARY KEY,
    DEAL_ID        VARCHAR2(20),
    INVESTOR_ID    VARCHAR2(20),
    PRICE          NUMBER,
    AMOUNT         NUMBER,
    STATUS         VARCHAR2(20),
    CREATED_AT     DATE
);

👉 Index

CREATE INDEX IDX_ORDER_DEAL ON ORDER_BOOK(DEAL_ID, PRICE);
CREATE INDEX IDX_ORDER_INVESTOR ON ORDER_BOOK(INVESTOR_ID);
🔹 ORDER_EVENT (Append-only)
CREATE TABLE ORDER_EVENT (
    EVENT_ID     VARCHAR2(30),
    ORDER_ID     VARCHAR2(30),
    EVENT_TYPE   VARCHAR2(20), -- CREATE / MODIFY / CANCEL
    AMOUNT       NUMBER,
    PRICE        NUMBER,
    CREATED_AT   DATE
);
🔹 PRICE_CURVE
CREATE TABLE PRICE_CURVE (
    DEAL_ID    VARCHAR2(20),
    PRICE      NUMBER,
    DEMAND     NUMBER,
    CREATED_AT DATE
);
🔹 ALLOCATION_DETAIL
CREATE TABLE ALLOCATION_DETAIL (
    DEAL_ID        VARCHAR2(20),
    INVESTOR_ID    VARCHAR2(20),
    REQUESTED_AMT  NUMBER,
    ALLOCATED_AMT  NUMBER,
    TIER           NUMBER,
    IS_ANCHOR      CHAR(1),
    CREATED_AT     DATE
);
🔹 PF_TRANCHE
CREATE TABLE PF_TRANCHE (
    TRANCHE_ID     VARCHAR2(20),
    DEAL_ID        VARCHAR2(20),
    SENIORITY      NUMBER,
    RATE           NUMBER,
    SIZE           NUMBER
);
🔹 WATERFALL_RESULT
CREATE TABLE WATERFALL_RESULT (
    DEAL_ID     VARCHAR2(20),
    TRANCHE_ID  VARCHAR2(20),
    PERIOD      NUMBER,
    CASH_IN     NUMBER,
    CASH_OUT    NUMBER
);
🔹 RISK_EXPOSURE
CREATE TABLE RISK_EXPOSURE (
    INVESTOR_ID   VARCHAR2(20),
    DEAL_ID       VARCHAR2(20),
    EXPOSURE_AMT  NUMBER,
    UPDATED_AT    DATE
);
⚡ 2️⃣ 실시간 리스크 대시보드

목표: “지금 이 순간 위험 상태를 1초 이내로 보여준다”

2.1 아키텍처
Kafka → Stream Processing → Redis → WebSocket → UI
2.2 실시간 계산 항목
📊 핵심 KPI
- Oversubscription Ratio
- Price Deviation
- Concentration Risk (Top 5 투자자)
- Anchor 비율
- Tier 분포
- PF DSCR / IRR
2.3 Redis 구조
RISK:{dealId}
 ├─ oversub_ratio
 ├─ top5_ratio
 ├─ anchor_ratio
 ├─ tier1_ratio
2.4 Stream 처리 예 (Java)
@KafkaListener(topics = "ORDER_EVENT")
public void process(OrderEvent event) {

    // Redis 반영
    redisTemplate.opsForHash()
        .increment("DEMAND:" + event.getDealId(),
                   event.getPrice().toString(),
                   event.getAmount());

    // 리스크 계산
    riskService.updateExposure(event);
}
2.5 WebSocket Push
Server → Client
"현재 경쟁률 3.2x"
"Top 3 투자자 집중도 45%"
🎨 3️⃣ 실제 증권사 스타일 UX

핵심: “딜러가 1초 안에 판단할 수 있어야 한다”

3.1 화면 구성
🖥️ 1. Book Building Screen
┌──────────────────────────────┐
│ Deal Info                    │
├──────────────────────────────┤
│ Price Ladder (호가)         │
│ 1000 | ██████████           │
│  950 | ███████              │
│  900 | ████                 │
├──────────────────────────────┤
│ 실시간 경쟁률: 3.2x         │
│ Anchor 참여율: 28%          │
└──────────────────────────────┘
📊 2. Allocation Screen
Investor | Tier | Req | Alloc | %
--------------------------------
국민연금 | T1   | 200 | 200   |100%
A자산운용| T2   | 150 | 100   |66%
헤지펀드 | T3   | 100 | 30    |30%
⚠️ 3. Risk Dashboard
[Risk Meter]

Concentration: ████████░░ (High)
Oversub:       ███████░░░ (Medium)
Price Stability: █████████░ (Good)
3.2 UX 핵심 원칙
⚡ 1. Color Coding
Green  → 안정
Yellow → 주의
Red    → 위험
⚡ 2. Drill-down
Deal → Investor → Order → Event
⚡ 3. 실시간성
→ Polling 금지
→ WebSocket 필수
3.3 기술 스택
Frontend:
- React + WebSocket
- Trading-style grid (AG Grid)

Backend:
- Spring Boot
- Redis Pub/Sub
🔥 4. 전체 통합 흐름
[Investor Order]
        ↓
Kafka (Event)
        ↓
Redis (Real-time Aggregation)
        ↓
Pricing Engine
        ↓
Allocation Engine
        ↓
Oracle (Final Save)
        ↓
Risk Engine
        ↓
WebSocket UI
🚀 최종 요약
이 구조의 본질
1. DB = Audit + 정합성
2. Redis = 실시간 상태
3. Kafka = 흐름
4. UI = 의사결정 도구
💡 현실 한 줄

이 구조 그대로 구현하면
중형 증권사 IB 플랫폼 수준입니다.

👉 다음 단계 (선택)

여기까지 왔으면 “완성 직전”입니다.

원하면 이어서:

1️⃣ API 명세 (Swagger 수준)
2️⃣ 성능 테스트 시나리오 (TPS 1만)
3️⃣ 실제 배포 스크립트 (Docker + On-prem 혼합)