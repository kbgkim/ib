---
ID: IB-DOC-P03
Title: 트랜치 구조 최적화 엔진 사양 / Tranche Structure Optimization Engine Specification
Category: Product Structure / Optimization
Version: 1.2
Status: Formalized
---

# [IB-DOC-P03] 트랜치 구조 최적화 엔진 사양

본 사양서는 프로젝트 수익성을 극대화하기 위해 **Senior / Mezzanine / Equity 비율 및 금리**를 자동으로 설계하는 **최적화 엔진(Optimization Engine)**을 정의합니다.

---

## 1. 문제 정의 (Optimization Problem)

- **Input**: 예상 현금흐름(CF), 시장 금리, 투자자별 최소 요구 수익률(Hurdle Rate).
- **Objective**: **Maximize Equity IRR**.
- **Constraints**: 
    -   Minimum DSCR > 1.2x
    -   Maximum LTV < 70%
    -   Minimum Equity Ratio > 10%

---

## 2. 최적화 알고리즘 (Optimization Algorithms)

### 2.1 Grid Search (Initial Approach)
사전에 정의된 비율 조합(예: 70:20:10, 60:30:10 등)을 전수 조사하여 제약 조건을 만족하는 최적 구조 선정.

### 2.2 Genetic Algorithm (Advanced Approach)
구조(Chromosome)를 진화시켜나가며 복합적인 제약 조건 하에서 최적의 해를 탐색함. (전역 최적해 탐색에 유리)

---

## 3. 시스템 연동 흐름

1.  **Scenario Gen**: 시장 상황에 따른 다양한 CF 시나리오 생성.
2.  **Back-testing**: 생성된 구조로 Waterfall 시뮬레이션 수행.
3.  **Scoring**: IRR, DSCR 안정성, 리스크를 가중치로 평가.
4.  **Final Recommendation**: 심사역에게 최종 구조 제안.

---

> [!TIP]
> **고급 기능**: Layer 04의 ML 모델과 연합하여, 유사 딜의 성공 사례를 바탕으로 초기 구조 파라미터를 추천받을 수 있습니다.
