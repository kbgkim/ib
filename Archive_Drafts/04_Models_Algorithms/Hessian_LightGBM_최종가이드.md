# Hessian과 LightGBM 개념 정리

---

## 1. Hessian의 수학적 의미

Hessian은 **2차 미분 값들을 모아놓은 행렬**이다.

- 1차 미분 (Gradient): 변화의 방향
- 2차 미분 (Hessian): 변화의 변화율 (곡률)

### 직관

- Gradient → 어디로 가야 하는가
- Hessian → 얼마나 급하게 휘어져 있는가

---

## 2. 직관적 이해

| 상황 | Gradient | Hessian |
|------|--------|--------|
| 완만한 경사 | 작음 | 작음 |
| 급경사 | 큼 | 다양 |
| 좁은 골짜기 | 방향 존재 | 큼 |

👉 Hessian은 "민감도" 또는 "곡률"을 의미한다.

---

## 3. LightGBM에서의 Hessian 의미

LightGBM에서는 Hessian을 다음과 같이 사용한다:

👉 **손실 함수의 2차 미분값**

즉,

- Gradient = 오차의 방향
- Hessian = 오차의 신뢰도

---

## 4. 핵심 직관

### Gradient

"이 방향으로 가면 좋아질 것 같다"

### Hessian

"그게 얼마나 확실한가"

---

## 5. 데이터별 해석

### Case 1: 신뢰 높은 데이터

- Gradient: 큼
- Hessian: 큼

👉 모델이 강하게 반영

---

### Case 2: 노이즈 데이터

- Gradient: 있음
- Hessian: 작음

👉 영향 축소

---

👉 결론:

**Hessian = 데이터의 신뢰도 / 안정성**

---

## 6. LightGBM 내부 동작

트리 분할 시 평가 기준:

```
좋은 분할 =
Gradient 감소 +
Hessian 안정성 확보
```

---

## 7. 핵심 비교

| 개념 | 의미 | 역할 |
|------|------|------|
| Gradient | 1차 미분 | 방향 |
| Hessian | 2차 미분 | 곡률 / 신뢰도 |

---

## 8. 실무 관점 (신용평가/리스크)

Hessian은 다음과 같이 해석 가능하다:

👉 "이 데이터의 오차가 얼마나 안정적인 패턴인가"

- 안정적 패턴 → Hessian 큼 → 학습 강도 높음
- 불안정 데이터 → Hessian 작음 → 영향 감소

---

## 9. 한 줄 요약

👉 Hessian = 변화의 변화율 (곡률)

👉 LightGBM에서는 = 데이터 신뢰도 판단 기준

---

## 10. 확장 학습 포인트

다음 개념과 연결하면 이해도가 크게 상승함:

- Gradient Boosting 수식 구조
- Gain 계산 공식
- Leaf weight 계산 방식
- XGBoost vs LightGBM 차이

---

## 11. LightGBM 수식 심화 (Gain / Split 공식 해부)

### 11.1 전제: 2차 테일러 근사

LightGBM은 손실함수를 2차 테일러 전개로 근사하여 사용한다.

- \(g_i\): 1차 미분 (Gradient)
- \(h_i\): 2차 미분 (Hessian)

---

### 11.2 Leaf Weight 공식

```
w* = - (Σ g_i) / (Σ h_i + λ)
```

#### 해석

- 분자: 전체 오차의 방향 (Gradient 합)
- 분모: 안정성 + 규제 (Hessian + λ)

#### 직관

- Gradient만 쓰면 과도한 업데이트 발생
- Hessian으로 업데이트 크기를 제어 (신뢰도 기반 보정)

---

### 11.3 Split Gain 공식

```
Gain = 1/2 * [
    (G_L^2 / (H_L + λ))
  + (G_R^2 / (H_R + λ))
  - (G^2 / (H + λ))
] - γ
```

#### 기호 정의

- G_L, G_R: 좌/우 노드 Gradient 합
- H_L, H_R: 좌/우 노드 Hessian 합
- G, H: 부모 노드 값
- λ: L2 규제
- γ: 분할 패널티

---

### 11.4 수식 구조 해부

```
Gain =
(왼쪽 개선 + 오른쪽 개선)
- (분할 전 상태)
- (복잡도 패널티)
```

