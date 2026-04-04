---
ID: IB-DOC-P01
Title: PF Waterfall 및 트랜치 구조 설계 사양서 / PF Waterfall & Tranche Structure Design Spec
Category: Product Structure
Version: 1.2
Status: Formalized
---

# [IB-DOC-P01] PF Waterfall 및 트랜치 구조 설계 사양서

본 사양서는 Project Finance(PF) 딜의 핵심인 **Waterfall(현금흐름 배분 규칙)**과 **Tranche(자금 구조 계층화)**를 정의하며, 리스크와 수익의 배분 메커니즘을 상세히 다룹니다.

---

## 1. Waterfall 배분 구조 (Cash Flow Hierarchy)

프로젝트에서 발생한 가용 현금(CFADS)은 사전에 합의된 우선순위에 따라 다음과 같이 순차적으로 배분됩니다.

1.  **OPEX (운영비)**: 프로젝트 유지를 위한 필수 비용.
2.  **Tax (세금)**: 법적 의무 납부액.
3.  **Senior Debt (선순위)**: 원금 및 이자 상환.
4.  **Reserve Accounts (적립금)**: DSRA(원리금상환적립금) 등.
5.  **Mezzanine Debt (중순위)**: 원리금 상환.
6.  **Equity (에퀴티)**: 잔여 현금 배당.

---

## 2. 트랜치 구조 설계 (Tranche Structuring)

자금 조달 구조를 리스크와 수익률에 따라 계층화하여 서로 다른 성향의 투자자를 유치합니다.

- **Senior Tranche**: 가장 낮은 금리, 가장 높은 상환 우선순위. (은행, 보험사 위주)
- **Mezzanine Tranche**: 중간 수준의 금리 및 리스크. (캐피탈, 증권사 위주)
- **Equity Tranche**: 가장 높은 리스크, 잔여 수익 수취로 인한 높은 기대 수익률. (시공사, 전략적 투자자 위주)

---

## 3. 핵심 금융 지표 (Key Financial Metrics)

시스템은 Waterfall 실행 결과로 다음 지표를 실시간 계산합니다.
- **DSCR (Debt Service Coverage Ratio)**: 당기 부채 상환 능력. (목표 > 1.2x)
- **LLCR (Loan Life Coverage Ratio)**: 대출 전 기간에 걸친 부채 상환 능력.
- **Project IRR / Equity IRR**: 프로젝트 및 투자자별 내부 수익률.

---

## 4. 리스크 전이 및 흡수 메커니즘

- **손실 흡수 (Loss Absorption)**: 프로젝트 손실 발생 시 가장 하위 계층인 Equity부터 손실을 부담하며, Senior 계층을 보호합니다.
- **Cash Sweep**: DSCR이 일정 수준 이하로 하락할 경우, 배당을 중단하고 원금을 강제 상환하는 보호 장치.

---

> [!IMPORTANT]
> **Waterfall 계산 엔진**의 상세 로직과 코드는 [PF_Waterfall_Calculation_Engine_Spec.md](../..-risk-worktree/Formal_Specs/02_Product_Structures/PF_Waterfall_Calculation_Engine_Spec.md)를 참조하십시오.
