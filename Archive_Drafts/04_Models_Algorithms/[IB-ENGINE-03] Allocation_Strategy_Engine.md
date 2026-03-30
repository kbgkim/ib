# [IB-ENGINE-03] Allocation 전략 엔진 (Rule + ML 기반)

본 문서는 Book Building 이후 단계인 **Allocation(배정)**을  
정책 기반(Rule Engine) + 머신러닝 기반(ML Engine)으로 통합 설계한다.

---

# 1. Allocation 개념

## 1.1 정의

> 확정된 가격에서 투자자들에게 최종 물량을 배분하는 과정

---

## 1.2 목표

```text
- 공정성 (Fairness)
- 장기 투자자 확보 (Stability)
- 시장 성공 (After-market performance)
2. 입력 / 출력
2.1 입력
- Order Book (price, quantity)
- Final Price
- Total Supply
- Investor Profile
2.2 출력
- investor_id
- allocated_quantity
3. 기본 Allocation 로직
3.1 필터링
조건:
order.price >= final_price
3.2 Pro-rata 배정
allocation_i = (order_i / total_demand) * total_supply
3.3 예시
총 수요: 200
공급: 100

A: 100 → 50
B: 50 → 25
C: 50 → 25
4. Rule 기반 Allocation (핵심)
4.1 투자자 Tier
Tier 1: Anchor / Long-only
Tier 2: 기관
Tier 3: 일반
4.2 기본 룰
1. Anchor 최소 배정 보장
2. Long-term investor 우대
3. 단기 투기성 제한
4.3 Tiered Allocation
Step 1: Anchor 30% 확보
Step 2: 기관 50%
Step 3: 일반 20%
4.4 Cap / Floor
- Max allocation per investor
- Min allocation 보장
4.5 Concentration Control
한 투자자 쏠림 방지
5. ML 기반 Allocation
5.1 목적
- 투자자 품질 평가
- 장기 수익 극대화
5.2 주요 Feature
- 과거 투자 유지 기간
- IPO 이후 수익률
- 주문 신뢰도 (취소율)
- 투자 규모
5.3 Label
- Good Investor (1)
- Bad Investor (0)
5.4 모델
- LightGBM / XGBoost
5.5 Score
InvestorScore = ML(model(features))
6. Hybrid Allocation 알고리즘
6.1 핵심 아이디어
Rule 기반 + ML Score 결합
6.2 공식
weight_i =
  α * (order_i / total_demand)
+ β * investor_score_i
+ γ * tier_weight
6.3 최종 배정
allocation_i =
(weight_i / Σ weight) * total_supply
6.4 의사 코드
for investor:

  base = order / total_demand
  score = ML(investor)
  tier = tier_weight

  weight = a*base + b*score + c*tier

normalize weights

allocate proportionally
7. 시스템 아키텍처
7.1 구성
Order Service
 → Pricing Engine
 → Allocation Rule Engine
 → ML Scoring Engine
 → Allocation Engine
7.2 이벤트 흐름
PriceFinalized
 → AllocationStarted
 → MLScoreCalculated
 → AllocationCompleted
8. Java 설계
8.1 엔티티
class Investor {
    Long id;
    double score;
    String tier;
}
8.2 핵심 로직
double weight = alpha * base
              + beta * score
              + gamma * tierWeight;
8.3 배정 계산
allocation = (weight / totalWeight) * totalSupply;
9. 리스크 제어
9.1 주요 문제
- 단기 투자자 과다
- 허수 주문
- 특정 투자자 독점
9.2 대응
- ML 기반 필터링
- Hard Cap 설정
- Order 신뢰도 반영
10. 고급 전략
10.1 Anchor Allocation
사전 배정 (Pre-allocation)
10.2 Long-only Boost
장기 투자자 가중치 증가
10.3 Flip Risk Control
상장 직후 매도 가능성 낮은 투자자 우대
11. 핵심 설계 포인트
11.1 Allocation은 전략 영역
단순 계산이 아니라 IB 의사결정
11.2 Rule + ML 필수
Rule → 안정성
ML → 최적화
11.3 데이터 중요성
과거 투자자 행동 데이터 핵심
12. 한 줄 정리

Allocation 엔진은 Rule 기반 공정성과 ML 기반 최적화를 결합하여 투자자별 배정을 결정하는 시스템이다.

[END]

---

# 실무 핵심 요약

이 엔진을 한 문장으로 정리하면:

👉 **“좋은 투자자에게 더 많이 주고, 시장을 망칠 투자자는 줄이는 시스템”**

---

# 다음 단계 (강력 추천)

여기까지 연결하면 IB 시스템의 핵심은 완성입니다.  
다음은 “진짜 차별화 영역”입니다:

### 1️⃣ Pricing + Allocation 통합 최적화
- 가격과 배정을 동시에 결정 (Game Theory)

### 2️⃣ PF 리스크 연결
- 어떤 투자자가 PF에도 참여할지 연결

### 3️⃣ Digital IB 플랫폼
- End-to-End 자동화

---

원하면 다음은  
👉 **“Pricing + Allocation 동시 최적화 엔진 (게임이론 기반)”**  
👉 **“투자자 행동 데이터 기반 ML 파이프라인”**

까지 이어서 설계해드리겠습니다.