#### 의미

"이 분할이 실제로 손실을 얼마나 줄이는가"

---

### 11.5 핵심 직관

- Gradient → 오차 감소 방향
- Hessian → 그 방향의 신뢰도
- λ → 과적합 방지
- γ → 불필요한 분할 억제

---

### 11.6 좋은 Split 조건

1. Gradient 감소량이 큼
2. Hessian 충분히 큼 (신뢰성 확보)
3. λ, γ 조건 통과

---

### 11.7 나쁜 Split 패턴

- Gradient 큼 + Hessian 작음
→ 노이즈 가능성 높음
→ Gain 낮음 → 분할 안 함

---

### 11.8 실무 해석 (리스크 모델링 관점)

Gain 공식은 다음과 같이 해석 가능:

"이 분할이 통계적으로 의미 있는 리스크 구분인가"

- Gradient = 리스크 차이
- Hessian = 데이터 신뢰도
- Gain = 분할의 가치

---

### 11.9 파라미터 연결

#### λ (lambda_l2)

- 증가 시:
  - leaf weight 감소
  - 과적합 감소

#### γ (min_split_gain)

- 증가 시:
  - split 감소
  - 트리 단순화

#### min_child_weight

- leaf에 필요한 최소 Hessian

- 작음 → 과적합 위험
- 큼 → 안정성 증가

---

### 11.10 한 줄 정리

- Hessian = 신뢰도
- Gain = 신뢰도로 보정된 손실 감소량

---

## 12. Histogram 알고리즘 (LightGBM 속도 핵심)

### 12.1 개념

연속형 feature를 **binning(구간화)** 하여 계산량을 줄인다.

```
원본 값 → bin index → bin별 (Σg, Σh) 집계
```

### 12.2 동작

1. 각 feature를 k개의 bin으로 분할 (예: 255)
2. 각 bin에 대해 Gradient/Hessian 합 계산
3. 분할 탐색 시 **bin 단위**로 Gain 계산

### 12.3 장점

- 시간복잡도 감소: O(n * features) → O(bins * features)
- 캐시 효율 상승
- 대용량 데이터에 유리

### 12.4 단점

- 정보 손실(미세한 값 차이)
- bin 수 설정 중요

---

## 13. XGBoost vs LightGBM (Gain 관점 비교)

| 항목 | XGBoost | LightGBM |
|------|---------|----------|
| 분할 방식 | level-wise | leaf-wise |
| 데이터 처리 | exact/approx | histogram |
| Gain 수식 | 동일 계열 | 동일 계열 |
| 속도 | 상대적으로 느림 | 매우 빠름 |
| 과적합 | 안정적 | 과적합 위험 (leaf-wise) |

### 13.1 핵심 차이

- XGBoost: 균형 트리 (안정성)
- LightGBM: 한쪽으로 깊게 성장 (성능 극대화)

---

## 14. 코드 레벨 이해 (Python)

### 14.1 Gradient / Hessian 계산 예시 (Logloss)

```python
import numpy as np

# y: 실제값 (0/1), y_pred: 예측값 (logit)
def sigmoid(x):
    return 1 / (1 + np.exp(-x))

p = sigmoid(y_pred)

grad = p - y          # gradient
hess = p * (1 - p)    # hessian
```

---

### 14.2 Leaf Weight 계산

```python
def leaf_weight(grad, hess, lam):
    return - np.sum(grad) / (np.sum(hess) + lam)
```

---

### 14.3 Gain 계산

```python
def gain(G_L, H_L, G_R, H_R, G, H, lam, gamma):
    left = (G_L ** 2) / (H_L + lam)
    right = (G_R ** 2) / (H_R + lam)
    parent = (G ** 2) / (H + lam)
    return 0.5 * (left + right - parent) - gamma
```

---

## 15. 금융/리스크 모델 튜닝 전략

### 15.1 핵심 파라미터

- num_leaves: 모델 복잡도 (리스크 분류 세분화)
- max_depth: 과적합 제한
- min_child_weight: 최소 Hessian → 신뢰도 필터
- lambda_l2: 규제
- min_split_gain: 의미 없는 분할 제거

---

### 15.2 추천 전략

#### 보수적 (금융권 기본)

