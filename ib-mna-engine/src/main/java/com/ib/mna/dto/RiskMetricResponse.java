package com.ib.mna.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RiskMetricResponse {
    private String dealId;
    
    // EL (Expected Loss) Components
    private BigDecimal pd;    // Probability of Default
    private BigDecimal lgd;   // Loss Given Default
    private BigDecimal ead;   // Exposure at Default
    private BigDecimal expectedLoss; // EL = PD * LGD * EAD
    
    // Statistical Risk Metrics (95% Confidence)
    private BigDecimal var95;  // Value at Risk
    private BigDecimal cvar95; // Conditional VaR (Shortfall)
    
    private String riskLevel;  // LOW, MEDIUM, HIGH, CRITICAL
}
