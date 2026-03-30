가격별 시나리오 비교 엔진 (Scenario Comparison Engine)을
지금까지 만든 Demand + PF + IRR + ML + Allocation을 모두 연결한 의사결정 코어로 설계합니다.

핵심 정의:

“여러 가격 후보에 대해 결과(수요·IRR·리스크·배정)를 동시에 시뮬레이션하고 최적안을 선택하는 엔진”

🎯 1. 문제 정의
입력
- Price Grid (후보 가격 리스트)
- Demand Model
- PF Cash Flow Engine
- IRR / DSCR 계산기
- Allocation 엔진
- ML 모델 (성공 확률)
출력
- 가격별 결과 테이블
- 최적 가격 (Best Price)
- 추천 이유 (Explainability)
🧠 2. 시나리오 개념

각 가격 p마다 하나의 시나리오:

Scenario(p) =

Demand(p)
IRR(p)
DSCR(p)
Allocation(p)
Risk(p)
SuccessProb(p)
🧱 3. 결과 모델
public class ScenarioResult {

    double price;

    double demand;
    double oversub;

    double irr;
    double minDscr;

    double successProb;

    double allocatedAnchor;
    double allocatedLongOnly;

    double score;

    // getters/setters
}
⚙️ 4. 시나리오 실행 엔진 (핵심)
public class ScenarioEngine {

    public ScenarioResult run(double price) {

        ScenarioResult r = new ScenarioResult();
        r.setPrice(price);

        // 1. 수요
        double demand = demandModel.predict(price);
        r.setDemand(demand);

        double oversub = demand / supply;
        r.setOversub(oversub);

        // 2. PF → IRR
        List<Double> cf = cashFlowEngine.cashFlowAtPrice(price);
        double irr = irrCalculator.calculate(cf);
        r.setIrr(irr);

        // 3. DSCR
        double dscr = dscrCalculator.minDSCR(cf);
        r.setMinDscr(dscr);

        // 4. Allocation
        AllocationResult alloc =
            allocationEngine.allocate(price);

        r.setAllocatedAnchor(alloc.getAnchor());
        r.setAllocatedLongOnly(alloc.getLongOnly());

        // 5. ML 성공 확률
        PricingFeature f = featureBuilder.build(price);
        double success = ml.predict(f);
        r.setSuccessProb(success);

        // 6. Score 계산
        double score =
                success * 0.4
              + irr * 0.3
              + Math.min(oversub, 2.0) * 0.2
              + dscr * 0.1;

        r.setScore(score);

        return r;
    }
}
📊 5. 전체 가격 비교
public List<ScenarioResult> runAll(List<Double> priceGrid) {

    List<ScenarioResult> results = new ArrayList<>();

    for (double p : priceGrid) {
        results.add(run(p));
    }

    return results;
}
🏆 6. 최적 가격 선택
public ScenarioResult findBest(List<ScenarioResult> results) {

    return results.stream()
        .filter(r -> r.getMinDscr() >= 1.2)
        .filter(r -> r.getOversub() >= 1.0)
        .max(Comparator.comparing(ScenarioResult::getScore))
        .orElse(null);
}
📈 7. 출력 예시 (핵심)
Price | Demand | IRR | DSCR | Success | Score
---------------------------------------------
950   | 2000   | 12% | 1.5  | 0.95    | 0.82
1000  | 1500   | 14% | 1.3  | 0.90    | 0.88  ← BEST
1050  | 900    | 17% | 1.1  | 0.60    | 0.70
🔍 8. Explainability (중요)
왜 이 가격인가?
1000 선택 이유:

- IRR: 목표 만족 (14%)
- Oversub: 1.5x 안정
- DSCR: 1.3 안정권
- Anchor 비율 충분
- ML 성공 확률 높음
코드
public String explain(ScenarioResult r) {

    return String.format(
        "IRR=%.2f, DSCR=%.2f, Oversub=%.2f, Success=%.2f",
        r.getIrr(), r.getMinDscr(),
        r.getOversub(), r.getSuccessProb()
    );
}
🔁 9. 실시간 비교 구조
[Order Stream]
      ↓
[Demand Update]
      ↓
[Scenario Engine 전체 실행]
      ↓
[Best Price 업데이트]
      ↓
[트레이더 화면 반영]
⚡ 10. 성능 최적화 (실무 필수)
10.1 병렬 처리
priceGrid.parallelStream()
    .map(this::run)
    .collect(Collectors.toList());
10.2 캐싱
- 동일 price → 결과 캐시
- CF / IRR 재사용
10.3 Incremental Update
→ 전체 재계산 X
→ 변경된 부분만 업데이트
🚨 11. 실무 리스크
11.1 Score 왜곡
→ 가중치 설정 중요
11.2 모델 충돌
IRR vs Demand vs ML 서로 상충
11.3 과도한 자동화
→ 딜러 override 필요
🔥 12. 최종 구조
[Price Grid]
      ↓
[Scenario Engine]
      ↓
(Demand + PF + IRR + Allocation + ML)
      ↓
[Scenario Table]
      ↓
[Best Price 선택]
💡 핵심 한 줄

가격은 하나가 아니라
“가능한 모든 가격 중 가장 좋은 시나리오를 선택하는 것”이다

🚀 다음 단계 (완전체)

이제 사실상 “IB 딜 의사결정 엔진” 완성입니다.

이어가면:

👉 “딜 리플레이 / 백테스트 시스템”
👉 “트레이더 UI (실시간 시나리오 비교 화면)”
👉 “Game Theory 기반 투자자 전략 반영”