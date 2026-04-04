---
ID: IB-DOC-M01
Title: 북빌딩 및 실시간 수요 분석 엔진 / Book Building & Real-time Demand Analysis Engine
Category: ML/Algorithm
Version: 1.2
Status: Formalized
---

# [IB-DOC-M01] 북빌딩 및 실시간 수요 분석 엔진

본 사양서는 ECM/DCM 발행 시 투자자의 주문(Order)을 실시간으로 수집하고, 이를 가공하여 **수요 곡선(Demand Curve)**을 생성하는 알고리즘과 데이터 파이프라인을 정의합니다.

---

## 1. 주문 스트림 및 집계 (Order Stream & Aggregation)

### 1.1 입력 데이터 포맷
- **Order ID / Investor ID**: 고유 식별자.
- **Price (P)**: 투자자의 희망 응찰 가격 (또는 금리).
- **Quantity (Q)**: 희망 배정 수량.
- **Timestamp**: 주문 및 수정 시점.

### 1.2 누적 수요 계산 (Cumulative Demand)
특정 가격 $P$에서의 누적 수요 $D(P)$는 해당 가격 이상의 주문량을 모두 합산하여 산출합니다.
$$D(P) = \sum_{P_i \ge P} Q_i$$

---

## 2. 수요 곡선 모델링 (Demand Curve Modeling)

### 2.1 이산형 수요 곡선 (Step Function)
실제 주문 데이터를 바탕으로 생성된 계단형 곡선입니다. 배정 엔진의 기초 데이터로 사용됩니다.

### 2.2 탄력적 수요 곡선 (Elastic Demand Curve)
ML 모델을 통해 보정된 연속형 곡선으로, 가격 변화에 따른 수요의 민감도($\epsilon$)를 분석하는 데 사용됩니다.
$$\epsilon = \frac{dQ/Q}{dP/P}$$

---

## 3. 이상 주문 필터링 (Anomaly Detection)

수요를 왜곡시키기 위한 허수 주문 또는 위장 수요(Window Dressing)를 사전에 필터링합니다.
- **Outlier Detection**: 시장 평균가 대비 과도하게 높거나 낮은 가격의 주문.
- **Strategic Bidding Check**: 마감 직전 대규모 주문 취소 및 변경 이력이 잦은 투자자의 신뢰도 감점 처리.

---

## 4. 시스템 구현 전략

- **Real-time Aggregation**: **Redis Hash**를 사용하여 가격대별 수량을 $O(1)$ 속도로 실시간 가중 합계 계산.
- **Data Persistence**: 최종 확정된 주문부는 **PostgreSQL/Oracle**에 영구 저장하여 결제(Settlement)와 연동.

---

> [!TIP]
> **실무 포인트**: 실시간 집계 결과는 [IB_Trader_Dashboard_UX_Spec.md](../..-risk-worktree/Formal_Specs/05_UI_UX_Prototyping/IB_Trader_Dashboard_UX_Spec.md)의 호가창(Price Ladder)에 즉시 시각화됩니다.
