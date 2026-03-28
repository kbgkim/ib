# PF 부도 예측 모델 (LightGBM 기반) – 실무형 코드 설계

---

# 1. 개요

## 목적
PF(Project Finance) 프로젝트의 부도(Default) 가능성을 예측하여  
👉 **리스크 스코어링 / 투자 의사결정 자동화**

---

## 문제 정의

- Input: PF 프로젝트 Feature
- Output: Default Probability (부도 확률)


X (Features) → LightGBM → P(Default)


---

# 2. 데이터 구조

## Target (Label)

| 변수 | 설명 |
|------|------|
| default_flag | 1 = 부도 / 0 = 정상 |

---

## Feature 구성

### ① 재무 지표

- dscr_min
- dscr_avg
- ltv
- ltc
- irr

---

### ② 사업 지표

- sales_rate (분양률)
- sales_velocity (분양 속도)
- progress_rate (공정률)
- cost_overrun_ratio

---

### ③ 시장 변수

- interest_rate
- housing_price_index_change
- region_risk_score

---

# 3. 데이터 예시


project_id, dscr_min, ltv, sales_rate, progress_rate, interest_rate, default_flag
P001, 1.2, 0.65, 0.75, 0.80, 0.05, 0
P002, 0.9, 0.80, 0.40, 0.60, 0.06, 1


---

# 4. Python 코드 (LightGBM)

## 설치


pip install lightgbm pandas scikit-learn


---

## 학습 코드

```python
import pandas as pd
import lightgbm as lgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score

# 1. 데이터 로드
df = pd.read_csv("pf_data.csv")

# 2. Feature / Label 분리
X = df.drop(columns=["project_id", "default_flag"])
y = df["default_flag"]

# 3. Train / Test 분리
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 4. LightGBM Dataset
train_data = lgb.Dataset(X_train, label=y_train)
test_data = lgb.Dataset(X_test, label=y_test)

# 5. 파라미터 설정
params = {
    "objective": "binary",
    "metric": "auc",
    "boosting_type": "gbdt",
    "learning_rate": 0.05,
    "num_leaves": 31,
    "max_depth": -1,
    "feature_fraction": 0.8,
    "bagging_fraction": 0.8,
    "bagging_freq": 5,
    "verbosity": -1
}

# 6. 모델 학습
model = lgb.train(
    params,
    train_data,
    valid_sets=[train_data, test_data],
    num_boost_round=1000,
    early_stopping_rounds=50
)

# 7. 예측
y_pred = model.predict(X_test)

# 8. 성능 평가
auc = roc_auc_score(y_test, y_pred)
print("AUC:", auc)
5. Feature Engineering (핵심)
DSCR 관련
df["dscr_buffer"] = df["dscr_min"] - 1.0
df["dscr_stability"] = df["dscr_avg"] / df["dscr_min"]
분양 속도
df["sales_velocity"] = df["sales_rate"] / df["progress_rate"]
금리 민감도
df["interest_stress"] = df["dscr_min"] - (df["interest_rate"] * 0.5)
6. Feature 중요도 확인
import matplotlib.pyplot as plt

lgb.plot_importance(model, max_num_features=10)
plt.show()
7. SHAP 해석 (실무 필수)
import shap

explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)

shap.summary_plot(shap_values, X_test)
8. 운영 적용 구조
API 구조
POST /pf/predict
Request
{
  "dscr_min": 1.1,
  "ltv": 0.7,
  "sales_rate": 0.6
}
Response
{
  "default_probability": 0.23,
  "risk_grade": "BBB"
}
9. Risk Mapping
def map_risk(prob):
    if prob < 0.1:
        return "AAA"
    elif prob < 0.2:
        return "AA"
    elif prob < 0.3:
        return "A"
    elif prob < 0.4:
        return "BBB"
    else:
        return "High Risk"
10. 실무 팁
① 데이터가 핵심

👉 모델보다 데이터 품질이 더 중요

② Feature가 승부

👉 특히 중요:

dscr_min
sales_rate
ltv
③ 해석 가능성 확보

👉 금융에서는 “왜 그런지” 설명 필요

→ SHAP 필수

11. 확장 방향
시계열 모델 (분양 추이 반영)
Macro 변수 강화
Ensemble (LightGBM + Logistic)
12. 한 줄 정리

👉 이 모델은
“PF 프로젝트의 부도 확률을 예측하는 머신러닝 엔진”


---

여기까지 오면 이미 **금융 + 데이터 + AI + 시스템 설계**가 결합된 수준입니다.

원하면 다음 단계:

- 👉 **Spring Boot + LightGBM 연동 (실제 API 서버)**
- 👉 **Oracle 9i 기반 데이터 파이프라인**
- 👉 **실시간 PF 리스크 모니터링 시스템**

까지 이어서 **현업 시스템 수준**으로 만들어 드리겠습니다.