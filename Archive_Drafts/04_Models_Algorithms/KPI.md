이제 Monte Carlo 결과를 “의사결정 지표”로 바꾸는 핵심
👉 VaR / CVaR 계산 방법을 실무 기준으로 정리해드릴게요.

📌 1️⃣ 개념 먼저

✔ VaR (Value at Risk)

👉 “이 수준까지는 손실이 발생할 수 있다”는 경계값

확률 기준 (보통 95%, 99%)

✔ CVaR (Conditional VaR)

👉 VaR를 넘어간 ‘최악 구간의 평균 손실’

👉 한 줄 비교:

VaR = “여기까지는 갈 수 있음”
CVaR = “그걸 넘으면 평균적으로 이 정도로 망함”

📊 2️⃣ 직관적 그림

손실 분포 →
|----|----|----|----|----|----|
                ↑
             VaR(95%)

                 → 오른쪽 꼬리 = CVaR 영역
📌 3️⃣ VaR 계산 방법

✔ 방법 1: 정렬 기반 (가장 실무적🔥)

단계
손실 데이터 수집 (Monte Carlo 결과)
오름차순 정렬
백분위수 위치 선택

✔ 공식 개념

VaR(95%) = 상위 5% 경계값

✔ 예시

시뮬레이션 결과 (10,000개):

95% → 9,500번째 값

👉 그 값이 VaR

📊 4️⃣ CVaR 계산 방법

✔ 정의

👉 VaR 초과 구간 평균

✔ 공식 개념

CVaR = 평균(손실 > VaR)

✔ 예시

VaR = 40억
그 이상 손실 데이터 평균 = 60억

👉 CVaR = 60억

📊 5️⃣ 숫자로 이해

손실 시나리오
손실	확률
0억	50%
10억	30%
30억	10%
50억	7%
80억	3%

✔ VaR (95%)

👉 상위 5% 구간 시작 = 약 50억

👉 VaR ≈ 50억

✔ CVaR

👉 50억 이상 평균

👉 (50×7% + 80×3%) / 10%

👉 ≈ 59억

📌 6️⃣ SQL로 계산 (핵심🔥)

✔ VaR (PostgreSQL 기준)

SELECT
    percentile_cont(0.95) WITHIN GROUP (ORDER BY loss_amount) AS var_95
FROM simulation_result;

✔ CVaR

WITH var_calc AS (
    SELECT percentile_cont(0.95) 
    WITHIN GROUP (ORDER BY loss_amount) AS var_95
    FROM simulation_result
)
SELECT AVG(loss_amount) AS cvar_95
FROM simulation_result, var_calc
WHERE loss_amount >= var_95;

📌 7️⃣ Python 코드

import numpy as np

losses = np.array(results)

var_95 = np.percentile(losses, 95)
cvar_95 = losses[losses >= var_95].mean()

📌 8️⃣ PF에서 해석

✔ VaR

👉 “이 정도까지는 손실 가능”

리스크 한도 설정

✔ CVaR

👉 “진짜 망하면 얼마나 망하나”

스트레스 상황 판단

📊 9️⃣ 트랜치별 해석 🔥

트랜치	VaR	CVaR
Senior	낮음	낮음
Mezz	중간	높음
Equity	높음	매우 높음

👉 Equity는 Tail Risk 집중

📌 🔟 실무 핵심 포인트

✔ VaR 한계

VaR 이후는 무시함 ❌

✔ 그래서 CVaR 필요

👉 Tail Risk 반영

📌 11️⃣ EL / VaR / CVaR 비교

지표	의미
EL	평균 손실
VaR	경계 손실
CVaR	최악 평균

📌 12️⃣ 한 줄 정리

👉

VaR = 손실 경계선
CVaR = 그 이후 평균 손실

🚀 핵심 한마디

👉

“VaR는 어디까지 떨어지는지,
CVaR는 떨어진 다음 얼마나 더 아픈지 보여준다”

원하면 다음 단계도 이어서 가능합니다:

👉 PF 리스크 대시보드 설계 (실무 화면)
👉 Stress Test 시나리오 설계
👉 Basel 규제 기준 (은행 관점)