package com.ib.mna.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/mna/vdr")
@CrossOrigin(origins = "*")
public class VdrController {

    private final String ML_ENGINE_URL = "http://localhost:8000/api/v1/ml/summarize";
    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/analyze")
    @SuppressWarnings({"unchecked", "null"})
    public ResponseEntity<Map<String, Object>> analyzeVdrDocument(@RequestBody Map<String, String> request) {
        String docText = request.get("text");
        String category = request.getOrDefault("category", "GENERAL");

        // 1. Prepare request for ML Engine
        Map<String, String> mlRequest = new HashMap<>();
        mlRequest.put("text", docText);
        mlRequest.put("category", category);

        try {
            // 2. Call ML Engine for NLP Analysis
            Map<String, Object> mlResult = restTemplate.postForObject(ML_ENGINE_URL, mlRequest, Map.class);

            // 3. Transform result for UI (Add M&A specific metrics)
            Map<String, Object> response = new HashMap<>();
            response.put("dealId", "DEAL-001");
            response.put("analysisResult", mlResult);
            
            // Intelligence: Calculate a suggested Risk Score delta
            double sentiment = (double) mlResult.getOrDefault("sentiment_score", 0.5);
            double riskAdjustment = (1.0 - sentiment) * 20.0; // Higher risk if sentiment is low
            response.put("riskAdjustment", riskAdjustment);
            response.put("status", "SUCCESS");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("status", "ERROR");
            error.put("message", "ML Engine unreachable. Port 8000 check required.");
            return ResponseEntity.status(500).body(error);
        }
    }
}