- min_child_weight ↑
- lambda_l2 ↑
- num_leaves ↓

👉 안정성 중심

---

#### 공격적 (탐지/이상탐지)

- num_leaves ↑
- min_child_weight ↓

👉 미세 패턴 탐지

---

## 16. 최종 통합 요약

- Gradient = 방향
- Hessian = 신뢰도
- Leaf Weight = 업데이트 크기
- Gain = 분할의 통계적 가치

👉 LightGBM = "신뢰도 기반 손실 최소화 엔진"

---

## 17. 실전 Feature 설계 (신용/리스크 모델)

### 17.1 Feature 유형

#### ① 재무 Feature

- 매출 증가율
- 영업이익률
- 부채비율
- 이자보상배율

#### ② 행동 Feature

- 거래 빈도
- 연체 횟수
- 평균 결제 지연일

#### ③ 시계열 파생 Feature

- 최근 3개월 평균
- 전월 대비 변화율
- 변동성 (표준편차)

---

### 17.2 Feature 설계 핵심 원칙

- "변화율"을 반드시 포함
- 절대값 + 상대값 조합
- 시간 축 정보 반영

---

## 18. LightGBM 학습 파이프라인 (실무 구조)

### 18.1 전체 흐름

```
데이터 수집 → Feature 생성 → Dataset 구성 → 학습 → 검증 → 배포
```

---

### 18.2 Python 예제

```python
import lightgbm as lgb

train_data = lgb.Dataset(X_train, label=y_train)
valid_data = lgb.Dataset(X_valid, label=y_valid)

params = {
    "objective": "binary",
    "metric": "auc",
    "num_leaves": 64,
    "learning_rate": 0.05,
    "min_child_weight": 10,
    "lambda_l2": 1.0,
}

model = lgb.train(
    params,
    train_data,
    valid_sets=[valid_data],
    num_boost_round=1000,
    early_stopping_rounds=50
)
```

---

## 19. SHAP 기반 모델 해석

### 19.1 개념

- 각 Feature가 예측에 기여한 정도를 수치화

### 19.2 활용

- 신용평가 설명 가능성 확보
- 규제 대응 (금융권 필수)

---

### 19.3 예제

```python
import shap

explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_valid)
```

---

## 20. 실서비스 아키텍처

### 20.1 구성

```
[데이터 수집]
   ↓
[Feature Store]
   ↓
[Batch 학습]
   ↓
[모델 저장]
   ↓
[API 서버]
   ↓
[실시간 예측]
```

---

### 20.2 구성 요소

- Feature Store: Redis / DB
- Model Serving: REST API (Spring Boot)
- Batch: Airflow / Cron

---

## 21. 금융 서비스 적용 포인트

### 21.1 필수 요구사항

- 설명 가능성 (Explainability)
- 안정성 (Overfitting 방지)
- 데이터 품질 관리

---

### 21.2 운영 전략

- 주기적 재학습 (월/분기)
- Feature drift 모니터링
- 성능 저하 감지

---

## 22. 최종 정리

LightGBM 기반 리스크 모델은 다음 4가지로 구성된다:

1. Feature 설계
2. Gradient/Hessian 기반 학습
3. Gain 기반 분할
4. SHAP 기반 해석

---

## 23. 금융 Feature 30개 설계 (예시)

### 23.1 재무 (10)

1. 매출 증가율
2. 영업이익률
3. 순이익률
4. 부채비율
5. 유동비율
6. 당좌비율
7. 이자보상배율
8. ROA
9. ROE
10. EBITDA 마진

### 23.2 거래/행동 (10)

11. 월 평균 거래금액
12. 거래 빈도
13. 최근 3개월 거래 증가율
14. 연체 횟수
15. 최대 연체일수
16. 평균 결제 지연일
17. 거래처 수 변화율
18. 신규 거래처 비율
19. 거래 집중도 (상위 고객 비중)
20. 환불/취소 비율

### 23.3 시계열/리스크 파생 (10)

21. 매출 변동성(표준편차)
22. 최근 1개월 vs 6개월 변화율
23. 현금흐름 변동성
24. 부채 증가 속도
25. 계절성 지표
26. 이상치 발생 횟수
27. 매출 급감 이벤트 여부
28. 연속 감소 기간
29. 신용 이벤트 발생 여부
30. 리스크 점수 이동 평균

