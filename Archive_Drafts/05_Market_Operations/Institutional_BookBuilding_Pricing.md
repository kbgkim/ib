“증권사 실제 수준”의 Book Building + 실시간 Pricing 엔진을 설계합니다.
(→ 지금까지 만든 모든 요소를 하나로 통합)

🎯 목표

투자자 주문(Order)을 기반으로 실시간 수요곡선을 만들고
가격(VWAP + Cut-off)을 동적으로 결정하는 엔진

🧠 1. Book Building 개념 (실무 관점)
1.1 정의
투자자들이 제출한 주문을 모아
→ 수요곡선(Order Book) 생성
→ 최종 발행 가격 결정
1.2 입력 데이터 (핵심)
Order:
    - investorId
    - rate (요구 금리)
    - amount (신청 금액)
    - tranche (Senior/Mezz)
📊 2. Order Book 구조
2.1 구조
Rate (금리) | Amount | Cumulative Amount
----------------------------------------
5.0%       | 100    | 100
5.2%       | 200    | 300
5.5%       | 300    | 600
6.0%       | 500    | 1100  ← Deal Size 초과
2.2 핵심 포인트
누적 수요가 Deal Size 넘는 지점 = Cut-off Rate
⚙️ 3. 알고리즘 흐름
[1] Order 수집
      ↓
[2] 금리 기준 정렬
      ↓
[3] 누적 수요 계산
      ↓
[4] Deal Size 충족 지점 탐색
      ↓
[5] Cut-off Rate 결정
      ↓
[6] VWAP 계산
      ↓
[7] Allocation 배분
💻 4. Java 구현 (핵심)
4.1 Order 모델
public class Order {

    private Long investorId;
    private double rate;
    private double amount;
}
4.2 Book Building 엔진
@Service
public class BookBuildingEngine {

    public PricingResult build(List<Order> orders, double dealSize) {

        // 1. 금리 오름차순 정렬
        orders.sort(Comparator.comparingDouble(Order::getRate));

        double cumulative = 0;
        double cutOffRate = 0;

        double numerator = 0;
        double denominator = 0;

        for (Order o : orders) {

            cumulative += o.getAmount();

            numerator += o.getRate() * o.getAmount();
            denominator += o.getAmount();

            if (cumulative >= dealSize) {
                cutOffRate = o.getRate();
                break;
            }
        }

        double vwap = numerator / denominator;

        return new PricingResult(cutOffRate, vwap);
    }
}
📈 5. Allocation 엔진 (핵심 디테일)
5.1 기본 원칙
- Cut-off 이하 금리는 전량 배정
- Cut-off 구간은 비례 배정 (pro-rata)
5.2 구현
public class AllocationEngine {

    public Map<Long, Double> allocate(
            List<Order> orders,
            double dealSize,
            double cutOffRate) {

        Map<Long, Double> result = new HashMap<>();

        double allocated = 0;

        // 1. Full Allocation
        for (Order o : orders) {

            if (o.getRate() < cutOffRate) {
                result.put(o.getInvestorId(), o.getAmount());
                allocated += o.getAmount();
            }
        }

        // 2. Pro-rata
        double remaining = dealSize - allocated;

        List<Order> cutOrders = orders.stream()
            .filter(o -> o.getRate() == cutOffRate)
            .toList();

        double totalCut = cutOrders.stream()
            .mapToDouble(Order::getAmount)
            .sum();

        for (Order o : cutOrders) {
            double alloc = (o.getAmount() / totalCut) * remaining;
            result.put(o.getInvestorId(), alloc);
        }

        return result;
    }
}
🔁 6. 실시간 Pricing 구조 (핵심 진화)
6.1 기존 (Batch)
한 번 계산 → 끝
6.2 실시간 구조
Order 입력 →
    Order Book 업데이트 →
        가격 재계산 →
            UI 반영
🧩 7. Spring 기반 실시간 구조
7.1 아키텍처
[Controller]
    ↓
[Order Service]
    ↓
[In-Memory Order Book]
    ↓
[Pricing Engine]
    ↓
[WebSocket Push]
7.2 Order 처리
@Service
public class OrderService {

    private final List<Order> orderBook = new ArrayList<>();

    public synchronized void addOrder(Order order) {
        orderBook.add(order);
    }

    public List<Order> getOrders() {
        return orderBook;
    }
}
7.3 실시간 Pricing
@Service
public class RealTimePricingService {

    private final BookBuildingEngine engine;

    public PricingResult calculate(List<Order> orders) {
        return engine.build(orders, 1000);
    }
}
📡 8. WebSocket (UI 연동)
@SendTo("/topic/pricing")
public PricingResult broadcast() {

    List<Order> orders = orderService.getOrders();

    return pricingService.calculate(orders);
}
🧬 9. ML + Book Building 결합
9.1 문제
모든 투자자가 주문을 넣지 않음
9.2 해결
ML로 "가상 주문" 생성
9.3 구조
Real Orders + ML Synthetic Orders → Full Order Book
📊 10. 최종 통합 구조
[Investor ML Model]
        ↓
[Synthetic Orders 생성]
        ↓
[Real Orders 수집]
        ↓
[Order Book 통합]
        ↓
[Book Building Engine]
        ↓
    Cut-off Rate
    VWAP
        ↓
[Allocation Engine]
        ↓
[Waterfall → IRR]
🚨 11. 실무 핵심 포인트
❗ 1. Cut-off가 진짜 가격
VWAP은 참고값
❗ 2. Anchor Investor 영향
초기 주문이 가격 결정
❗ 3. Order 품질 중요
Fake demand 제거 필요
🚀 12. 한 줄 결론

Book Building은 “수요를 모아서 가격을 만드는 과정”이 아니라
**“시장 참여자의 의사결정을 실시간으로 반영하는 시스템”**이다.

🔥 이제 완성

지금까지 만든 것:

✅ Waterfall Engine
✅ Tranche Optimizer
✅ Pricing + Allocation (Game Theory)
✅ VWAP + Demand Curve
✅ Book Building (실시간)

👉 이건 이미 증권사 IB 시스템 풀스택 수준입니다.

👉 마지막 확장 (원하면)

이제 진짜 끝판:

1️⃣ IB Trader Dashboard (React + 실시간)
2️⃣ Deal 시뮬레이터 UI