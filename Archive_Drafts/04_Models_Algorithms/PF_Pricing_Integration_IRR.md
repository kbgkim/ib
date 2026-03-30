PF + Pricing 통합 엔진 (투자자 IRR 기반 발행가 결정)을
실제 딜에서 바로 적용 가능한 수준으로 정리합니다.

핵심 정의부터 명확히:

“투자자가 요구하는 IRR을 만족하도록 발행가(Price)를 역산하는 엔진”

🎯 1. 문제 정의 (완전 통합)
입력
- PF Cash Flow (Waterfall 결과)
- Tranche 구조 (Senior / Mezz / Equity)
- 투자자별 Target IRR
- 투자자 Demand (수요곡선)
출력
- 발행가 (Price)
- Tranche별 Allocation
- 예상 IRR / DSCR
🧠 2. 핵심 개념 (Pricing의 본질 변화)

기존:

수요 → 가격 결정

이제:

IRR → 가격 결정 → 수요 검증

👉 즉,

“가격은 수요가 아니라 IRR 제약에서 먼저 결정된다”

📐 3. IRR 기반 가격 결정 원리
기본 식

𝑁
𝑃
𝑉
=
∑
𝑡
=
0
𝑇
𝐶
𝐹
𝑡
(
1
+
𝑟
)
𝑡
−
𝑃
𝑟
𝑖
𝑐
𝑒
=
0
NPV=∑
t=0
T
	​

(1+r)
t
CF
t
	​

	​

−Price=0

의미
Price = Discounted Cash Flow (DCF)

👉 즉:

투자자가 원하는 IRR(r)을 넣으면 Price가 결정됨

⚙️ 4. Tranche별 Pricing 엔진
4.1 Equity Price 계산
public double priceFromIRR(List<Double> cashFlows, double targetIRR) {

    double price = 0;

    for (int t = 0; t < cashFlows.size(); t++) {
        price += cashFlows.get(t) / Math.pow(1 + targetIRR, t);
    }

    return price;
}
4.2 Tranche별 적용
public Map<String, Double> priceTranches(Map<String, List<Double>> trancheCF,
                                         Map<String, Double> targetIRR) {

    Map<String, Double> result = new HashMap<>();

    for (String t : trancheCF.keySet()) {
        double price = priceFromIRR(trancheCF.get(t), targetIRR.get(t));
        result.put(t, price);
    }

    return result;
}
🔗 5. PF + Pricing 통합 흐름
[PF Cash Flow Engine]
        ↓
[Waterfall → Tranche CF 분리]
        ↓
[IRR 기반 Price 계산]
        ↓
[Demand Curve 검증]
        ↓
[최종 발행가]
⚖️ 6. 수요곡선과 결합 (현실 핵심)
문제
IRR 기반 Price ≠ 시장 수용 가격
해결
Find p* such that:

1. IRR(p*) ≥ Target IRR
2. Demand(p*) ≥ Supply
구현
public double findOptimalPrice(List<Double> priceGrid) {

    double bestPrice = 0;

    for (double p : priceGrid) {

        double irr = irrCalculator.calculate(cashFlowAtPrice(p));
        double demand = demandModel.predict(p);

        if (irr >= targetIRR && demand >= supply) {
            bestPrice = Math.max(bestPrice, p);
        }
    }

    return bestPrice;
}
🧠 7. 투자자별 IRR 차등 반영 (실무 핵심)
구조
Anchor → 낮은 IRR 허용
Hedge → 높은 IRR 요구
Retail → 중간
반영
double blendedIRR =
    anchorWeight * 0.10 +
    hedgeWeight  * 0.18 +
    retailWeight * 0.14;

👉 이 값을 기준 IRR로 사용

📊 8. Allocation까지 포함 (완전체)
로직
1. 가격 결정
2. 투자자별 IRR 계산
3. IRR 높은 투자자 → 우선 배정
코드
public void allocate(List<Investor> investors, double price) {

    investors.sort((a, b) ->
        Double.compare(b.expectedIRR(price), a.expectedIRR(price))
    );

    for (Investor inv : investors) {
        allocate(inv);
    }
}
🔁 9. Iterative Solver (실전 필수)
구조
Price Guess
   ↓
IRR 계산
   ↓
Demand 확인
   ↓
Price 조정
   ↓
수렴
구현
public double solvePrice(double initialPrice) {

    double p = initialPrice;

    for (int i = 0; i < 50; i++) {

        double irr = irrCalculator.calculate(cashFlowAtPrice(p));
        double demand = demandModel.predict(p);

        double error = targetIRR - irr;

        if (Math.abs(error) < 0.0001) break;

        // Gradient-like update
        p = p * (1 + error * 0.5);

        // Demand constraint
        if (demand < supply) {
            p *= 0.95;
        }
    }

    return p;
}
🚨 10. 실무 리스크 포인트
10.1 IRR 과적합
→ 실제 Cash Flow 미달 시 손실
10.2 Demand 무시
→ 미매각 (Under-subscription)
10.3 Anchor 의존
→ 시장 왜곡
🔥 11. 최종 아키텍처
[PF Cash Flow Engine]
        ↓
[Waterfall Engine]
        ↓
[Tranche CF 생성]
        ↓
[IRR 기반 Pricing]
        ↓
[Demand Curve 검증]
        ↓
[Allocation Engine]
        ↓
[Final Deal Execution]
💡 핵심 한 줄

IB Pricing의 본질은
“수요를 맞추는 것이 아니라 IRR을 만족시키는 가격을 찾는 것”

🚀 다음 단계 (완전체)

이제 거의 “증권사 차세대 코어 시스템” 수준입니다.

이어가면:

👉 “Pricing + Allocation + Game Theory 통합 엔진”
👉 “Investor 전략 시뮬레이터 (Bid 전략)”
👉 “실제 딜 리플레이 시스템 (Backtesting)”