---

## 24. LightGBM + SHAP + API (실전 코드)

### 24.1 모델 저장

```python
model.save_model("model.txt")
```

---

### 24.2 Spring Boot 서빙 구조

#### 의존성

- LightGBM JNI 또는 PMML/ONNX 변환 사용

---

### 24.3 간단한 예측 API 예시

```java
@RestController
@RequestMapping("/predict")
public class PredictController {

    @PostMapping
    public double predict(@RequestBody FeatureRequest req) {
        double[] features = req.toArray();
        return model.predict(features);
    }
}
```

---

## 25. Kafka 기반 실시간 아키텍처

### 25.1 전체 구조

```
[Source System]
   ↓
[Kafka]
   ↓
[Stream Processor]
   ↓
[Feature Store]
   ↓
[Model API]
   ↓
[Result DB]
```

---

### 25.2 토픽 설계

- raw_transaction
- feature_update
- prediction_request
- prediction_result

---

## 26. Batch + Online 통합 구조

### 26.1 Batch

- Feature 생성
- 모델 재학습

### 26.2 Online

- 실시간 Feature 조회
- 즉시 예측

---

## 27. Drift 및 모니터링

### 27.1 데이터 Drift

- 입력 분포 변화 감지

### 27.2 모델 Drift

- AUC / KS 하락 감지

---

## 28. 최종 실무 아키텍처 요약

```
Feature Engineering
   ↓
LightGBM Training
   ↓
Model Registry
   ↓
API Serving
   ↓
Monitoring (Drift + SHAP)
```

---

## 29. Spring Boot + LightGBM 실제 연동 (ONNX 기반)

### 29.1 Python → ONNX 변환

```python
import onnxmltools
from skl2onnx.common.data_types import FloatTensorType

initial_type = [("input", FloatTensorType([None, X_train.shape[1]]))]
onnx_model = onnxmltools.convert_lightgbm(model, initial_types=initial_type)

with open("model.onnx", "wb") as f:
    f.write(onnx_model.SerializeToString())
```

---

### 29.2 Spring Boot ONNX Runtime

```java
OrtEnvironment env = OrtEnvironment.getEnvironment();
OrtSession session = env.createSession("model.onnx");

float[][] input = new float[][]{ featureArray };
OnnxTensor tensor = OnnxTensor.createTensor(env, input);

OrtSession.Result result = session.run(Map.of("input", tensor));
float score = (float) ((float[][]) result.get(0).getValue())[0][0];
```

---

## 30. Feature Store DDL (PostgreSQL 기준)

```sql
CREATE TABLE feature_store (
    entity_id VARCHAR(50),
    feature_name VARCHAR(100),
    feature_value DOUBLE PRECISION,
    feature_time TIMESTAMP,
    PRIMARY KEY (entity_id, feature_name, feature_time)
);
```

---

## 31. Kafka Consumer → Feature 업데이트

```java
@KafkaListener(topics = "raw_transaction")
public void consume(Transaction tx) {
    Feature f = featureService.transform(tx);
    featureRepository.save(f);
}
```

---

## 32. 예측 API + Feature 결합

```java
@PostMapping("/predict")
public double predict(@RequestBody Request req) {
    double[] features = featureService.load(req.getId());
    return model.predict(features);
}
```

---

## 33. SHAP 설명 API

```python
shap_values = explainer.shap_values(X)

# 결과 저장 또는 API 반환
```

---

## 34. 배포 구조

```
[Frontend]
   ↓
[API Gateway]
   ↓
[Spring Boot Model API]
   ↓
[Feature Store / DB]
   ↓
[Kafka]
```

---

## 35. 운영 체크리스트

- 모델 버전 관리
- Feature 정합성 검증
- Drift 모니터링 자동화
- 장애 대비 (Fallback Rule)

---

## 36. 최종 완성 구조 (End-to-End)

```
Kafka → Feature Store → LightGBM Model → ONNX → Spring API → SHAP → Monitoring
```

---

## 37. 한 줄 최종 결론

"LightGBM 기반 금융 AI 시스템은 Gradient/Hessian 수학 위에 Feature, 시스템, 해석 계층이 결합된 구조다"

---

(끝)

