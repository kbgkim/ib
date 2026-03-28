# LightGBM 이해 가이드 (초보 → 수식 연결 버전)

---

# 🎯 핵심 목표

> **“틀린 만큼 보정하고, 너무 과하게 고치지 않도록 조절하는 트리 기반 학습을 수식으로 구현한 모델”**

---

# 1️⃣ 직관적 이해 (초보용)

## 시험 오답노트 비유

```
1. 문제 풀기 (예측)
2. 틀린 문제 확인 (Gradient)
3. 왜 틀렸는지 분석 (Tree)
4. 수정 강도 조절 (Hessian)
5. 반복
```

- Gradient → 틀린 방향과 크기
- Hessian → 수정 강도 조절
- Tree → 패턴 학습

### 예시 (신용평가)

| 실제 | 예측 | Gradient | 의미 |
|------|------|----------|------|
| 1 (부도) | 0.3 | -0.7 | 올려야 함 |
| 0 (정상) | 0.8 | +0.8 | 내려야 함 |

---

# 2️⃣ 수식 이해 (내부 구조)

## 2-1. 최종 예측

\`\`\`
\hat{y}_i = \sum_{k=1}^{K} f_k(x_i)
\`\`\`
- f_k: k번째 트리
- K: 트리 개수

## 2-2. 목적 함수 (Objective)

\`\`\`
L = \sum_i l(y_i, \hat{y}_i) + \sum_k \Omega(f_k)
\`\`\`
- l(y, ŷ): Loss 함수 (예: Binary Log Loss)
- Ω(f_k): 트리 복잡도 패널티

### Regularization
\`\`\`
Ω(f) = γT + 1/2 λ Σ w_j^2
\`\`\`
- T = leaf 수, w_j = leaf weight, γ = 복잡도 패널티, λ = L2 규제

## 2-3. Gradient & Hessian

\`\`\`
g_i = ∂l(y_i, ŷ_i)/∂ŷ_i  # Gradient (틀린 방향과 크기)
h_i = ∂^2l(y_i, ŷ_i)/∂ŷ_i^2  # Hessian (강도 조절)
\`\`\`

- Logistic Loss 기준:
\`\`\`
p_i = 1 / (1 + exp(-ŷ_i))
g_i = p_i - y_i
h_i = p_i * (1 - p_i)
\`\`\`

## 2-4. Leaf weight 계산

\`\`\`
w^* = - Σ g_i / (Σ h_i + λ)
\`\`\`

## 2-5. Split 기준 (Gain)

\`\`\`
Gain = 1/2 [ (Σ g_L)^2 / (Σ h_L + λ) + (Σ g_R)^2 / (Σ h_R + λ) - (Σ g)^2 / (Σ h + λ) ] - γ
\`\`\`
- g_L, g_R: left/right leaf gradient 합
- h_L, h_R: left/right leaf Hessian 합
- γ: 복잡도 패널티

---

# 3️⃣ 학습 흐름 (직관 + 수식 연결)

```
1. 초기 예측 (대충 시작)
2. 틀린 정도 계산 (Gradient)
3. Tree 생성 (패턴 학습)
4. Leaf weight 계산 (Hessian 기반 안정화)
5. 예측 업데이트
6. 반복
```

- Gradient → 방향 + 크기
- Hessian → 수정 강도 조절
- Tree → 조건 기반 패턴 학습

---

# 4️⃣ 금융/신용평가 적용

```
PD 계산 → Gradient로 오차 확인 → Hessian으로 안정화 → Tree 반복 학습
```

- p_i = 부도 확률
- Gradient = 모델 오차 (부도/정상 대비)
- Hessian = 안정성/확신도

---

# 🔥 핵심 요약

- Gradient → 틀린 방향과 크기
- Hessian → 수정 강도 조절
- Tree → 어떻게 고칠지 학습

> **LightGBM == Gradient 기반 오차 보정 + Hessian 안정화 + 트리 반복 학습 시스템