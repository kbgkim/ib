package com.ib.mna.dto;

import java.math.BigDecimal;
import java.util.List;
import lombok.*;

/**
 * DTO for Waterfall Chart (M&A Valuation Bridge)
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ValuationBridgeResponse {
    private BigDecimal baseValue;
    private BigDecimal costSynergy;
    private BigDecimal revenueSynergy;
    private BigDecimal integrationCost;
    private BigDecimal postDealValue;
    
    // Phase 8 Refinement: Advanced Risk Data
    private RiskMetricResponse riskMetrics;
    
    /**
     * Helper to return as a list of 5 values for Chart.js
     */
    public List<BigDecimal> toList() {
        return List.of(baseValue, costSynergy, revenueSynergy, integrationCost, postDealValue);
    }
}
