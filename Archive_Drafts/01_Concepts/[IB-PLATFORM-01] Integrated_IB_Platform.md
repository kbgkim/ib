# [IB-PLATFORM-01] 통합 IB 플랫폼 아키텍처
## (Book Building + Pricing + Allocation + PF Waterfall 통합)

본 문서는 IB 업무 전반을 하나의 플랫폼으로 통합하기 위한  
**End-to-End 시스템 아키텍처**를 정의한다.

---

# 1. 전체 개념 (Big Picture)

```text
[Deal Origination]
        ↓
[Book Building]
        ↓
[Pricing Engine]
        ↓
[Allocation Engine]
        ↓
[Funding / Execution]
        ↓
[PF Cash Flow]
        ↓
[Waterfall Engine]
        ↓
[Risk / Monitoring]
2. 시스템 레이어 구조
2.1 Layered Architecture
[Channel Layer]
 - IB Banker UI
 - Investor Portal
 - API Gateway

[Application Layer]
 - Deal Service
 - Order Service
 - Allocation Service
 - PF Service

[Core Engine Layer]
 - Book Building Engine
 - Pricing Engine
 - Allocation Engine
 - Waterfall Engine
 - Risk Engine

[Data Layer]
 - RDB (Oracle)
 - Cache (Redis)
 - Stream (Kafka)
3. 핵심 도메인 모델
3.1 Deal (딜)
Deal
- deal_id
- type (IPO / Bond / PF)
- target_amount
- status
3.2 Order (수요)
Order
- order_id
- investor_id
- price
- quantity
3.3 Tranche (PF 구조)
Tranche
- tranche_id
- type (Senior / Mezz / Equity)
- priority
- amount
3.4 Cash Flow
CashFlow
- project_id
- period
- inflow
4. 핵심 엔진 구조
4.1 Book Building Engine
역할:
- 주문 실시간 집계
- Demand Curve 생성

입력:
- (price, quantity)

출력:
- cumulative demand
4.2 Pricing Engine
역할:
- 최종 발행가 결정

핵심 로직:
- Cut-off Price
- Oversubscription 고려
4.3 Allocation Engine
역할:
- 투자자별 배정

방식:
- Pro-rata
- Tiered Allocation
4.4 Waterfall Engine
역할:
- PF 현금흐름 분배

우선순위:
OPEX → Debt → Mezz → Equity
4.5 Risk Engine
역할:
- 리스크 평가

지표:
- DSCR
- PD / LGD / EAD
5. 전체 데이터 흐름
5.1 IPO / 채권 흐름
Investor Order
 → Book Building
 → Pricing
 → Allocation
 → Settlement
5.2 PF 흐름
Project Cash Flow
 → Waterfall Engine
 → Tranche Distribution
 → Risk Monitoring
5.3 통합 흐름
[시장 수요]
   ↓
Book Building
   ↓
Pricing
   ↓
Allocation
   ↓
Funding 완료
   ↓
PF 실행
   ↓
Cash Flow 발생
   ↓
Waterfall 분배
   ↓
리스크 평가
6. 이벤트 기반 아키텍처
6.1 Event 정의
DealCreated
OrderReceived
OrderAggregated
PriceFinalized
AllocationCompleted
FundingCompleted
CashFlowGenerated
WaterfallExecuted
RiskUpdated
6.2 이벤트 흐름
OrderReceived
 → AggregationUpdated
 → PriceCalculated
 → AllocationDone
 → FundingConfirmed
 → CashFlowGenerated
 → WaterfallRun
7. 실시간 처리 구조
7.1 기술 스택
- Kafka → 이벤트 스트림
- Redis → 실시간 집계
- Oracle → 트랜잭션 저장
7.2 처리 전략
- CQRS (읽기/쓰기 분리)
- Event Sourcing
- In-memory aggregation
8. 상태 머신 (State Machine)
8.1 Deal Lifecycle
INIT
 → MANDATE
 → BOOK_BUILDING
 → PRICING
 → ALLOCATION
 → CLOSED
8.2 PF Lifecycle
STRUCTURING
 → FUNDING
 → OPERATION
 → CASHFLOW
 → WATERFALL
 → MONITORING
9. DB 설계 (핵심 테이블)
9.1 Deal
Deal(
  deal_id,
  type,
  target_amount,
  status
)
9.2 Order
OrderBook(
  order_id,
  price,
  quantity
)
9.3 Allocation
Allocation(
  investor_id,
  allocated_qty
)
9.4 Tranche
Tranche(
  tranche_id,
  priority,
  amount
)
9.5 Distribution
Distribution(
  tranche_id,
  amount_paid
)
10. 핵심 설계 포인트
10.1 엔진 분리
각 엔진은 독립적으로 설계 (Microservice)
10.2 규칙 기반 처리
- Waterfall → Rule Engine
- Allocation → Policy Engine
10.3 실시간성
- Book Building → ms 단위 집계
- PF → batch + streaming 혼합
11. 리스크 통합 구조
[시장 리스크]
 → Book Building 왜곡

[신용 리스크]
 → PF (PD / LGD)

[운영 리스크]
 → 시스템 장애
12. 확장 방향 (고급)
12.1 ML 연결
- 수요 예측 (Demand Forecast)
- 가격 최적화
- 투자자 행동 분석
12.2 고급 Pricing
- Elastic Curve 모델
- Game Theory 기반 가격 결정
12.3 시뮬레이션
- Monte Carlo 기반 PF 리스크 분석
13. 한 줄 정리

IB 플랫폼은 “시장 수요(Book Building)”와 “자금 흐름(PF)”을 하나로 연결하여
가격 결정 → 자금 조달 → 현금흐름 분배까지 통합하는 시스템이다.

[END]

---

# 핵심 요약 (실무 관점)

이 구조를 한 문장으로 정리하면:

👉 **앞단 (시장) = Book Building**  
👉 **중단 (거래) = Pricing / Allocation**  
👉 **뒷단 (운용) = PF + Waterfall**

---

# 다음 단계 (중요)

여기서 진짜 “차세대 IB 시스템 수준”으로 가려면:

### 1️⃣ 실시간 리스크 통합
- Book Building 수요 → PF 리스크 연결

### 2️⃣ Pricing AI
- 수요곡선 기반 자동 가격 결정

### 3️⃣ Digital Twin
- PF Cash Flow 시뮬레이션