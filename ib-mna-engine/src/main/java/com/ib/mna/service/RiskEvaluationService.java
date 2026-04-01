package com.ib.mna.service;

import com.ib.mna.dto.RiskMetricResponse;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

@Service
public class RiskEvaluationService {

    /**
     * Calculate Expected Loss (EL) = PD * LGD * EAD
     */
    public BigDecimal calculateEL(BigDecimal pd, BigDecimal lgd, BigDecimal ead) {
        return pd.multiply(lgd).multiply(ead).setScale(4, RoundingMode.HALF_UP);
    }

    /**
     * Perform Monte Carlo Simulation to derive VaR (Value at Risk) and CVaR (Conditional VaR)
     * For demonstration, we simulate 1,000 loss scenarios.
     */
    public RiskMetricResponse evaluateAdvancedMetrics(String dealId, BigDecimal baseExposure) {
        Random random = new Random();
        List<BigDecimal> simulatedLosses = new ArrayList<>();
        
        // Simulating 1000 Monte Carlo scenarios
        for (int i = 0; i < 1000; i++) {
            // Random loss between 0% and 100% of exposure with specific distribution
            double factor = Math.max(0, Math.min(1, random.nextGaussian() * 0.2 + 0.1));
            simulatedLosses.add(baseExposure.multiply(BigDecimal.valueOf(factor)));
        }
        
        // Sort for VaR/CVaR calculation
        Collections.sort(simulatedLosses);
        
        // 95% Confidence -> 950th index in a 1000-sample list
        BigDecimal var95 = simulatedLosses.get(949).setScale(2, RoundingMode.HALF_UP);
        
        // CVaR -> Average of losses greater than or equal to VaR
        BigDecimal sumTailLoss = simulatedLosses.subList(949, 1000).stream()
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal cvar95 = sumTailLoss.divide(BigDecimal.valueOf(51), 2, RoundingMode.HALF_UP);
        
        // PD/LGD/EL (Mocked for now based on baseExposure)
        BigDecimal pd = new BigDecimal("0.05"); // 5% default prob
        BigDecimal lgd = new BigDecimal("0.40"); // 40% loss rate
        BigDecimal el = calculateEL(pd, lgd, baseExposure);
        
        String riskLevel = "LOW";
        if (var95.compareTo(baseExposure.multiply(new BigDecimal("0.5"))) > 0) riskLevel = "HIGH";
        else if (var95.compareTo(baseExposure.multiply(new BigDecimal("0.2"))) > 0) riskLevel = "MEDIUM";

        return RiskMetricResponse.builder()
                .dealId(dealId)
                .pd(pd)
                .lgd(lgd)
                .ead(baseExposure)
                .expectedLoss(el)
                .var95(var95)
                .cvar95(cvar95)
                .riskLevel(riskLevel)
                .build();
    }
}
