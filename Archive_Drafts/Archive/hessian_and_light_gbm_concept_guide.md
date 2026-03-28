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

(끝)
