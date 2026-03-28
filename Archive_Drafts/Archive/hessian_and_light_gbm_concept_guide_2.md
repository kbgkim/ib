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

(끝)

