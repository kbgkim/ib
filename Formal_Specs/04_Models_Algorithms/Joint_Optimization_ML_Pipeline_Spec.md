---
ID: IB-DOC-M03
Title: 통합 최적화 및 ML 파이프라인 사양 / Joint Optimization & ML Pipeline Specification
Category: ML/Algorithm
Version: 1.2
Status: Formalized
---

# [IB-DOC-M03] 통합 최적화 및 ML 파이프라인 사양

본 사양서는 Pricing과 Allocation을 동시에 최적화하고, 이를 지원하는 **ML 마이크로서비스(Python)**와 **피처 파이프라인(Feature Pipeline)**을 정의합니다.

---

## 1. 통합 최적화 (Joint Optimization)

- **Concept**: 가격 결정이 배정에 미치는 영향과 배정 결과가 시장 안정성에 미치는 영향을 동시에 고려.
- **Algorithm**: 게임 이론(Game Theory) 기반의 균형 탐색 및 강화학습(RL) 에이전트 활용.

---

## 2. ML 모델 아키텍처 (LightGBM)

- **Model**: **LightGBM** 기반의 서열화(Ranking) 및 확률 예측 모델.
- **Features**: 
    -   투자자 과거 배정 유지 기간 (Holding Period).
    -   딜 유형별 선호도 및 주문 신뢰도.
    -   시장 거시 지표 (Macro Indicators).
- **Interpretability**: **SHAP** 값을 활용하여 "왜 이 투자자에게 가중치를 주었는지"에 대한 설명력(XAI) 제공.

---

## 3. 데이터 파이프라인 (Feature Store)

- **Extraction**: Main DB(Oracle)에서 투자 이력 추출.
- **Transformation**: 실시간 피처 스토어(Redis)에 배포용 피처 적재.
- **Inference**: REST/gRPC를 통해 실시간 스코어링 제공.

---

> [!IMPORTANT]
> **Drift Monitoring**: 배포된 모델의 성능을 실시간 감시하며, 데이터 분포가 일정 수준 이상 변화 시 알림과 함께 재학습 워크플로우를 가동합니다.
