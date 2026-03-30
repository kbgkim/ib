---
ID: IB-DOC-R01
Title: 시장 충격 및 시나리오 엔진 사양서 / Market Shock & Scenario Engine Specification
Category: Risk Engine
Version: 1.2
Status: Formalized
---

# [IB-DOC-R01] 시장 충격 및 시나리오 엔진 사양서

본 사양서는 금리 변동, 정치적 불안, 뉴스 이벤트 등 **외부 시장 충격**이 IB 딜 및 포트폴리오에 미치는 영향을 분석하는 **시나리오 시뮬레이션 엔진**을 정의합니다.

---

## 1. 분석 대상 변수 (Sensi-Factors)

- **금리 (Interest Rate)**: 기준 금리 변동에 따른 조달 비용 및 PF DSCR 변화.
- **수요 변동 (Demand Shock)**: 주요 투자자(Anchor) 이탈 시의 북빌딩 성공 확률.
- **신용 리스크 (Credit Shock)**: 프로젝트 시행사/시공사의 신용 등급 강등 시나리오.
- **뉴스/이벤트 (Event Shock)**: 특정 키워드(부도, 연체 등) 유입에 따른 시장 심리 위축.

---

## 2. 시나리오 모델링

### 2.1 결정론적 시나리오 (Deterministic)
- "금리가 100bp 상승할 경우"와 같이 고정된 입력을 통한 결과 산출.
- 목적: 스트레스 테스트 (Stress Testing).

### 2.2 확률론적 시뮬레이션 (Stochastic)
- **Monte Carlo Simulation**: 주요 변수의 확률 분포를 기반으로 10,000회 이상의 시뮬레이션을 수행하여 IRR 분포 및 VaR 산출.
- 목적: 리스크의 확률적 범위 파악.

---

## 3. 시나리오 비교 엔진 (Scenario Comparison)

여러 시나리오의 결과를 단일 대시보드에서 비교하여 의사결정을 지원합니다.
- **Base Case**: 현재 시장 상황 반영.
- **Worst Case**: 금리 급등 + 수요 급감 동시 발생.
- **Best Case**: 금리 하락 + 조기 분양 완료 등 긍정적 시나리오.

---

## 4. 시스템 연동

- **Input**: Layer 05(Market Ops)에서 수집된 실시간 시장 데이터.
- **Output**: Layer 03(Risk)의 등급 보정 및 Layer 01(Concepts)의 의사결정 참고치 제공.

---

> [!TIP]
> **실무 활용**: 대형 딜의 수임(Mandate) 전, 최악의 시나리오에서도 원금 회수가 가능한지 검증하는 용도로 필수 활용됩니다.
