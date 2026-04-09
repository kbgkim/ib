package com.ib.mna.service;

import com.ib.mna.dto.RiskMetricResponse;
import com.ib.risk.client.MlServiceClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Slf4j
@Service
@RequiredArgsConstructor
public class RiskEvaluationService {

    private final MlServiceClient mlServiceClient;

    /**
     * Calculate Expected Loss (EL) = PD * LGD * EAD
     */
    public BigDecimal calculateEL(BigDecimal pd, BigDecimal lgd, BigDecimal ead) {
        return pd.multiply(lgd).multiply(ead).setScale(4, RoundingMode.HALF_UP);
    }

    /**
     * Refactored: Call External ML Engine instead of internal Monte Carlo.
     * Strategic Realignment: Separation of computation and domain orchestration.
     */
    public RiskMetricResponse evaluateAdvancedMetrics(String dealId, BigDecimal baseExposure) {
        log.info("Requesting advanced risk evaluation from ML Client for deal: {}", dealId);
        
        try {
            MlServiceClient.MlPredictResponse prediction = mlServiceClient.predictRiskScore(dealId);
            
            if ("ERROR".equals(prediction.confidenceLevel())) {
                throw new RuntimeException("ML Service reported error state");
            }

            return RiskMetricResponse.builder()
                .dealId(dealId)
                .pd(BigDecimal.valueOf(prediction.riskProbability()))
                .lgd(new BigDecimal("0.45")) // Standard LGD for project finance
                .var95(baseExposure.multiply(BigDecimal.valueOf(prediction.mlScore() / 100.0)))
                .riskLevel(prediction.confidenceLevel())
                .build();

        } catch (Exception e) {
            log.error("ML Client integration failed, providing fallback risk metrics", e);
            // Fallback to maintain system stability (Minimum Invasive)
            return RiskMetricResponse.builder()
                .dealId(dealId)
                .pd(new BigDecimal("0.05"))
                .lgd(new BigDecimal("0.40"))
                .var95(baseExposure.multiply(new BigDecimal("0.1"))) // 10% exposure fallback
                .riskLevel("STABLE (FALLBACK)")
                .build();
        }
    }
}
