---
ID: IB-DOC-R02
Title: 배정 전략 엔진 사양서: Rule & ML 하이브리드 / Allocation Strategy Engine Spec: Rule & ML Hybrid
Category: Risk Engine / Allocation
Version: 1.2
Status: Formalized
---

# [IB-DOC-R02] 배정 전략 엔진 사양서 (Rule & ML 하이브리드)

본 사양서는 북빌딩 이후 확정된 발행가를 기준으로 투자자별 배정 물량을 확정하는 **Allocation Engine**의 전략적 메커니즘을 정의합니다.

---

## 1. 배정 목표 (Allocation Objectives)

- **공정성 (Fairness)**: 명확한 기준에 따른 투명한 물량 배분.
- **안정성 (Stability)**: 장기 투자자(Long-only) 확보를 통한 상장 후 가격 안정성 도모.
- **시장 신뢰 (Market Integrity)**: 허수 주문 및 투기성 세력에 대한 배정 제한.

---

## 2. 하이브리드 배정 알고리즘 (Hybrid Algorithm)

단순 비례 배정(Pro-rata)의 한계를 극복하기 위해 **정책(Rule)**과 **예측(ML Score)**을 결합합니다.

### 2.1 가중치 산출 공식 (Weighting Formula)
각 투자자의 배정 가중치($W_i$)는 다음과 같이 산출됩니다.
$$W_i = \alpha \cdot (\text{Demand Ratio}) + \beta \cdot (\text{Investor ML Score}) + \gamma \cdot (\text{Tier Weight})$$

- **Demand Ratio**: 전체 수요 대비 개별 투자자 주문 비율.
- **Investor ML Score**: 과거 투자 유지 기간, 취소율 등을 기반으로 한 품질 점수.
- **Tier Weight**: Anchor(T1), 일반 기관(T2), 기타(T3) 등급별 가중치.

---

## 3. 리스크 제어 정책 (Risk Guardrails)

- **Concentration Cap**: 특정 투자자 또는 계열사에 대한 배정 물량이 전체의 일정 비율(예: 15%)을 넘지 않도록 제한.
- **Flip Risk Filter**: 과거 상장 직후 전량 매도(Flipping) 이력이 있는 투자자에게는 패널티 가중치 부여.
- **Minimum Allocation (Floor)**: 유의미한 참여를 유도하기 위한 최소 배정 물량 보장.

---

## 4. 시스템 아키텍처 연동

1.  **Pricing Engine**: 최종 발행가 통보.
2.  **ML Scoring Engine**: 투자자별 품질 분석 결과 제공.
3.  **Allocation Engine**: 가중치 기반 물량 산출 및 확정.

---

> [!NOTE]
> 세부적인 투자자 등급 분류 기준은 [Advanced_Allocation_Tiers_Spec.md](../..-risk-worktree/Formal_Specs/03_Risk_Engines/Advanced_Allocation_Tiers_Spec.md)를 참조하십시오.
