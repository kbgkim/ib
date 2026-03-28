# LightGBM Gradient와 Δ(델타) 연결 이해

---

# 🎯 핵심 목표

> **Gradient는 Δ(변화량) 개념을 Loss 공간으로 확장한 것으로, 방향과 크기를 포함해 오차를 보정하는 기준**

---

# 1️⃣ Δ(델타) 개념

- Δ는 “변화량”을 의미
- 수학 예시: \(\Delta y = y_{new} - y_{old}\)
- 물리학 예시: 위치 변화로 속도 계산 \(v = \Delta x / \Delta t\)

즉, **얼마나 바뀌었는가**를 나타냄

---

# 2️⃣ Gradient = Δ의 확장

- Gradient는 다변수 함수에서의 Δ 확장판
- 한 변수 함수: \(g = \frac{\partial L}{\partial \hat{y}}\)
- 단순 Δ → 함수(Loss)에 적용 → 방향 + 크기 포함

---

# 3️⃣ LightGBM에서 Gradient 의미

- 예측값 \(\hat{y}_i\)와 실제값 \(y_i\) 차이 = **오차 Δ**
\(\Delta_i = \hat{y}_i - y_i\)
- Gradient \(g_i = \frac{\partial l(y_i, \hat{y}_i)}{\partial \hat{y}_i}\)
- 즉 Gradient = **Δ를 Loss 기준으로 확장한 것**

---

# 4️⃣ 직관적 비교

| 개념 | 의미 |
|------|------|
| Δy = y_new - y_old | 예측값과 실제값 차이 (단순 오차) |
| Gradient g = ∂L/∂ŷ | Loss 기준으로 얼마나 틀렸는지 + 방향 |
| Hessian h = ∂²L/∂ŷ² | 얼마나 확실하게 수정할지 (안정성) |

> Δ = 단순 변화량, Gradient = Loss 공간에서의 변화량 (방향 + 크기 포함)

---

# 5️⃣ 그림으로 이해

```
Loss (y축)
↑
|         *
|        *   ← 현재 예측, Loss 높음
|       *
|      *
|     *
|    * ← 실제값 근처로 이동해야 함
|   *
|__*______________ x=prediction
```
- Gradient 방향 = Loss를 줄이는 방향
- Gradient 크기 = 얼마나 빨리 이동해야 하는지

---

# 6️⃣ 요약

- Gradient는 Δ 개념을 Loss 공간으로 확장한 것
- Gradient = “어디로 고칠지 + 얼마나 고칠지”
- Hessian = “수정 안정성/강도 조절”
- LightGBM은 Gradient와 Hessian을 활용해 트리를 반복 학습하며