---
ID: IB-ARC-02
Title: 통합 IB 플랫폼 기능 계층 및 데이터 흐름 / Integrated IB Platform Functional Hierarchy & Data Flow
Category: Architecture
Version: 1.2
Status: Formalized
---

# [IB-ARC-02] 통합 IB 플랫폼 기능 계층 및 데이터 흐름

본 문서는 IB 플랫폼 전반의 **Core Engine Layer**와 각 엔진 간의 **데이터 흐름(Data Flow)** 및 **상태 머신(State Machine)**을 상세히 정의합니다.

---

## 1. 시스템 레이어 구조 (Layered Architecture)

| Layer | Component | 주요 역할 |
|:---:|---|---|
| **Channel** | Trader UI, Portal | 사용자 인터페이스 및 외부 투자자 창구 |
| **Application** | Deal/Order Service | 비즈니스 로직 처리 및 트랜잭션 관리 |
| **Core Engine** | BB, Pricing, Risk | **핵심 알고리즘(Book Building, Pricing, Waterfall)** 수행 |
| **Data** | Oracle, Redis, Kafka | 영속성 저장, 실시간 캐시, 이벤트 스트림 처리 |

---

## 2. 핵심 엔진 구조 (Core Engine Architecture)

### 2.1 Book Building Engine
- **역할**: 투자자 주문(Price, Quantity)을 실시간으로 집계하여 수요곡선(Demand Curve) 생성.
- **입력**: 개별 주문 스트림.
- **출력**: 누적 수요 데이터(Cumulative Demand).

### 2.2 Pricing Engine
- **역할**: 수요곡선 및 전략 파라미터를 기반으로 최종 발행가(또는 금리) 결정.
- **핵심 로직**: Cut-off Price 산출, Oversubscription Ratio 고려.

### 2.3 Allocation Engine
- **역할**: 확정된 가격을 기준으로 투자자별 물량 배정.
- **방식**: Pro-rata(비례), Tiered Allocation(차등 배정).

### 2.4 Waterfall Engine
- **역할**: PF 현금흐름 발생 시 사전 정의된 우선순위에 따라 자금 분배.
- **순위**: 운영비(OPEX) → 선순위 부채 → 메자닌 → 에퀴티(Equity).

---

## 3. 전체 데이터 흐름 (End-to-End Flow)

### 3.1 자본시장(ECM/DCM) 흐름
1.  **Order Entry**: 투자자 주문 유입.
2.  **Aggregation**: 실시간 수요 집계 (Book Building).
3.  **Pricing**: 최종 가격 결정.
4.  **Allocation**: 투자자별 배정 및 확정.
5.  **Settlement**: 결제 및 딜 종결.

### 3.2 프로젝트 파이낸싱(PF) 흐름
1.  **Cash Flow Gen**: 프로젝트 수익 발생.
2.  **Waterfall Run**: 우선순위별 자금 분배 계산.
3.  **Tranche Distribution**: 각 트랜치별 실제 지급액 확정.
4.  **Risk Update**: 상환 여부에 따른 리스크 지표(DSCR 등) 갱신.

---

## 4. 상태 머신 (State Machine)

### 딜 라이프사이클 (Deal Status)
- `INIT` → `MANDATE` (수임) → `BOOK_BUILDING` → `PRICING` → `ALLOCATION` → `CLOSED`

### PF 자금 관리 (PF Monitoring)
- `STRUCTURING` → `FUNDING` → `OPERATION` → `CASHFLOW` → `WATERFALL` → `MONITORING`

---

> [!TIP]
> **설계 원칙**: 각 엔진은 마이크로서비스로 독립 설계되어야 하며, 데이터 정합성은 **Oracle(최종)**과 **Redis(실시간)** 간의 동기화를 통해 보장합니다.
