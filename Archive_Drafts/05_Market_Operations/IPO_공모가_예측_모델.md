# IPO 공모가 예측 모델 (LightGBM + Feature Engineering)

## 1. 개요

본 문서는 IPO 공모가 산정을 위한 **LightGBM 기반 머신러닝 모델**을 구현하기 위한 전체 파이프라인을 설명한다.

핵심 목적:

* 공모가 적정성 판단
* 상장 후 수익률 예측
* 데이터 기반 가격 추천

---

## 2. 데이터 스키마 (입력 데이터)

```text
deal_id
fair_value_low
fair_value_high
demand_ratio
high_price_support_ratio
institution_ratio
foreign_ratio
hhi_index
market_return_30d
volatility
sentiment_score
roe
revenue_growth
debt_ratio
final_price
return_1d
```

---

## 3. Feature Engineering

### 3.1 전체 코드

```python
import pandas as pd
import numpy as np

def feature_engineering(df):
    df = df.copy()

    # 1. Valuation 기반 Feature
    df["fair_value_mid"] = (df["fair_value_low"] + df["fair_value_high"]) / 2
    df["price_band_width"] = df["fair_value_high"] - df["fair_value_low"]

    # 2. 수요예측 Feature
    df["log_demand_ratio"] = np.log1p(df["demand_ratio"])
    df["demand_pressure"] = df["demand_ratio"] * df["high_price_support_ratio"]

    # 3. 투자자 구조 Feature
    df["inst_foreign_ratio"] = df["institution_ratio"] + df["foreign_ratio"]
    df["investor_quality"] = (
        df["institution_ratio"] * 0.6 +
        df["foreign_ratio"] * 0.4
    )

    # 4. 주문 집중도
    df["order_concentration_risk"] = np.sqrt(df["hhi_index"])

    # 5. 시장 Feature
    df["market_momentum"] = df["market_return_30d"]
    df["market_risk"] = df["volatility"]

    # 6. 기업 펀더멘털
    df["growth_quality"] = df["revenue_growth"] * df["roe"]
    df["financial_risk"] = df["debt_ratio"]

    # 7. 종합 지표 (핵심)
    df["ipo_heat_score"] = (
        df["log_demand_ratio"] *
        df["high_price_support_ratio"] *
        df["investor_quality"]
    )

    return df
```

---

## 4. 모델 학습 코드

```python
import lightgbm as lgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

# 데이터 로드
df = pd.read_csv("ipo_dataset.csv")

# Feature Engineering 적용
df = feature_engineering(df)

# Feature / Target 정의
features = [
    "fair_value_mid",
    "price_band_width",
    "log_demand_ratio",
    "demand_pressure",
    "inst_foreign_ratio",
    "investor_quality",
    "order_concentration_risk",
    "market_momentum",
    "market_risk",
    "sentiment_score",
    "growth_quality",
    "financial_risk",
    "ipo_heat_score"
]

target = "return_1d"

X = df[features]
y = df[target]

# Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Dataset 구성
train_data = lgb.Dataset(X_train, label=y_train)
test_data = lgb.Dataset(X_test, label=y_test)

# 파라미터 설정
params = {
    "objective": "regression",
    "metric": "rmse",
    "boosting_type": "gbdt",
    "learning_rate": 0.05,
    "num_leaves": 31,
    "feature_fraction": 0.8,
    "bagging_fraction": 0.8,
    "bagging_freq": 5,
    "seed": 42
}

# 학습
model = lgb.train(
    params,
    train_data,
    valid_sets=[train_data, test_data],
    num_boost_round=1000,
    callbacks=[
        lgb.early_stopping(50),
        lgb.log_evaluation(100)
    ]
)

# 평가
y_pred = model.predict(X_test)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))

print(f"RMSE: {rmse:.4f}")
```

---

## 5. 공모가 추천 함수

```python
def recommend_price(df_row, model, features):
    row = feature_engineering(pd.DataFrame([df_row]))
    X_input = row[features]

    predicted_return = model.predict(X_input)[0]

    base_price = df_row["fair_value_mid"]

    recommended_price = base_price * (1 + predicted_return)

    return recommended_price
```

---

## 6. 핵심 Feature 해설

### 6.1 ipo_heat_score (핵심 지표)

```
수요 × 고가 지지율 × 기관 비중
```

→ 공모가 상승 압력의 핵심 신호

---

### 6.2 demand_pressure

```
경쟁률 × 고가 주문 비율
```

→ 실제 가격 지지 강도

---

### 6.3 investor_quality

```
기관 + 외국인 비중
```

→ 수요의 신뢰도

---

### 6.4 order_concentration_risk

```
HHI 기반 투자자 집중도
```

→ 특정 투자자 쏠림 리스크

---

## 7. 고도화 전략

### 7.1 분류 모델 추가

```python
df["success"] = (df["return_1d"] > 0).astype(int)
```

→ IPO 흥행 여부 예측

---

### 7.2 멀티 모델 구조

```
Model 1: 수익률 예측
Model 2: 실패 확률
Model 3: 공모가 추천
```

---

### 7.3 SHAP 적용

```python
import shap

explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)

shap.summary_plot(shap_values, X_test)
```

→ 모델 해석 가능성 확보

---

## 8. 핵심 인사이트

* 공모가는 정적 값이 아니라 확률적 결과
* 수요예측 데이터가 가장 강력한 변수
* 기관/외국인 비중이 가격 결정에 결정적 영향

---

## 9. 한 줄 요약

이 모델은
**Valuation + 수요 + 투자자 행동을 수치화하여 공모가를 계산하는 실전 ML 엔진이다.**
