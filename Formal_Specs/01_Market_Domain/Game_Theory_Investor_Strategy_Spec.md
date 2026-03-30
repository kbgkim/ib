---
ID: IB-DOC-C03
Title: 게임 이론 기반 투자자 전략 분석 / Game Theory Based Investor Strategy Analysis
Category: Concept
Version: 1.2
Status: Formalized
---

# [IB-DOC-C03] 게임 이론 기반 투자자 전략 분석

본 사양서는 북빌딩(Book Building) 과정에서 발생하는 투자자들의 전략적 행동(Strategic Behavior)을 모델링하고, 이를 시스템의 가격 결정 및 배정 로직에 반영하는 이론적 프레임워크를 정의합니다.

---

## 1. 투자자 행동 모델링 (Investor Behavior Modeling)

### 1.1 정보의 비대칭성 (Information Asymmetry)
- 투자자들은 발행사에 대한 독자적인 정보를 보유하며, 이를 숨기거나 왜곡하여 자신에게 유리한 가격에 배정받으려 합니다 (Adverse Selection).

### 1.2 위장 수요 (Window Dressing / Fake Orders)
- 배정 물량을 늘리기 위해 실제 의사보다 높은 가격이나 과도한 수량을 주문하는 행위.
- **대응 전략**: 실시간 수요곡선의 왜곡 정도를 점검(Drift Monitoring)하여 배정 가중치를 조절합니다.

---

## 2. 핵심 게임 이론 적용 (Core Game Theory Concepts)

### 2.1 샤플리 밸류 (Shapley Value) 기반 기여도 평가
- 특정 투자자가 해당 딜의 성공(또는 가격 발견)에 기여한 정도를 수치화합니다.
- **활용**: Anchor 투자자가 가격 하한선을 지지해 준 기여도를 배정 점수에 반영합니다.

### 2.2 경매 이론 (Auction Theory) 적용
- **Vickrey Auction (Second-price sealed-bid)** 개념을 변형하여, 진실된 주문(Truthful Bidding)을 유도하는 인센티브 구조를 설계합니다.
- **구축 방향**: 배정 후 사후 평가 점수를 통해 차기 딜에서의 배정 우선순위를 결정하는 반복 게임(Repeated Game) 구조를 가집니다.

---

## 3. 시스템 연동 방안 (System Integration)

- **ML Service 연합**: Layer 04의 ML 모델은 투자자의 과거 주문 패턴을 학습하여 '전략적 주문(Strategic Order)' 여부를 확률로 산출합니다.
- **Allocation Engine**: 계산된 전략 지수를 통해 Pro-rata 배정치를 실시간으로 보정(Calibration)합니다.

---

> [!IMPORTANT]
> **게임 이론 기반 엔진**은 단순한 수식 적용을 넘어, 마켓의 신뢰(Market Integrity)를 유지하기 위한 기술적 장치로 기능합니다.
