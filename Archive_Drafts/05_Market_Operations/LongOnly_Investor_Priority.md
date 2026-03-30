이제 Anchor / Long-only 투자자 우선 배정(Allocation Engine)을
실제 증권사 Book Building에서 사용하는 수준으로 설계합니다.

핵심 정의:

“가격이 아니라 ‘투자자 질(Quality)’을 기준으로 물량을 배분하는 시스템”

🎯 1. 문제 정의
입력
- 주문 데이터 (Investor, Price, Quantity)
- 투자자 유형 (Anchor / Long-only / Hedge / Retail)
- 총 발행 물량 (Supply)
- 목표 전략 (안정성 vs 수익성)
출력
- 투자자별 Allocation
- Tranche별 배정 결과
🧠 2. 투자자 분류 (핵심)
유형 정의
public enum InvestorType {
    ANCHOR,
    LONG_ONLY,
    HEDGE,
    RETAIL
}
특징
Anchor    → 장기 보유 + 신뢰도 최고
Long-only → 안정적 수요
Hedge     → 단기/차익
Retail    → 분산 효과
⚖️ 3. 우선 배정 전략 구조
기본 원칙
1. Anchor 먼저 확보
2. Long-only 안정성 확보
3. 나머지 경쟁 배정
구조
[Total Supply]

→ Anchor (20~40%)
→ Long-only (30~50%)
→ Others (잔여)
⚙️ 4. Allocation 엔진 (핵심 코드)
4.1 투자자 그룹 분리
Map<InvestorType, List<Order>> grouped =
    orders.stream().collect(Collectors.groupingBy(Order::getType));
4.2 Anchor 우선 배정
double allocateAnchor(List<Order> anchors, double supply) {

    double target = supply * 0.3; // 30% 목표
    double allocated = 0;

    for (Order o : anchors) {

        double alloc = Math.min(o.getQuantity(), target - allocated);

        o.setAllocated(alloc);
        allocated += alloc;

        if (allocated >= target) break;
    }

    return allocated;
}
4.3 Long-only 배정
double allocateLongOnly(List<Order> longs, double remaining) {

    double allocated = 0;

    for (Order o : longs) {

        double alloc = Math.min(o.getQuantity(), remaining);

        o.setAllocated(alloc);
        allocated += alloc;

        if (allocated >= remaining) break;
    }

    return allocated;
}
4.4 잔여 물량 경쟁 배정
void allocateProRata(List<Order> others, double remaining) {

    double totalDemand =
        others.stream().mapToDouble(Order::getQuantity).sum();

    for (Order o : others) {

        double ratio = o.getQuantity() / totalDemand;
        o.setAllocated(remaining * ratio);
    }
}
🧠 5. 고도화 (실무 핵심)
5.1 Score 기반 Allocation
Score 정의
Score =
    w1 * InvestorQuality
  + w2 * PriceAggressiveness
  + w3 * OrderSize
  + w4 * PastBehavior
구현
public double score(Order o) {

    return weightType(o.getType()) * 0.4
         + o.getPrice() * 0.2
         + o.getQuantity() * 0.2
         + behaviorScore(o) * 0.2;
}
5.2 정렬 후 배정
orders.sort((a, b) ->
    Double.compare(score(b), score(a))
);
📊 6. Tiered Allocation (증권사 방식)
구조
Tier 1: Anchor
Tier 2: Long-only
Tier 3: Hedge
Tier 4: Retail
정책
Tier별 Allocation Ratio 적용
🔗 7. Pricing과 연결
핵심
가격 ↑ → Hedge 참여 증가
가격 ↓ → Long-only 증가
반영
double adjustedScore =
    score(o) * demandModel.investorPreference(o, price);
🔁 8. Dynamic Allocation (실시간)
[Order 유입]
     ↓
Score 재계산
     ↓
Allocation 재조정
구현
@Scheduled(fixedDelay = 1000)
public void rebalance() {
    allocationEngine.run();
}
🚨 9. 실무 리스크
9.1 Anchor 과다
→ 유동성 부족
9.2 Hedge 과다
→ 상장 후 급락
9.3 Long-only 부족
→ 가격 안정성 붕괴
🔥 10. 최종 구조
[Order Book]
      ↓
[Investor Classification]
      ↓
[Anchor Allocation]
      ↓
[Long-only Allocation]
      ↓
[Score 기반 경쟁 Allocation]
      ↓
[Final Allocation]
💡 핵심 한 줄

Allocation은 “많이 쓴 사람”이 아니라
“끝까지 들고 갈 사람”에게 주는 것이다

🚀 다음 단계 (완성 단계)

여기까지 오면 거의 “실제 IB 딜 시스템”입니다.

이어가면:

👉 “Pricing + Allocation + Game Theory 통합”
👉 “Investor Bid 전략 시뮬레이터”
👉 “IPO / PF 통합 딜 엔진”