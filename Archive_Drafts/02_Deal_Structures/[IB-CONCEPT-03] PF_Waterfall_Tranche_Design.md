# [IB-CONCEPT-03] PF Waterfall + Tranche 설계

본 문서는 Project Finance(PF) 딜에서 핵심 구조인 **Waterfall(현금흐름 배분)**과  
**Tranche(자금 구조 계층화)**를 개념, 실무 흐름, 리스크 구조, 시스템 설계까지 통합 정의한다.

---

# 1. 전체 구조 (Big Picture)

```text
[Project Cash Flow 발생]
        ↓
[Waterfall 규칙 적용]
        ↓
[Tranche별 자금 배분]
        ↓
[투자자 수익 / 손실 결정]
2. 핵심 개념 요약
개념	의미
Waterfall	현금흐름을 우선순위에 따라 분배하는 규칙
Tranche	자금을 위험/수익 기준으로 나눈 계층
3. Waterfall (현금흐름 배분 구조)
3.1 정의

프로젝트에서 발생한 현금을 사전에 정의된 우선순위에 따라 순차적으로 배분하는 구조

3.2 직관적 이해
돈이 들어오면:
1순위부터 순서대로 나눠 가진다
→ 위에서 아래로 흐른다 (Waterfall)
3.3 기본 Waterfall 구조
1. 운영비 (OPEX)
2. 세금 (Tax)
3. Senior Debt 이자
4. Senior Debt 원금
5. Mezzanine 이자/원금
6. Equity 배당
3.4 특징
- 우선순위 고정 (Contract 기반)
- 상위 계층이 먼저 회수
- 하위 계층은 잔여 수익 수취
3.5 리스크 구조
위 → 안전 (Low Risk / Low Return)
아래 → 위험 (High Risk / High Return)
4. Tranche (자금 구조 계층)
4.1 정의

동일 프로젝트 자금을 위험/수익 기준으로 나눈 투자 계층

4.2 기본 구조
Senior Debt
   ↓
Mezzanine
   ↓
Equity
4.3 각 Tranche 설명
① Senior Debt
- 가장 먼저 상환
- 금리 낮음
- 리스크 낮음
- 은행/기관 참여
② Mezzanine
- 중간 순위
- 금리 중간
- 리스크 중간
③ Equity
- 마지막 배분
- 수익률 높음
- 리스크 가장 큼
5. Waterfall + Tranche 연결 구조
5.1 통합 흐름
Cash Flow 발생
 ↓
Waterfall 적용
 ↓
Senior → Mezzanine → Equity 순서 배분
5.2 예시
총 현금: 100

1. 운영비: 20
2. Senior 이자/원금: 50
3. Mezzanine: 20
4. Equity: 10
5.3 손실 발생 시
총 현금: 60

1. 운영비: 20
2. Senior: 40
3. Mezzanine: 0
4. Equity: 0

👉 손실은 아래부터 흡수됨

6. 핵심 금융 지표
6.1 DSCR (Debt Service Coverage Ratio)
DSCR = Cash Flow / Debt Service
6.2 LLCR (Loan Life Coverage Ratio)
LLCR = NPV(Cash Flow) / Debt
6.3 의미
- DSCR: 단기 상환 능력
- LLCR: 전체 기간 상환 능력
7. 시스템 설계 (아키텍처 관점)
7.1 핵심 컴포넌트
- Cash Flow Engine
- Waterfall Engine
- Tranche Manager
- Risk Engine (DSCR / ML)
7.2 처리 흐름
CashFlowGenerated
 → WaterfallCalculated
 → TrancheDistributed
 → RiskEvaluated
7.3 상태 흐름
STRUCTURING
 → CASHFLOW_SIMULATION
 → WATERFALL_RUN
 → RISK_ANALYSIS
 → MONITORING
8. 데이터 모델 (DB 설계)
8.1 Project Table
Project
- project_id
- name
- start_date
- end_date
8.2 Tranche Table
Tranche
- tranche_id
- project_id
- type (Senior / Mezz / Equity)
- amount
- interest_rate
- priority
8.3 Waterfall Rule
WaterfallRule
- rule_id
- project_id
- priority
- payment_type (Interest / Principal / Expense)
8.4 Cash Flow Table
CashFlow
- project_id
- period
- inflow
- outflow
8.5 Distribution Table
Distribution
- tranche_id
- period
- amount_paid
9. 이벤트 구조
CashFlowUpdated
 → WaterfallExecuted
 → DistributionCompleted
 → RiskUpdated
10. 핵심 설계 포인트
10.1 Waterfall은 “룰 엔진”
코드가 아니라 규칙 기반으로 동작해야 한다
10.2 Tranche는 “리스크 분리 장치”
투자자별 위험을 계층화한다
10.3 PF의 본질
"현금흐름 기반 금융 구조"
11. 한 줄 정리

PF는 현금흐름을 Waterfall로 나누고, Tranche로 리스크를 분산하는 금융 구조이다.