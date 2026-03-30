---
ID: IB-DOC-R03
Title: 통합 PF 리스크 및 시뮬레이션 시스템 사양서 / Integrated PF Risk & Simulation System Specification
Category: Risk Engine / System
Version: 1.2
Status: Formalized
---

# [IB-DOC-R03] 통합 PF 리스크 및 시뮬레이션 시스템 사양서

본 사양서는 PF Waterfall 엔진과 리스크 평가, 그리고 미래 현금흐름 시뮬레이션 기능을 하나의 서비스로 통합한 **Spring Boot 기반 백엔드 아키텍처**를 정의합니다.

---

## 1. 시스템 컴포넌트 구조 (Internal Components)

- **Waterfall Service**: 프로젝트별 사전 정의된 룰에 따라 기간별 현금흐름 배분을 수행.
- **Risk Service**: 배분 결과를 바탕으로 DSCR, LLCR 지표를 산출하고 임계치(1.2x) 이하 시 경고(Alert) 발생.
- **Simulation Service**: 몬테카를로(Monte Carlo) 기법을 활용하여 가상의 현금흐름 시나리오를 생성하고 리스크 민감도 테스트 수행.

---

## 2. 데이터 접근 전략 (Data Access Strategy)

> [!IMPORTANT]
> **Legacy Compatibility**: Oracle 9i 환경과의 호환성 및 대량 데이터 처리 성능을 위해 JPA 대신 **JdbcTemplate** 기반의 DAO 패턴을 사용합니다.

### 2.1 핵심 DAO 역할
- **TrancheDao**: 프로젝트 구조 정보 조회.
- **CashFlowDao**: 실제 및 가상 현금흐름 데이터 관리.
- **DistributionDao**: Waterfall 배분 결과 저장 (Audit Trail).

---

## 3. 리스크 평가 및 트리거 (Risk Evaluation)

시스템은 배치(Batch) 또는 실시간 이벤트 수신 시 다음 로직을 실행합니다.

1.  **DSCR Calculation**: $DSCR = \frac{Cash Inflow}{Debt Service}$
2.  **Threshold Monitoring**: DSCR < 1.2x 인 경우, 즉시 `RISK_WARNING_LOG`에 기록하고 담당 심사역에게 알림 푸시.
3.  **Early Warning System**: 3분기 연속 DSCR 하락 추세 시 'Cautious' 등급 상향 조정.

---

## 4. 시뮬레이션 및 What-if 분석

현업 사용자가 대시보드에서 특정 변수(분양률, 금리 등)를 입력하면 즉시 전체 워터폴 시뮬레이션을 수행하여 수익률 변화를 예측합니다.
- **Input**: User-defined shock parameters.
- **Process**: `SimulationService` -> `WaterfallEngine` (Virtual Run).
- **Output**: Simulated Equity IRR, Default Probability.

---

> [!TIP]
> **성능 최적화**: 시뮬레이션 시에는 DB 트랜잭션을 발생시키지 않는 **In-memory Virtual Run** 모드를 활용하여 응답성을 확보합니다.
