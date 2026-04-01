---
ID: IB-DOC-R03
Title: 통합 PF 리스크 및 시뮬레이션 시스템 사양서 / Integrated PF Risk & Simulation System Specification
Category: Risk Engine / System
Version: 1.3
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

## 2. 리스크 엔진 상세 산식 (Risk Metrics Formulation)

확률론적 기법을 기반으로 예상 손실 및 최악 시나리오의 손실 규모를 산출합니다.

### 2.1 기대 손실 (Expected Loss, EL)
미래에 발생할 것으로 예상되는 평균 손실 금액을 계산합니다.
$$EL = PD \times LGD \times EAD$$
- **PD (Probability of Default)**: 부도 확률 (분양률, 공정률, 시장 상황 등에 의해 결정).
- **LGD (Loss Given Default)**: 부도 시 손실률 (LTV, 회수율, 경매 가치 등에 의해 결정).
- **EAD (Exposure at Default)**: 부도 시점의 노출 금액 (대출 잔액 및 약정 한도).

### 2.2 부도 확률 분포 및 시뮬레이션 지표
몬테카를로 시뮬레이션을 통해 생성된 손실 분포에서 다음 지표를 도출합니다.

| 지표명 | 영문명 | 산식 및 의미 |
| :--- | :--- | :--- |
| **VaR** | Value at Risk | $P(Loss > VaR) = \alpha$, 특정 신뢰수준($\alpha$)에서의 최대 예상 손실 경계값. |
| **CVaR** | Conditional VaR | $E[Loss \mid Loss \ge VaR]$, VaR를 초과하는 최악 구간의 평균 손실액 (Tail Risk). |

---

## 3. 시뮬레이션 프로세스 (Monte Carlo Process)

`SimulationService`는 다음 5단계 프로세스를 통해 리스크를 정교화합니다.

1.  **변수 정의**: 분양률(Absorption Rate), 금리(Interest Rate), 공사비(CapEx) 등 핵심 변수의 확률 분포 설정.
2.  **시나리오 생성**: 난수 생성기(Mersenne Twister 등)를 활용하여 $N=10,000$ 개 이상의 가상 시나리오 생성.
3.  **Waterfall 가상 기동**: 각 시나리오별 `WaterfallEngine`을 통한 현금흐름 및 수익률 산출.
4.  **분포 분석**: 결과값(NPV, IRR, DSCR)을 정렬하여 임계값 및 통계량 산출.
5.  **의사결정 지원**: VaR/CVaR 기반의 스트레스 상황 대응 전략(Mitigation Strategy) 도출.

---

## 4. 데이터 접근 및 실무 SQL 구현

> [!IMPORTANT]
> **Legacy Compatibility**: Oracle 9i 환경 및 PostgreSQL 호환성을 위해 표준 SQL 함수를 권장합니다.

### 4.1 VaR/CVaR SQL (PostgreSQL 예시)
```sql
-- 신뢰수준 95% VaR 및 CVaR 산출
WITH var_calc AS (
    SELECT percentile_cont(0.95) WITHIN GROUP (ORDER BY loss_amount) AS var_95
    FROM simulation_result
)
SELECT 
    v.var_95,
    AVG(s.loss_amount) AS cvar_95
FROM simulation_result s, var_calc v
WHERE s.loss_amount >= v.var_95
GROUP BY v.var_95;
```

---

> [!TIP]
> **성능 최적화**: 시뮬레이션 시에는 DB 트랜잭션을 발생시키지 않는 **In-memory Virtual Run** 모드를 활용하여 응답성을 확보합니다.
