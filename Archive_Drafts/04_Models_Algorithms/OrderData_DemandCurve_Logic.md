“실제 주문 데이터 → 수요곡선(Demand Curve) 생성”을 실무 수준 코드로 구현합니다.
(단순 집계가 아니라 정제 → 가중치 → 누적수요 → 곡선화 → ML 연결까지 포함)

🎯 1. 문제 정의 (현실적인 형태)
입력 (Order Book)
Investor | Price | Quantity | Type | Time | Confidence
-----------------------------------------------------
A        | 1000  | 100      | Anchor | 09:01 | 0.9
B        | 980   | 200      | Hedge  | 09:02 | 0.6
C        | 950   | 500      | Retail | 09:03 | 0.7
출력 (수요곡선)
D(p) = price 이상에서의 누적 수요

👉 핵심:

“해당 가격 이상으로 살 의사가 있는 물량의 총합”

🧱 2. 도메인 모델 (Java / Spring)
Order Entity
public class Order {

    private String investorId;
    private double price;
    private double quantity;

    private InvestorType type;   // ANCHOR, HEDGE, RETAIL
    private long timestamp;
    private double confidence;   // ML or Rule 기반

    // getters/setters
}
Investor Type
public enum InvestorType {
    ANCHOR,
    HEDGE,
    RETAIL
}
🧹 3. 데이터 정제 (실무 핵심)
목적
Fake Order 제거
Low-quality 주문 제거
시간 감쇠 반영
구현
public class OrderFilter {

    public boolean isValid(Order order) {

        // 최소 수량 필터
        if (order.getQuantity() < 50) return false;

        // 신뢰도 필터
        if (order.getConfidence() < 0.5) return false;

        return true;
    }
}
⚖️ 4. 투자자별 가중치
이유
Anchor → 거의 확정 수요
Hedge → 변동성 높음
Retail → 중간
구현
public class WeightPolicy {

    public double weight(Order order) {
        switch (order.getType()) {
            case ANCHOR: return 1.5;
            case HEDGE:  return 0.7;
            case RETAIL: return 1.0;
            default: return 1.0;
        }
    }
}
📈 5. 수요곡선 생성 (핵심 로직)
알고리즘
1. 가격 기준 내림차순 정렬
2. 각 가격에서 누적합 계산
3. D(p) 생성
구현
import java.util.*;
import java.util.stream.*;

public class DemandCurveBuilder {

    private final OrderFilter filter = new OrderFilter();
    private final WeightPolicy weightPolicy = new WeightPolicy();

    public NavigableMap<Double, Double> build(List<Order> orders) {

        // 1. 정제 + 가중치 반영
        List<Order> validOrders = orders.stream()
                .filter(filter::isValid)
                .collect(Collectors.toList());

        Map<Double, Double> demandMap = new HashMap<>();

        for (Order o : validOrders) {

            double weightedQty =
                    o.getQuantity()
                    * weightPolicy.weight(o)
                    * timeDecay(o);

            demandMap.merge(o.getPrice(), weightedQty, Double::sum);
        }

        // 2. 가격 기준 내림차순 정렬
        NavigableMap<Double, Double> sorted =
                new TreeMap<>(Comparator.reverseOrder());

        sorted.putAll(demandMap);

        // 3. 누적 수요 계산
        double cumulative = 0;
        NavigableMap<Double, Double> curve =
                new TreeMap<>(Comparator.reverseOrder());

        for (Map.Entry<Double, Double> e : sorted.entrySet()) {
            cumulative += e.getValue();
            curve.put(e.getKey(), cumulative);
        }

        return curve;
    }

    // 시간 감쇠 (최근 주문 가중치 ↑)
    private double timeDecay(Order o) {
        long now = System.currentTimeMillis();
        double minutes = (now - o.getTimestamp()) / 60000.0;

        return Math.exp(-0.05 * minutes);
    }
}
📊 6. 결과 예시
Price | Demand
--------------
1100  | 150
1050  | 350
1000  | 900
950   | 1500

👉 이게 바로 D(p)

🧠 7. 함수 형태로 변환 (Interpolation)
이유
Pricing 엔진은 연속 함수 필요
구현
public class DemandFunction {

    private final NavigableMap<Double, Double> curve;

    public DemandFunction(NavigableMap<Double, Double> curve) {
        this.curve = curve;
    }

    public double getDemand(double price) {

        Map.Entry<Double, Double> floor = curve.floorEntry(price);
        Map.Entry<Double, Double> ceil = curve.ceilingEntry(price);

        if (floor == null) return 0;
        if (ceil == null) return floor.getValue();

        if (floor.getKey().equals(ceil.getKey())) {
            return floor.getValue();
        }

        // 선형 보간
        double p1 = floor.getKey();
        double d1 = floor.getValue();

        double p2 = ceil.getKey();
        double d2 = ceil.getValue();

        return d1 + (price - p1) * (d2 - d1) / (p2 - p1);
    }
}
🤖 8. ML 연결 (LightGBM)
Feature 생성
- price
- cumulative demand
- investor mix ratio
- order velocity
- time
Java → Python 연결 구조
Spring Boot
   ↓
Feature 생성
   ↓
Python (LightGBM)
   ↓
D(p) 보정
예시 (REST 호출)
public double predictDemand(double price) {

    // Python ML 서버 호출
    return restTemplate.postForObject(
        "http://ml-server/predict",
        Map.of("price", price),
        Double.class
    );
}
🔁 9. 실시간 업데이트 구조
Kafka (Order Stream)
        ↓
DemandCurveBuilder
        ↓
Redis 저장
        ↓
Pricing Engine 사용
🚨 10. 실무에서 반드시 넣어야 하는 것
10.1 Fake Order Detection
→ 반복 취소 패턴
→ 비정상 대량 주문
10.2 Iceberg 처리
→ 숨겨진 수요 추정
10.3 Anchor Lock-in
→ Anchor 주문은 일정 비율 고정 반영
🔥 최종 구조
[Order Raw Data]
        ↓
[Filtering + Weighting]
        ↓
[Aggregation]
        ↓
[Cumulative Demand]
        ↓
[Demand Curve D(p)]
        ↓
[Interpolation / ML]
        ↓
[Pricing Engine]
💡 핵심 한 줄

수요곡선은 단순 합이 아니라
“신뢰도 × 투자자 성격 × 시간”이 반영된 확률적 수요 모델”이다

🚀 다음 단계

이제 완전히 실전 단계입니다. 이어서 가능합니다:

👉 “Fake Order 탐지 ML 모델”
👉 “Investor Behavior Clustering (군집화)”
👉 “Pricing + Allocation 통합 시뮬레이터”