PF Waterfall 계산 엔진 (Spring Boot + Java 기준 실전 코드)입니다.
룰 기반 Waterfall + Tranche 분배 + 확장 가능 구조로 설계했습니다.
(Oracle 9i 환경까지 고려 → JPA 의존 최소화, 순수 로직 중심)

📌 핵심 설계 개요
Waterfall = Rule Engine
Tranche = 우선순위 기반 계층
핵심 = “남은 현금 → 순서대로 소진”
📄 전체 코드 (실무형)
package com.ib.pf.engine;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

public class WaterfallEngine {

    public static class CashFlow {
        private BigDecimal amount;

        public CashFlow(BigDecimal amount) {
            this.amount = amount;
        }

        public BigDecimal getAmount() {
            return amount;
        }
    }

    public static class Tranche {
        private String name;
        private int priority;
        private BigDecimal dueAmount;   // 받아야 할 금액
        private BigDecimal paidAmount = BigDecimal.ZERO;

        public Tranche(String name, int priority, BigDecimal dueAmount) {
            this.name = name;
            this.priority = priority;
            this.dueAmount = dueAmount;
        }

        public String getName() { return name; }
        public int getPriority() { return priority; }
        public BigDecimal getDueAmount() { return dueAmount; }
        public BigDecimal getPaidAmount() { return paidAmount; }

        public void addPayment(BigDecimal amount) {
            this.paidAmount = this.paidAmount.add(amount);
        }

        public BigDecimal getRemaining() {
            return dueAmount.subtract(paidAmount);
        }
    }

    public static class Result {
        private List<Tranche> tranches;
        private BigDecimal remainingCash;

        public Result(List<Tranche> tranches, BigDecimal remainingCash) {
            this.tranches = tranches;
            this.remainingCash = remainingCash;
        }

        public List<Tranche> getTranches() { return tranches; }
        public BigDecimal getRemainingCash() { return remainingCash; }
    }

    /**
     * 핵심 Waterfall 실행
     */
    public Result execute(CashFlow cashFlow, List<Tranche> tranches) {

        // 1. 우선순위 정렬
        List<Tranche> sorted = tranches.stream()
                .sorted(Comparator.comparingInt(Tranche::getPriority))
                .collect(Collectors.toList());

        BigDecimal remaining = cashFlow.getAmount();

        // 2. Waterfall 적용
        for (Tranche t : sorted) {

            if (remaining.compareTo(BigDecimal.ZERO) <= 0) {
                break;
            }

            BigDecimal need = t.getRemaining();

            if (need.compareTo(BigDecimal.ZERO) <= 0) {
                continue;
            }

            // 지급 금액 = min(남은 현금, 필요 금액)
            BigDecimal pay = remaining.min(need);

            t.addPayment(pay);
            remaining = remaining.subtract(pay);
        }

        return new Result(sorted, remaining);
    }
}
📌 사용 예제 (실행 코드)
public class WaterfallTest {

    public static void main(String[] args) {

        WaterfallEngine engine = new WaterfallEngine();

        WaterfallEngine.CashFlow cash =
                new WaterfallEngine.CashFlow(new BigDecimal("100"));

        List<WaterfallEngine.Tranche> tranches = List.of(
                new WaterfallEngine.Tranche("Senior", 1, new BigDecimal("60")),
                new WaterfallEngine.Tranche("Mezz", 2, new BigDecimal("30")),
                new WaterfallEngine.Tranche("Equity", 3, new BigDecimal("50"))
        );

        WaterfallEngine.Result result = engine.execute(cash, tranches);

        result.getTranches().forEach(t ->
                System.out.println(t.getName() + " paid: " + t.getPaidAmount())
        );

        System.out.println("Remaining Cash: " + result.getRemainingCash());
    }
}
📌 실행 결과
Senior paid: 60
Mezz paid: 30
Equity paid: 10
Remaining Cash: 0

👉 완벽한 Waterfall 동작

위에서부터 순차 소진
아래 계층은 잔여만 받음
📌 확장 (실무 필수 기능)
1️⃣ Interest / Principal 분리
enum PaymentType {
    INTEREST,
    PRINCIPAL,
    EXPENSE
}

→ Waterfall Rule 테이블과 연결

2️⃣ Rule 기반 구조 (핵심 업그레이드)
class WaterfallRule {
    int priority;
    String targetTranche;
    PaymentType type;
}

👉 코드가 아니라 DB 기반 룰 엔진화

3️⃣ Pro-rata 분배 (동순위)
BigDecimal totalNeed = samePriority.stream()
        .map(Tranche::getRemaining)
        .reduce(BigDecimal.ZERO, BigDecimal::add);

for (Tranche t : samePriority) {
    BigDecimal ratio = t.getRemaining().divide(totalNeed, 10, RoundingMode.HALF_UP);
    BigDecimal pay = remaining.multiply(ratio);
    t.addPayment(pay);
}
4️⃣ DSCR 기반 트리거
if (dscr < 1.2) {
    // Equity 지급 중단
}
5️⃣ 이벤트 기반 처리 (Spring)
@EventListener
public void handleCashFlow(CashFlowEvent event) {
    waterfallEngine.execute(event.getCashFlow(), event.getTranches());
}
📌 실무 아키텍처 연결
CashFlow 생성
 → Waterfall Engine 실행
 → Distribution 저장
 → Risk Engine (DSCR 계산)
 → Monitoring Dashboard
📌 핵심 설계 포인트 (중요)
1️⃣ Waterfall = 상태 머신
입력 → 분배 → 상태 업데이트
2️⃣ 절대 하드코딩 금지
우선순위 = DB Rule
3️⃣ PF 본질
"현금이 들어오면 계약 순서대로 나간다"
📌 한 줄 정리

👉 Waterfall 엔진은 “남은 현금을 우선순위에 따라 순차적으로 소진하는 룰 기반 시스템”이다

🚀 다음 단계 (현실 구현)

원하면 다음으로 바로 이어서:

1️⃣ Spring Boot 실전 구조
Service / Domain / Event 분리
Oracle 9i 대응 DAO 설계
2️⃣ PF + Risk 통합
DSCR 자동 계산
Early Warning 시스템
3️⃣ 시뮬레이션 엔진
“10년 Cash Flow 예측 + Waterfall 결과”

까지 실제 서비스 수준으로 설계해드리겠습니다.