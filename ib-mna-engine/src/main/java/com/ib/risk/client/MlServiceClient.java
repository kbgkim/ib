package com.ib.risk.client;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.time.Duration;

@Slf4j
@Service
public class MlServiceClient {

    private final RestTemplate restTemplate;

    public MlServiceClient(RestTemplateBuilder builder) {
        this.restTemplate = builder
            .setConnectTimeout(Duration.ofMillis(500))
            .setReadTimeout(Duration.ofMillis(1000)) // Fast fail
            .build();
    }

    public record RiskFactor(String factor, double impact, double weight) {}
    public record MlPredictRequest(String dealId) {}
    public record MlPredictResponse(
        String dealId, 
        double mlScore, 
        double riskProbability,
        String confidenceLevel, 
        java.util.List<RiskFactor> topFactors,
        Object featuresUsed
    ) {}

    public MlPredictResponse predictRiskScore(String dealId) {
        try {
            MlPredictRequest request = new MlPredictRequest(dealId);
            return restTemplate.postForObject("http://localhost:8000/api/v1/ml/predict-risk", request, MlPredictResponse.class);
        } catch (Exception e) {
            log.error("Failed to connect to ML prediction service for dealId: {}", dealId, e);
            // Fallback response explicitly handled here
            return new MlPredictResponse(dealId, 0.0, 0.0, "ERROR", java.util.Collections.emptyList(), null);
        }
    }
}
