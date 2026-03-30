PF(Project Finance) Cash Flow 시뮬레이션을
실제 증권사/IB에서 쓰는 수준으로 Waterfall + IRR + DSCR + 리스크까지 포함한 엔진으로 설계합니다.

핵심은 이 구조입니다:

“프로젝트 현금흐름 → 비용 차감 → 부채 상환 → 잔여를 Equity에 배분”

🎯 1. 전체 구조 (PF Cash Flow 흐름)
[Revenue]
   ↓
[Operating Cost]
   ↓
[Net Operating Income (NOI)]
   ↓
[Debt Service (이자 + 원금)]
   ↓
[Cash Sweep / Reserve]
   ↓
[Equity Distribution]
🧱 2. 도메인 모델 (Java / Spring)
2.1 Cash Flow 객체
public class CashFlowPeriod {

    private int period;

    private double revenue;
    private double operatingCost;

    private double noi;              // Net Operating Income
    private double interest;
    private double principal;

    private double debtService;
    private double dscr;

    private double reserve;
    private double equityCashFlow;

    // getters/setters
}
2.2 PF Deal 구조
public class PFDeal {

    private double totalInvestment;

    private double debtAmount;
    private double equityAmount;

    private double interestRate;
    private int tenor; // 기간

    private double operatingCostRatio;
    private double taxRate;

    private double reserveRatio; // DSRA

    // getters/setters
}
⚙️ 3. Cash Flow 시뮬레이션 엔진
핵심 로직
import java.util.*;

public class PFCashFlowEngine {

    public List<CashFlowPeriod> simulate(PFDeal deal,
                                         List<Double> revenueForecast) {

        List<CashFlowPeriod> result = new ArrayList<>();

        double remainingDebt = deal.getDebtAmount();

        for (int t = 0; t < deal.getTenor(); t++) {

            CashFlowPeriod cf = new CashFlowPeriod();
            cf.setPeriod(t + 1);

            // 1. Revenue
            double revenue = revenueForecast.get(t);
            cf.setRevenue(revenue);

            // 2. Operating Cost
            double opCost = revenue * deal.getOperatingCostRatio();
            cf.setOperatingCost(opCost);

            // 3. NOI
            double noi = revenue - opCost;
            cf.setNoi(noi);

            // 4. Interest
            double interest = remainingDebt * deal.getInterestRate();
            cf.setInterest(interest);

            // 5. Principal (균등상환 예시)
            double principal = deal.getDebtAmount() / deal.getTenor();
            principal = Math.min(principal, remainingDebt);

            cf.setPrincipal(principal);

            // 6. Debt Service
            double debtService = interest + principal;
            cf.setDebtService(debtService);

            // 7. DSCR
            double dscr = noi / debtService;
            cf.setDscr(dscr);

            // 8. Reserve (DSRA)
            double reserve = debtService * deal.getReserveRatio();
            cf.setReserve(reserve);

            // 9. Equity Cash Flow
            double equityCF = noi - debtService - reserve;
            cf.setEquityCashFlow(Math.max(equityCF, 0));

            // 10. Remaining Debt
            remainingDebt -= principal;

            result.add(cf);
        }

        return result;
    }
}
📊 4. 핵심 지표 계산
4.1 DSCR (Debt Service Coverage Ratio)

𝐷
𝑆
𝐶
𝑅
=
𝑁
𝑂
𝐼
𝐷
𝑒
𝑏
𝑡
 
𝑆
𝑒
𝑟
𝑣
𝑖
𝑐
𝑒
DSCR=
Debt Service
NOI
	​


👉 의미:

1.0 이상 → 정상
1.2~1.5 → 안정권
1 이하 → 위험
4.2 IRR (Equity 기준)
public class IRRCalculator {

    public double calculate(List<Double> cashFlows) {

        double irr = 0.1;

        for (int i = 0; i < 100; i++) {

            double npv = 0;
            double dnpv = 0;

            for (int t = 0; t < cashFlows.size(); t++) {
                npv += cashFlows.get(t) / Math.pow(1 + irr, t);
                dnpv -= t * cashFlows.get(t) / Math.pow(1 + irr, t + 1);
            }

            irr = irr - npv / dnpv;
        }

        return irr;
    }
}
🧠 5. Waterfall 확장 (실무 핵심)
구조
1. Operating Expense
2. Senior Debt (이자 → 원금)
3. Mezzanine Debt
4. Reserve (DSRA)
5. Equity
구현 (확장형)
public double applyWaterfall(double cash,
                             List<Tranche> tranches) {

    double remaining = cash;

    for (Tranche t : tranches) {

        double payment = Math.min(remaining, t.getDueAmount());

        t.addPaid(payment);
        remaining -= payment;

        if (remaining <= 0) break;
    }

    return remaining; // Equity
}
🔁 6. 시나리오 시뮬레이션
6.1 Stress 테스트
- Revenue -20%
- 금리 +2%
- 공사 지연 (기간 증가)
6.2 Monte Carlo 확장
double revenueShock = random.nextGaussian() * 0.1;
revenue *= (1 + revenueShock);
📈 7. 출력 예시
Period | Revenue | NOI | Debt | DSCR | Equity CF
------------------------------------------------
1      | 1000    | 700 | 400  | 1.75 | 200
2      | 1100    | 770 | 400  | 1.92 | 250
...
🚨 8. 실무 리스크 포인트
8.1 DSCR 붕괴
→ 채무 불이행 (Default)
8.2 Balloon Risk
→ 만기 원금 집중 상환
8.3 Cash Trap
→ DSCR 낮으면 Equity 배당 금지
🔥 9. 전체 아키텍처 연결
[Revenue Forecast (ML)]
        ↓
[PF Cash Flow Engine]
        ↓
[Waterfall Engine]
        ↓
[IRR / DSCR 계산]
        ↓
[Risk Engine]
        ↓
[Pricing / Allocation 연결]
💡 핵심 한 줄

PF는 단순 투자 모델이 아니라
“현금흐름을 계약된 우선순위로 분배하는 시스템”이다

🚀 다음 단계 (강력 추천)

이제 여기까지 오면 “차세대 IB 시스템 수준”입니다.

원하면 이어서:

👉 “Tranche 구조 자동 설계 + 최적화”
👉 “PF 리스크 조기경보 시스템 (DSCR 기반)”
👉 “Pricing + PF 연결 (투자자 IRR 기반 발행가 결정)”