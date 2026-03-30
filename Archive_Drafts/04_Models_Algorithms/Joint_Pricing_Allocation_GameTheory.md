게임이론 기반 Pricing + Allocation 수식 모델 (완전 수학화)”
👉 “실제 LightGBM 학습 코드 + Feature Engineering”

두 축을 완전히 연결된 하나의 엔진으로 설계합니다:

🎯 목표

Pricing + Allocation을 동시에 결정하는 게임이론 기반 엔진 +
투자자 행동 ML 모델 (LightGBM) 통합

🧠 1. 문제 정의 (Game Theory)
1.1 플레이어
Issuer (발행자)
Investor (투자자 집합)
1.2 전략
Issuer:
    - Tranche 금리 (r_senior, r_mezz)
    - 구조 (ratio)

Investor:
    - 투자 여부
    - 투자 금액
1.3 핵심 목표
Issuer:
    Maximize Equity IRR

Investor:
    Maximize Expected Return - Risk
⚖️ 2. Nash Equilibrium 구조
2.1 핵심 수식

Issuer의 목적:

Maximize:

Equity_IRR(r) 
subject to:
    Σ Allocation_i(r) >= Deal Size

Investor의 효용:

Utility_i = Expected Return - λ * Risk

👉 균형 조건

투자자가 참여하는 금리에서
Issuer IRR이 최대가 되는 지점
⚙️ 3. 알고리즘 구조
[1] 금리 후보 생성
      ↓
[2] 각 금리에서 투자자 참여 확률 계산 (ML)
      ↓
[3] Allocation 계산
      ↓
[4] Waterfall → IRR 계산
      ↓
[5] Deal 성사 여부 판단
      ↓
[6] 최적 금리 선택 (Nash)
🧩 4. Java 구현 (핵심 엔진)
4.1 Pricing + Allocation 통합 엔진
@Service
public class PricingAllocationEngine {

    private final InvestorMLModel mlModel;
    private final WaterfallService waterfallService;

    public PricingResult optimize(Long projectId) {

        double bestScore = -Double.MAX_VALUE;
        PricingResult best = null;

        for (double rate = 0.03; rate <= 0.12; rate += 0.002) {

            // 1. 투자자 참여 확률
            List<Double> probs =
                mlModel.predictParticipation(rate);

            // 2. Allocation 계산
            double allocation = calculateAllocation(probs);

            // 3. Deal 성사 여부
            if (allocation < REQUIRED_AMOUNT) continue;

            // 4. Waterfall → IRR
            double irr =
                waterfallService.calculateIRR(projectId, rate);

            // 5. Score
            double score = irr * allocation;

            if (score > bestScore) {
                bestScore = score;
                best = new PricingResult(rate, irr, allocation);
            }
        }

        return best;
    }

    private double calculateAllocation(List<Double> probs) {
        return probs.stream().mapToDouble(p -> p * 100).sum();
    }
}
🤖 5. 투자자 행동 ML 모델 (핵심)
5.1 문제 정의
Input:
    - 금리
    - 리스크 (PD, DSCR)
    - 시장 상황
    - 투자자 특성

Output:
    - 투자 확률 P(invest)
5.2 Feature Engineering (실무 핵심)
rate_spread = offered_rate - market_rate
risk_score  = PD + volatility
dscr
investor_type (보험, 연기금, 증권사)
past_behavior (과거 참여율)
📊 6. LightGBM 학습 코드 (Python)
import lightgbm as lgb
import pandas as pd

# 데이터
df = pd.read_csv("investor_data.csv")

X = df[[
    "rate_spread",
    "risk_score",
    "dscr",
    "investor_type",
    "past_participation"
]]

y = df["invested"]  # 0/1

# 모델
model = lgb.LGBMClassifier(
    n_estimators=200,
    max_depth=5,
    learning_rate=0.05
)

model.fit(X, y)

# 저장
model.booster_.save_model("investor_model.txt")
🔌 7. Java에서 ML 모델 사용
7.1 방법 3가지
1. Python API 호출 (FastAPI)
2. ONNX 변환
3. PMML (추천)
7.2 REST 방식 (현실적)
@Component
public class InvestorMLModel {

    public List<Double> predictParticipation(double rate) {

        // Python API 호출
        // response: [0.7, 0.3, 0.9...]

        return callModel(rate);
    }
}
🔁 8. 전체 통합 흐름
시장 데이터
   ↓
Tranche 구조
   ↓
금리 후보 생성
   ↓
ML → 투자자 참여 확률
   ↓
Allocation 계산
   ↓
Waterfall → IRR
   ↓
Deal 성사 판단
   ↓
최적 금리 선택
🧬 9. 고급 확장 (진짜 차별화)
9.1 Reinforcement Learning
State:
    시장 + 구조

Action:
    금리 설정

Reward:
    IRR + Allocation
9.2 Multi-Agent Simulation
Investor 각각을 Agent로 모델링
📌 10. 실무 핵심 인사이트
❗ 1. Pricing ≠ 금리 맞추기
→ "투자자가 실제로 사는 가격"
❗ 2. Allocation이 더 중요
금리 낮아도 못 팔면 의미 없음
❗ 3. ML이 핵심 이유
투자자 행동은 비선형 + 비합리적
🚀 11. 최종 아키텍처
[Tranche Optimizer]
        ↓
[Pricing + Allocation Engine]  ← 핵심
        ↓
[Waterfall Engine]
        ↓
[Risk Engine]
        ↓
[Simulation Engine]
        ↓
[ML Model (Investor Behavior)]
🔥 한 줄 결론

이 구조는 “가격 + 수요 + 리스크”를 동시에 풀어내는 IB 딜 자동화 엔진의 완성형이다.