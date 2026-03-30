---
ID: IB-DOC-M02
Title: 가격 최적화 및 자동 프라이싱 엔진 사양 / Pricing Optimization & Auto Pricing Engine Specification
Category: ML/Algorithm
Version: 1.2
Status: Formalized
---

# [IB-DOC-M02] 가격 최적화 및 자동 프라이싱 엔진 사양

본 사양서는 수집된 수요 데이터를 기반으로 최적의 발행가(또는 금리)를 결정하는 **Pricing Optimization Engine**의 로직과 알고리즘을 정의합니다.

---

## 1. 가격 결정 로직 (Pricing Logic)

### 1.1 Cut-off Price (결정 가격)
총 발행 물량을 소화할 수 있는 최소 가격을 산정합니다.
- **Rules**: 발행 물량 $에 대해 (P) \ge S$를 만족하는 최대 $.

### 1.2 VWAP (Volume Weighted Average Price) 보정
시장 변동성이 큰 경우, 최근 거래량 가중 평균 가격(VWAP)을 참조하여 결정 가격의 범위를 제한합니다.

---

## 2. 탄력적 수요 곡선 (Elasticity-based Pricing)

단순 집계 외에, 가격 변화에 따른 수요의 변화율(탄력성)을 분석하여 최적의 가격점을 찾습니다.
- **Input**: ML 서비스 유입 수요 모델.
- **Process**: 수익 극대화( \cdot Q$) 지점 및 시장 안정성(/S$) 지점의 균형점(Equilibrium) 산출.

---

## 3. 이상 가격 방어 메커니즘 (Safe Guard)

- **Cap/Floor**: 사전에 정의된 가격 밴드(Band)를 벗어나는 결정 방지.
- **Oversubscription Anchor**: 청약 경쟁률이 일정 수준(예: 3x) 이상인 경우에만 가격 상향 조정 승인.

---

> [!TIP]
> **고급 모델**: 게임 이론과 결합된 동시 최적화 모델은 [Joint_Optimization_ML_Pipeline_Spec.md](file:///home/kbgkim/antigravity/projects/ib-risk-worktree/Formal_Specs/04_Models_Algorithms/Joint_Optimization_ML_Pipeline_Spec.md)를 참조하십시오.
