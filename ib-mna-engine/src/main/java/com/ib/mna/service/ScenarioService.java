package com.ib.mna.service;

import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
public class ScenarioService {

    /**
     * Compute synergy value for a specific scenario based on capture rate.
     */
    public BigDecimal adjustByScenario(BigDecimal baseValue, BigDecimal captureRate) {
        return baseValue.multiply(captureRate);
    }

    public BigDecimal getMultiplier(String scenario) {
        return switch (scenario.toUpperCase()) {
            case "BEAR" -> new BigDecimal("0.70");
            case "BULL" -> new BigDecimal("1.30");
            default -> BigDecimal.ONE;
        };
    }

    /**
     * Generate 3 scenario comparison map (Bear/Base/Bull).
     */
    public Map<String, BigDecimal> generateComparison(BigDecimal baseValue) {
        Map<String, BigDecimal> comparison = new HashMap<>();
        
        // Mock rates for demonstration (In production, these come from DB/MnaScenario)
        comparison.put("BEAR", adjustByScenario(baseValue, new BigDecimal("0.70"))); // 70% capture
        comparison.put("BASE", adjustByScenario(baseValue, new BigDecimal("1.00"))); // 100% capture
        comparison.put("BULL", adjustByScenario(baseValue, new BigDecimal("1.30"))); // 130% capture
        
        return comparison;
    }
}
