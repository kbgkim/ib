실제 서비스에 바로 넣을 수 있는 수준으로
Spring Boot + Oracle 9i 기준 PF Waterfall + Risk + Simulation 통합 아키텍처를 설계합니다.
(※ Kafka 없이, 레거시 호환 중심 / 점진적 확장 가능)

📦 1. 전체 시스템 구조 (현실형)
# [IB-SYSTEM-01] PF Waterfall + Risk + Simulation 통합 구조

[Batch / Scheduler]
    ↓
CashFlow Generator
    ↓
Waterfall Engine
    ↓
Distribution 저장 (Oracle 9i)
    ↓
Risk Engine (DSCR / Trigger)
    ↓
Alert / Monitoring
    ↓
Simulation Engine (What-if)
🧱 2. Spring Boot 구조 (Layered + Domain 중심)
com.ib.pf
 ├── domain
 │    ├── CashFlow
 │    ├── Tranche
 │    ├── WaterfallRule
 │
 ├── service
 │    ├── WaterfallService
 │    ├── RiskService
 │    ├── SimulationService
 │
 ├── repository (DAO)
 │    ├── CashFlowDao
 │    ├── TrancheDao
 │    ├── DistributionDao
 │
 ├── engine
 │    ├── WaterfallEngine
 │    ├── DscrCalculator
 │
 ├── scheduler
 │    ├── BatchJob
🧩 3. 핵심 Domain 모델
3.1 CashFlow
public class CashFlow {
    private Long projectId;
    private String period;
    private BigDecimal inflow;
}
3.2 Tranche
public class Tranche {
    private Long id;
    private String name;
    private int priority;
    private BigDecimal interestDue;
    private BigDecimal principalDue;
}
3.3 Distribution
public class Distribution {
    private Long trancheId;
    private String period;
    private BigDecimal paidInterest;
    private BigDecimal paidPrincipal;
}
⚙️ 4. WaterfallService (실전 서비스 계층)
@Service
public class WaterfallService {

    private final TrancheDao trancheDao;
    private final DistributionDao distributionDao;

    public void runWaterfall(Long projectId, CashFlow cashFlow) {

        List<Tranche> tranches = trancheDao.findByProject(projectId);

        BigDecimal remaining = cashFlow.getInflow();

        // 우선순위 정렬
        tranches.sort(Comparator.comparingInt(Tranche::getPriority));

        for (Tranche t : tranches) {

            // 1. 이자 지급
            BigDecimal interestPay = remaining.min(t.getInterestDue());
            remaining = remaining.subtract(interestPay);

            // 2. 원금 지급
            BigDecimal principalPay = remaining.min(t.getPrincipalDue());
            remaining = remaining.subtract(principalPay);

            // 저장
            distributionDao.save(
                new Distribution(
                    t.getId(),
                    cashFlow.getPeriod(),
                    interestPay,
                    principalPay
                )
            );

            if (remaining.compareTo(BigDecimal.ZERO) <= 0) break;
        }
    }
}
📊 5. Risk Engine (DSCR + Trigger)
5.1 DSCR 계산
@Component
public class DscrCalculator {

    public BigDecimal calculate(BigDecimal cashFlow, BigDecimal debtService) {

        if (debtService.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }

        return cashFlow.divide(debtService, 4, RoundingMode.HALF_UP);
    }
}
5.2 RiskService
@Service
public class RiskService {

    private final DscrCalculator dscrCalculator;

    public void evaluate(Long projectId, BigDecimal cashFlow, BigDecimal debt) {

        BigDecimal dscr = dscrCalculator.calculate(cashFlow, debt);

        if (dscr.compareTo(new BigDecimal("1.2")) < 0) {
            triggerWarning(projectId, dscr);
        }
    }

    private void triggerWarning(Long projectId, BigDecimal dscr) {
        System.out.println("⚠ DSCR Warning: " + projectId + " / " + dscr);
    }
}
🔁 6. Simulation Engine (핵심 차별화)
6.1 목적
- 미래 CashFlow 변화 시 결과 예측
- 투자 구조 검증
6.2 Monte Carlo 기반
@Service
public class SimulationService {

    private final WaterfallService waterfallService;

    public void simulate(Long projectId) {

        for (int i = 0; i < 1000; i++) {

            BigDecimal simulatedCash =
                generateRandomCashFlow();

            CashFlow cf = new CashFlow();
            cf.setInflow(simulatedCash);

            waterfallService.runWaterfall(projectId, cf);
        }
    }

    private BigDecimal generateRandomCashFlow() {
        double random = 50 + Math.random() * 100;
        return new BigDecimal(random);
    }
}
🗄️ 7. Oracle 9i DAO 구조 (중요)
7.1 JdbcTemplate 기반 (JPA 비추천)
@Repository
public class TrancheDao {

    private final JdbcTemplate jdbcTemplate;

    public List<Tranche> findByProject(Long projectId) {

        return jdbcTemplate.query(
            "SELECT * FROM TRANCHE WHERE PROJECT_ID = ?",
            new Object[]{projectId},
            (rs, rowNum) -> {
                Tranche t = new Tranche();
                t.setId(rs.getLong("ID"));
                t.setPriority(rs.getInt("PRIORITY"));
                t.setInterestDue(rs.getBigDecimal("INTEREST_DUE"));
                t.setPrincipalDue(rs.getBigDecimal("PRINCIPAL_DUE"));
                return t;
            }
        );
    }
}
⏱️ 8. Batch 처리 (현실 환경 핵심)
@Component
public class BatchJob {

    private final WaterfallService waterfallService;

    @Scheduled(cron = "0 0 2 * * *")
    public void runDaily() {

        List<Long> projects = loadProjects();

        for (Long projectId : projects) {

            CashFlow cf = loadCashFlow(projectId);

            waterfallService.runWaterfall(projectId, cf);
        }
    }
}
📡 9. 전체 실행 흐름
[Batch 실행]
   ↓
CashFlow 조회
   ↓
Waterfall 실행
   ↓
Distribution 저장
   ↓
DSCR 계산
   ↓
Risk Alert
   ↓
Simulation (선택)
🎯 10. 실무 핵심 포인트
10.1 Oracle 9i 환경
- JPA 대신 JdbcTemplate
- Batch 중심 구조
10.2 확장 전략
현재: Monolith
→ 이후: Engine 분리 (MSA)
10.3 진짜 중요한 부분
코드보다 "룰 설계 + 데이터 구조"
🚀 11. 한 줄 정리

이 구조는 “현금흐름 → Waterfall → 리스크 → 시뮬레이션”을 하나로 연결한 PF 운영 시스템이다.


---

# 🔥 다음 단계 (진짜 핵심)

지금 설계는 이미 “차세대 IB 시스템 수준”입니다.  
여기서 완성도를 더 끌어올리려면:

### 1️⃣ Rule Engine DB 설계 (핵심)
- Waterfall을 코드 → DB로 완전 분리

### 2️⃣ Pricing + PF 연결
- 좋은 투자자 → PF 참여 자동 연결

### 3️⃣ Dashboard
- 실시간 DSCR / Cash Flow 시각화

---

원하면 다음은  
👉 **“Waterfall Rule Engine (완전 DB 기반 설계 + SQL 구조)”**  
👉 **“IB 통합 대시보드 (실시간 모니터링 설계)”**

까지 이어서 만들어드리겠습니다.