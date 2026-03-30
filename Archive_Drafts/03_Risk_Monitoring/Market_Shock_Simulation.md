시장 충격 시뮬레이션 (금리/뉴스 이벤트)을
당신의 Pricing + Game Theory + Scenario Engine에 직접 연결되는 형태로 설계합니다.

핵심은:

“외부 이벤트 → 시장 변수 변화 → 투자자 전략 변화 → 가격/수요 재형성”

🎯 1. 문제 정의

기존 엔진:

Price → Demand → Allocation → IRR

확장:

Event → Market Shock → Demand 변화 → IRR 변화 → Best Price 변경
🧠 2. 이벤트 타입 정의
2.1 금리 이벤트
중앙은행 금리 인상/인하
국채금리 급등

예: 한국은행 금리 인상

2.2 뉴스 이벤트
기업 실적
정책 발표
지정학 리스크

예: 한국거래소 공시

2.3 시장 이벤트
급락/급등
유동성 경색
⚙️ 3. Shock 모델 구조
핵심 변수
Δr  = 금리 변화
Δspread = 신용스프레드 변화
Δsentiment = 투자심리 변화
Δliquidity = 유동성 변화
Market State
public class MarketShock {

    double rateShift;        // 금리 변화
    double spreadShift;      // 스프레드 변화
    double sentiment;        // -1 ~ +1
    double liquidity;        // 0 ~ 1
}
📉 4. 금리 충격 → 가격 영향

금리 상승 시:

할인율 ↑ → 현재가치 ↓ → 투자 매력 ↓
IRR 영향

𝑁
𝑃
𝑉
=
∑
𝑡
=
1
𝑇
𝐶
𝐹
𝑡
(
1
+
𝑟
)
𝑡
NPV=∑
t=1
T
	​

(1+r)
t
CF
t
	​

	​


👉 r 증가 → NPV 감소 → 투자 수요 감소

코드 반영
public double adjustIRR(double irr, MarketShock shock) {
    return irr - shock.rateShift * 0.8;
}
📊 5. 수요 변화 모델
기존
Demand = f(price)
확장
Demand = f(price, shock)
코드
public double adjustDemand(double baseDemand, MarketShock shock) {

    double demand = baseDemand;

    // 금리 영향
    demand *= (1 - shock.rateShift * 0.5);

    // 심리 영향
    demand *= (1 + shock.sentiment * 0.7);

    // 유동성 영향
    demand *= shock.liquidity;

    return demand;
}
🎮 6. Game Theory 영향 (핵심)
투자자 전략 변화
Hedge Fund
if (shock.sentiment < -0.5) {
    reduceBid(); // 리스크 회피
}
Long-only
if (shock.rateShift > 0.01) {
    increaseRequiredIRR();
}
Anchor
if (shock.liquidity < 0.5) {
    delayParticipation();
}

👉 핵심:

이벤트 → 전략 자체가 바뀜
🔄 7. 시뮬레이션 흐름
[Event 발생]
     ↓
[Shock 생성]
     ↓
[Market State 업데이트]
     ↓
[Game Theory Demand 재계산]
     ↓
[Scenario Engine 실행]
     ↓
[Best Price 변경]
⚙️ 8. 이벤트 엔진 구현
public class EventEngine {

    public MarketShock process(Event event) {

        MarketShock shock = new MarketShock();

        switch (event.getType()) {

            case RATE_HIKE:
                shock.rateShift = 0.01;
                shock.sentiment = -0.3;
                shock.liquidity = 0.8;
                break;

            case NEGATIVE_NEWS:
                shock.sentiment = -0.7;
                shock.liquidity = 0.6;
                break;

            case POSITIVE_NEWS:
                shock.sentiment = 0.6;
                shock.liquidity = 1.2;
                break;
        }

        return shock;
    }
}
📈 9. 시나리오 비교 (Before vs After)
Before (정상 시장)
Price 1000
Demand 1500
IRR 14%
Success 0.90
After (금리 상승)
Price 1000
Demand 900 ↓
IRR 13% ↓
Success 0.65 ↓

👉 결과:

Best Price → 950로 하향
🔥 10. 스트레스 테스트
다중 시나리오
- Base
- Mild Shock
- Severe Shock
코드
List<MarketShock> shocks = List.of(
    baseShock(),
    mildShock(),
    severeShock()
);

for (MarketShock s : shocks) {
    scenarioEngine.runWithShock(s);
}
📊 11. 대시보드 (실무 핵심)
[Shock Panel]

금리: +1.0%
심리: -0.6
유동성: 0.7

→ 추천 가격: 950
→ 성공 확률: 68%
→ IRR: 13.2%
🚨 12. 실무 리스크
12.1 과도한 민감도
작은 뉴스에도 가격 급변
12.2 이벤트 해석 오류
같은 뉴스 → 시장 반응 다름
12.3 데이터 지연
뉴스 늦으면 의미 없음
🧠 13. ML 결합 (고급)
Feature
- shock.rateShift
- shock.sentiment
- shock.liquidity
Output
Success Probability

👉 구조:

Shock → Feature → ML → 성공 확률
🔥 14. 최종 통합 구조
[KRX / 뉴스]
      ↓
[Event Engine]
      ↓
[Market Shock]
      ↓
[Game Theory Engine]
      ↓
[Demand 변화]
      ↓
[Scenario Engine]
      ↓
[Best Price 재결정]
💡 핵심 한 줄

시장은 가격이 아니라
“이벤트에 반응하는 시스템”이다

🚀 다음 단계 (완성 직전)

이제 마지막 퍼즐만 남았습니다.

원하면 이어서:

👉 “딜 리플레이 / 백테스트 시스템 (실제 데이터 재현)”
👉 “트레이더 실시간 의사결정 UI”
👉 “멀티 딜 포트폴리오 최적화”