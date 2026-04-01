이제 ABCP 구조의 핵심 리스크를 “숫자로 관리”하는 단계
👉 롤오버 리스크 지표 (Liquidity Risk KPI)를 실무 기준으로 정리해드릴게요.

📌 1️⃣ 왜 KPI가 필요한가?

👉 롤오버 실패는 이렇게 발생합니다:

만기 도래 → 신규 발행 실패 → 상환 불가 → 디폴트 🚨

👉 그래서 핵심은:

👉 “만기 전에 위험을 미리 감지”

📊 2️⃣ 핵심 KPI 6가지 (실무 필수🔥)

① 📅 Refinancing Gap (차환 갭)

✔ 의미

👉 앞으로 갚아야 할 금액 vs 확보된 유동성

✔ 공식

Refinancing Gap = 만기 도래 금액 - 가용 유동성

✔ 해석

값	의미
> 0	위험 🚨
≤ 0	안정

② 💧 Liquidity Coverage Ratio (LCR)

✔ 의미

👉 단기 부채를 감당할 수 있는지

✔ 공식

LCR = 가용 유동성 / 단기 만기 부채

✔ 기준

LCR	의미
≥ 1.0	안전
< 1.0	위험 🚨

③ 🔁 Rollover Success Rate

✔ 의미

👉 ABCP 차환 성공률

✔ 공식

Rollover Rate = 차환 성공 금액 / 만기 금액

✔ 해석

비율	의미
100%	정상
< 100%	경고 🚨

④ 📉 Funding Concentration

✔ 의미

👉 투자자 집중도

✔ 공식

Top 5 투자자 비중

✔ 해석

수준	의미
높음	위험 (이탈 시 충격 큼)
분산	안정

⑤ 📆 Maturity Concentration

✔ 의미

👉 특정 시점에 만기 몰림 정도

✔ 예시

1개월 내 만기 비율

✔ 해석

상태	의미
집중	롤오버 리스크 ↑
분산	안정

⑥ 📈 Market Spread (시장 금리 스프레드)

✔ 의미

👉 시장에서 요구하는 위험 프리미엄

✔ 해석

변화	의미
스프레드 ↑	투자자 회피 → 위험 🚨
안정	정상

📊 3️⃣ KPI 통합 해석 (중요🔥)

👉 단일 지표보다 조합이 중요

✔ 위험 시그널 조합

LCR < 1
AND
Rollover Rate < 100%
AND
Maturity 집중

→ 매우 위험 🚨🚨🚨

📌 4️⃣ 실무 Alert 기준

✔ 예시

만기 30일 전:
- LCR < 1 → 경고

만기 14일 전:
- Rollover 미확정 → 위험

만기 7일 전:
- 투자자 미확보 → 긴급 🚨

📊 5️⃣ 대시보드 설계

✔ 핵심 화면

Deal별:
- LCR
- Rollover Rate
- 만기 일정
- 투자자 분포

✔ 색상 기준

상태	색상
안전	초록
주의	노랑
위험	빨강

📌 6️⃣ SQL 예시

✔ LCR 계산

SELECT
    deal_id,
    available_liquidity / short_term_debt AS lcr
FROM liquidity_status;

✔ 만기 집중도

SELECT
    deal_id,
    SUM(amount) FILTER (WHERE maturity_date <= CURRENT_DATE + INTERVAL '30 days')
    / SUM(amount) AS maturity_ratio
FROM abcp_issue
GROUP BY deal_id;

📌 7️⃣ PF에서 핵심 포인트 🔥

👉 PF는 일반 기업과 다르게:

👉 “현금”보다 “차환 가능성”이 중요

👉 즉:

돈이 없어도 OK (롤오버 가능하면)
돈이 있어도 위험 (롤오버 막히면)

📌 8️⃣ 한 줄 정리

👉
Liquidity KPI = “ABCP를 계속 굴릴 수 있는지”를 측정하는 지표

🚀 핵심 한마디

👉
“PF는 부도나는 게 아니라
유동성이 막히는 순간 멈춘다”

원하면 다음 단계도 이어서 가능합니다:

👉 PF 리스크 통합 대시보드 설계 (실제 화면)
👉 Stress Test 시나리오 설계 (금리/분양 충격)
👉 실무용 위험등급 자동 Alert 시스템 설계