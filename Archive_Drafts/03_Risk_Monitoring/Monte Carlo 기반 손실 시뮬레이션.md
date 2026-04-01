리스크 관리의 핵심인
👉 Expected Loss (EL, 기대손실) 모델을 실무 기준으로 정리해드릴게요.

📌 1️⃣ EL이란?

👉 미래에 발생할 것으로 “예상되는 평균 손실 금액”

실제 손실이 아니라

👉 확률 기반 기대값

📌 2️⃣ 핵심 공식

𝐸𝐿 = 𝑃𝐷×𝐿𝐺𝐷×𝐸𝐴𝐷

📊 3️⃣ 구성 요소 완전 해석

✔ ① PD (Probability of Default)

👉 부도 확률

차주가 돈 못 갚을 확률

예:
PD = 5% → 100건 중 5건 부도 예상

✔ ② LGD (Loss Given Default)

👉 부도 시 손실률

부도 났을 때 얼마나 못 건지는지
예:
LGD = 40% → 100억 중 40억 손실

✔ ③ EAD (Exposure at Default)

👉 부도 시점의 노출 금액

실제 위험에 노출된 금액
예:
대출잔액 100억

📊 4️⃣ 계산 예시

가정
PD = 5%
LGD = 40%
EAD = 100억
계산

👉
EL = 0.05 × 0.4 × 100억

👉 = 2억

👉 의미:

👉 “평균적으로 2억 손실 예상”

📌 5️⃣ 직관적 이해

👉 이렇게 생각하면 쉽습니다:

부도 날 확률 × 망했을 때 손실 × 노출금액

👉 결국:

👉 “확률 × 손실 크기”

📌 6️⃣ PF에서 EL 해석

PF는 일반 기업보다 다르게 봅니다:

✔ PD 영향 요소

분양률
공정률
시장 상황

✔ LGD 영향 요소

LTV (담보 가치)
회수율
경매/청산 가치

✔ EAD

대출잔액
약정 한도 (LOC 포함)
📊 7️⃣ 트랜치별 EL (핵심🔥)

👉 동일 Deal이라도 EL 다름

구조
Senior 70억
Mezz 20억
Equity 10억

👉 손실 흡수 순서 때문에:

트랜치	PD	LGD	EL
Senior	낮음	낮음	낮음
Mezz	중간	중간	중간
Equity	높음	높음	매우 높음

👉 이유:

👉 후순위가 먼저 죽기 때문

📌 8️⃣ 실무 활용

✔ 1. 리스크 등급 산정

EL 기반 Rating

✔ 2. 충당금 설정

IFRS9 핵심

✔ 3. 가격 결정

금리/수익률 반영

📌 9️⃣ 시스템 설계

✔ 테이블 예시

risk_metrics

- deal_id
- pd
- lgd
- ead
- expected_loss
- base_date


✔ SQL 계산

SELECT
    deal_id,
    pd * lgd * ead AS expected_loss
FROM risk_metrics;

📌 🔟 고급 개념 (실무 중요)

✔ EL vs UL

구분	의미
EL	예상 손실
UL (Unexpected Loss)	예측 불가능 손실

👉 은행은:

EL → 충당금
UL → 자기자본으로 대응

📌 11️⃣ 한 줄 정리

👉

EL = “평균적으로 잃을 것으로 예상되는 금액”

🚀 핵심 한마디

👉
리스크 관리 = 결국 EL을 얼마나 정확하게 예측하느냐

원하면 다음 단계도 이어서 설명해드릴게요:

👉 PD / LGD 산정 방법 (실무)
👉 PF 리스크 스코어링 모델
👉 Monte Carlo 기반 손실 시뮬레이션