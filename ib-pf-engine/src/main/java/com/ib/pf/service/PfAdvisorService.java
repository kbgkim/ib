package com.ib.pf.service;

import com.ib.pf.dto.PfMetricsResponse;
import com.ib.pf.model.PfProject;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PfAdvisorService {

    public record AdviceCard(
        String title, 
        String description, 
        String impact, 
        String category, 
        String actionType,
        double diffValue
    ) {}

    public List<AdviceCard> getAdvice(PfProject project, PfMetricsResponse metrics) {
        List<AdviceCard> adviceList = new ArrayList<>();

        double minDscr = metrics.getMinDscr().doubleValue();

        // 1. Refinancing Advice (Interest Rate focus)
        if (minDscr < 1.25) {
            adviceList.add(new AdviceCard(
                "Debt Refinancing (Lower Rate)",
                "현재 금리가 시장 평균보다 높습니다. 4.5% 수준으로 리파이낸싱 시 연간 부채 상환 부담이 경감됩니다.",
                "+0.12x DSCR Improvement 예상",
                "FINANCIAL",
                "REFINANCE",
                0.045
            ));
        }

        // 2. Equity Injection Advice (Leverage focus)
        if (minDscr < 1.15) {
            adviceList.add(new AdviceCard(
                "Cash Sweep & Equity Injection",
                "DSCR 약정 위반 위험이 있습니다. 500억 규모의 추가 자본금 수납 또는 Cash Sweep 강화를 추천합니다.",
                "+0.25x DSCR Improvement 예상",
                "CAPITAL",
                "EQUITY_INJECTION",
                50000.0
            ));
        }

        // 3. Operational Reserve (Volatility focus)
        if (metrics.getLlcr().doubleValue() < 1.30) {
            adviceList.add(new AdviceCard(
                "Establish DSRA Top-up",
                "현금흐름 변동성에 대비하여 Debt Service Reserve Account 적립금을 6개월분에서 12개월분으로 상향 추천합니다.",
                "Stability Enhancement",
                "RISK_CONTROL",
                "RESERVE_TOPUP",
                12.0
            ));
        }

        return adviceList;
    }
}
