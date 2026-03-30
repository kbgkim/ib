LightGBM 기반 가격 추천 엔진을
지금까지 만든 **수요곡선 + PF/IRR + Allocation 구조와 연결되는 “실전형 ML 시스템”**으로 설계합니다.

핵심 정의:

“주어진 시장 상태에서 가장 성공 확률이 높은 가격을 ML이 추천한다”

🎯 1. 문제 정의 (ML 관점)
입력 (Feature)
- Price (후보 가격)
- 예상 Demand (수요곡선)
- Oversubscription Ratio
- Investor Mix (Anchor/Long-only/Hedge)
- PF IRR (가격 기준)
- Market Condition (금리, 변동성)
출력 (Target)

두 가지 방식 중 선택:

① 회귀 → Expected Return / IRR
② 분류 → 성공 확률 (Fully subscribed 여부)

👉 실무에서는 분류 + 회귀 혼합이 가장 강력

🧠 2. 학습 데이터 구조
데이터셋 예시
Deal | Price | Demand | Oversub | IRR | Success
------------------------------------------------
A    | 1000  | 1200   | 1.2     | 14% | 1
A    | 1050  | 800    | 0.8     | 16% | 0
B    | 950   | 2000   | 2.5     | 12% | 1
핵심 포인트
같은 딜에 대해 “여러 가격 시나리오”를 생성해야 함

👉 (Simulation 기반 데이터 생성 필수)

⚙️ 3. Feature Engineering (성능 핵심)
3.1 기본 Feature
price
log(price)
demand
oversub_ratio
3.2 투자자 구조
anchor_ratio
long_only_ratio
hedge_ratio
3.3 PF 연결 Feature
irr_at_price
min_dscr
default_prob
3.4 시장 Feature
interest_rate
market_volatility
sector_score
🤖 4. LightGBM 모델 학습
Python 코드 (핵심)
import lightgbm as lgb
import pandas as pd

# 데이터 로드
df = pd.read_csv("pricing_data.csv")

X = df.drop(columns=["success"])
y = df["success"]

# Dataset
train_data = lgb.Dataset(X, label=y)

# 파라미터
params = {
    "objective": "binary",
    "metric": "auc",
    "learning_rate": 0.05,
    "num_leaves": 64,
    "feature_fraction": 0.8,
    "bagging_fraction": 0.8,
    "bagging_freq": 5
}

# 학습
model = lgb.train(params, train_data, num_boost_round=200)

# 저장
model.save_model("pricing_model.txt")
🔗 5. Java (Spring) 연동
5.1 Feature 생성
public class PricingFeature {

    double price;
    double demand;
    double oversub;

    double irr;
    double dscr;

    double anchorRatio;
}
5.2 ML 서버 호출
public double predictSuccess(PricingFeature f) {

    return restTemplate.postForObject(
        "http://ml-server/predict",
        f,
        Double.class
    );
}
🎯 6. 가격 추천 알고리즘
핵심 로직
모든 가격 후보에 대해:

Score(p) =
    ML 성공확률
  + IRR 가중치
  + Oversub 안정성
구현
public double recommendPrice(List<Double> priceGrid) {

    double bestScore = -1;
    double bestPrice = 0;

    for (double p : priceGrid) {

        PricingFeature f = featureBuilder.build(p);

        double successProb = ml.predict(f);
        double irr = irrCalculator.calculate(cashFlowAtPrice(p));
        double oversub = demandModel.predict(p) / supply;

        double score =
                successProb * 0.5
              + irr * 0.3
              + Math.min(oversub, 2.0) * 0.2;

        if (score > bestScore) {
            bestScore = score;
            bestPrice = p;
        }
    }

    return bestPrice;
}
🔁 7. 실시간 구조
[Order Stream]
      ↓
[Demand Curve 업데이트]
      ↓
[Feature 생성]
      ↓
[LightGBM 예측]
      ↓
[가격 추천]
📊 8. 해석 (Feature Importance)

LightGBM 강점:

어떤 요소가 가격 결정에 영향을 주는지 설명 가능
예시
1. oversub_ratio (35%)
2. irr (25%)
3. anchor_ratio (15%)
4. price (10%)
🚨 9. 실무 리스크
9.1 데이터 부족
→ 초기에는 시뮬레이션 데이터 필수
9.2 Regime 변화
→ 시장 상황 바뀌면 모델 무력화
9.3 Overfitting
→ 과거 딜에만 맞춤
🔥 10. 전체 통합 구조
[Demand Curve]
        ↓
[PF Cash Flow → IRR]
        ↓
[Feature Engineering]
        ↓
[LightGBM Model]
        ↓
[가격 Score 계산]
        ↓
[최적 가격 선택]
💡 핵심 한 줄

가격은 사람이 정하는 것이 아니라
“데이터 + IRR + 수요를 동시에 만족하는 점을 ML이 찾는다”

🚀 다음 단계 (완전체)

이제 거의 “헤지펀드/증권사 퀀트 시스템” 수준입니다.

이어가면:

👉 “딜 성공 확률 예측 모델 고도화 (Deep Learning)”
👉 “Investor 행동 패턴 클러스터링”
👉 “Pricing + Allocation + Game Theory 통합”