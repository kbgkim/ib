# [IB-ENGINE-02] Pricing 자동화 로직 (수요곡선 기반)

본 문서는 Book Building 결과로 생성된 **수요곡선(Demand Curve)**을 기반으로  
최적 발행가(IPO) 또는 금리(DCM)를 자동 산출하는 Pricing 엔진을 정의한다.

---

# 1. 개념 정의

## 1.1 Pricing의 목적

> 시장 수요를 반영하여 **최적의 가격(또는 금리)**을 결정

---

## 1.2 입력 / 출력

```text
입력:
- Order Book (price, quantity)
- Target Supply (발행량)
- 전략 파라미터 (안정성, 흥행도)

출력:
- Final Price
- Oversubscription Ratio
2. 수요곡선 (Demand Curve)
2.1 정의

특정 가격 이상에서의 누적 수요

2.2 수학적 표현
D(p) = Σ (q_i where price_i >= p)
2.3 특징
- 단조 감소 함수
- 계단형 구조
- 가격 ↑ → 수요 ↓
3. 기본 Pricing 로직 (Cut-off)
3.1 정의

목표 발행량을 만족하는 최소 가격

3.2 알고리즘
1. 가격을 내림차순 정렬
2. 누적 수요 계산
3. cumulative >= target 되는 최초 price 선택
3.3 예시
Target = 100

Price   Qty   CumQty
100     20     20
95      30     50
90      60     110 ← 선택

Final Price = 90
4. 고급 Pricing 로직 (실무형)
4.1 Oversubscription 기반 조정
Oversubscription = Total Demand / Supply
전략
상태	전략
< 1	가격 하향
1 ~ 2	유지
> 2	가격 상향
4.2 Weighted Demand 모델
D'(p) = Σ (w_i * q_i)
w_i = 투자자 신뢰도 (기관 > 개인)
4.3 Price Band 제약
Final Price ∈ [min_price, max_price]
4.4 Elastic Demand 기반
E = (%ΔQ / %ΔP)
탄력성 낮음 → 가격 상승 가능
탄력성 높음 → 가격 민감
5. 최적 가격 함수
5.1 목적 함수
Maximize:
Revenue = Price × Allocated Quantity
5.2 제약 조건
- Demand >= Supply
- Price within Band
- Market Stability 고려
5.3 실무형 점수 함수
Score(p) =
  α * Revenue(p)
+ β * Oversubscription(p)
- γ * Price Volatility Risk
6. 알고리즘 (통합)
6.1 의사 코드
for each price p:

  demand = D(p)

  if demand < target:
      continue

  revenue = p * target

  oversub = demand / target

  score = alpha * revenue
        + beta * oversub
        - gamma * risk(p)

select p with max(score)
7. 시스템 구조
7.1 구성
Book Building Engine
 → Demand Curve Generator
 → Pricing Engine
 → Allocation Engine
7.2 이벤트 흐름
OrderAggregated
 → DemandCurveUpdated
 → PricingStarted
 → PriceFinalized
8. Java 구현 (핵심 로직)
public BigDecimal calculatePrice(
    NavigableMap<BigDecimal, BigDecimal> priceMap,
    BigDecimal target
) {

    BigDecimal cumulative = BigDecimal.ZERO;

    for (Map.Entry<BigDecimal, BigDecimal> entry : priceMap.entrySet()) {

        cumulative = cumulative.add(entry.getValue());

        if (cumulative.compareTo(target) >= 0) {
            return entry.getKey();
        }
    }

    return BigDecimal.ZERO;
}
8.2 고급 Score 기반
double score = alpha * revenue
             + beta * oversub
             - gamma * risk;
9. 리스크 고려
9.1 주요 리스크
- 허수 주문 (Fake Demand)
- 가격 왜곡
- 시장 변동성
9.2 대응
- 주문 필터링
- 투자자 가중치 적용
- 실시간 재계산
10. 핵심 설계 포인트
10.1 Pricing은 단순 계산이 아님
"시장 심리를 반영한 의사결정"
10.2 수요곡선이 핵심 데이터
모든 가격 결정은 Demand Curve 기반
10.3 자동화 vs 전략
자동 계산 + IB 판단 병행 필요
11. 한 줄 정리

Pricing 엔진은 수요곡선을 기반으로 최적 가격을 탐색하여 수익과 시장 안정성을 동시에 만족시키는 시스템이다.

[END]

---

# 실무 핵심 요약

이 로직을 한 문장으로 압축하면:

👉 **“수요곡선 위에서 가장 돈이 되면서도 시장이 받아들일 수 있는 가격을 찾는 문제”**

---

# 다음 단계 추천

이제 여기까지 왔으면 거의 완성 단계입니다:

### 1️⃣ Allocation 고도화
- Anchor / Long-only 투자자 우선 배정

### 2️⃣ ML Pricing
- LightGBM 기반 가격 추천

### 3️⃣ 시뮬레이션
- “가격별 시나리오 비교 엔진”

---

원하면 다음은  
👉 **“Allocation 전략 엔진 (룰 + ML 기반)”**  
👉 **“PF 리스크 + Pricing 연결 구조”**

까지 이어서 설계해드리겠습니다.