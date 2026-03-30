이 단계는 Pricing 엔진을 “시장 적합형”으로 끌어올리는 핵심 고도화입니다.
기존의 단순 금리 스윕 → 수요곡선 + 체결가격 메커니즘 기반 Pricing으로 전환합니다.

🎯 목표

VWAP 기반 가격 결정 + Elastic Demand Curve 기반 수요 반영 →
“실제로 팔리는 가격”을 계산

🧠 1. 핵심 개념 정리
1.1 기존 방식 (한계)
고정 금리 → 투자자 반응 → 실패/성공

👉 문제:

수요의 "양"을 반영 못함
가격 vs 물량 trade-off 없음
1.2 개선 구조
금리 → 수요곡선 생성 → 누적 수요 → VWAP → 최종 가격
📊 2. Elastic Demand Curve 모델
2.1 정의
Demand(r) = Σ_i P_i(r) * MaxAllocation_i
r ↑ → 수요 증가
r ↓ → 수요 감소
2.2 함수 형태 (실무형)
Logistic 함수 (추천)
P_i(r) = 1 / (1 + exp(-k * (r - r0)))
r0 : 투자자 기준 금리
k : 민감도
2.3 직관
금리가 기준보다 높아지면 → 급격히 참여 증가
⚙️ 3. VWAP 기반 Pricing
3.1 정의

Volume Weighted Average Price

𝑉
𝑊
𝐴
𝑃
=
∑
(
𝑟
𝑖
⋅
𝑄
𝑖
)
∑
𝑄
𝑖
VWAP=
∑Q
i
	​

∑(r
i
	​

⋅Q
i
	​

)
	​


3.2 IB 적용 방식
각 금리 구간별:
    - 투자 수요 (Q_i)
    - 해당 금리 (r_i)

→ 전체 체결 평균 금리 = VWAP
🧩 4. 알고리즘 구조
[1] 금리 grid 생성
      ↓
[2] 각 금리별 수요 계산 (Elastic Curve)
      ↓
[3] 누적 수요 계산
      ↓
[4] Deal Size 충족 지점 찾기
      ↓
[5] 해당 구간 VWAP 계산
      ↓
[6] 최종 Pricing
💻 5. Java 구현 (핵심 코드)
5.1 Demand Curve 모델
public class DemandCurve {

    public double probability(double rate, double r0, double k) {
        return 1.0 / (1.0 + Math.exp(-k * (rate - r0)));
    }
}
5.2 Investor 수요 계산
public class DemandCalculator {

    public double demand(double rate, List<Investor> investors) {

        double total = 0;

        for (Investor inv : investors) {

            double p = 1.0 / (1.0 + Math.exp(
                -inv.getSensitivity() * (rate - inv.getRequiredRate())
            ));

            total += p * inv.getMaxAmount();
        }

        return total;
    }
}
5.3 VWAP Pricing 엔진
@Service
public class VwapPricingEngine {

    private final DemandCalculator demandCalculator;

    public double price(List<Investor> investors, double dealSize) {

        double numerator = 0;
        double denominator = 0;

        for (double rate = 0.03; rate <= 0.12; rate += 0.001) {

            double demand = demandCalculator.demand(rate, investors);

            if (demand <= 0) continue;

            numerator += rate * demand;
            denominator += demand;

            // Deal Size 도달 시 break
            if (denominator >= dealSize) break;
        }

        return numerator / denominator;
    }
}
📈 6. 고급: 누적 수요 기반 컷오프 가격
6.1 Cut-off Rate
누적 수요 >= Deal Size 되는 최소 금리
6.2 실제 구조
낮은 금리 → 일부 투자자만 참여
높은 금리 → 더 많은 투자자 참여

→ 경계선이 최종 가격
🔁 7. Pricing + Allocation 통합
rate →
    Demand Curve →
        Allocation →
            Waterfall →
                IRR →
                    Score

👉 이제 완전히 연결됨

🧬 8. ML 결합 (핵심 진화)
기존
P_i(r) = logistic
고도화
P_i(r) = ML(rate, risk, market, investor profile)
Java 연결
double p = mlModel.predict(
    rate,
    risk,
    dscr,
    investorType
);
📊 9. 실무 핵심 튜닝 포인트
9.1 민감도 (k)
k ↑ → 수요 급변 (투자자 까다로움)
k ↓ → 완만 (유연한 투자자)
9.2 Investor Segmentation
보험 → 안정성 (k 낮음)
헤지펀드 → 수익성 (k 높음)
9.3 Market Spread
rate_spread = offered - benchmark
🚨 10. 실무에서 진짜 중요한 것
❗ 1. VWAP은 결과일 뿐
핵심은 Demand Curve 정확도
❗ 2. 데이터 없으면 실패
→ ML or 경험 기반 튜닝 필수
❗ 3. Pricing은 “협상 결과”
완전한 수학 문제가 아님
🚀 11. 최종 구조
[Investor ML Model]
        ↓
[Elastic Demand Curve]
        ↓
[Demand Aggregation]
        ↓
[VWAP Pricing]
        ↓
[Allocation Engine]
        ↓
[Waterfall → IRR]
🔥 한 줄 결론

Pricing은 “금리”가 아니라 수요곡선 위에서 결정되는 시장 균형점이다.

👉 다음 단계 (강력 추천)

이제 거의 완성입니다. 마지막 퍼즐:

1️⃣ Order Book 기반 Book Building 엔진
2️⃣ 실시간 수요 반영 Pricing (Streaming 구조)
3️⃣ IB 트레이더 UI (딜 컨트롤 패널)