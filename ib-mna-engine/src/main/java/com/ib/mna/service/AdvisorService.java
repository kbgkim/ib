package com.ib.mna.service;

import com.ib.mna.dto.MarketDataResponse;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdvisorService {

    private final String ML_ADVISOR_URL = "http://localhost:8000/api/v1/ml/advisor/analyze";
    private final RestTemplate restTemplate = new RestTemplate();

    private final MarketDataService marketDataService;

    @Data
    @Builder
    public static class AdvisorRequest {
        private String project_id;
        private Map<String, Object> project_data;
        private MarketDataResponse market_data;
    }

    @Data
    public static class AdvisorResponse {
        private String project_id;
        private String status;
        private String timestamp;
        private String summary;
        private List<Map<String, Object>> individual_reports;
    }

    public AdvisorResponse getStrategicAdvice(String projectId, Map<String, Object> projectData) {
        try {
            MarketDataResponse latestMarket = marketDataService.getLatestData();
            
            AdvisorRequest request = AdvisorRequest.builder()
                    .project_id(projectId)
                    .project_data(projectData)
                    .market_data(latestMarket)
                    .build();

            return restTemplate.postForObject(ML_ADVISOR_URL, request, AdvisorResponse.class);
        } catch (Exception e) {
            log.error("Failed to fetch strategic advice from ML engine", e);
            AdvisorResponse fallback = new AdvisorResponse();
            fallback.setStatus("OFFLINE");
            fallback.setSummary("AI Advisor 서비스가 현재 비활성화 상태입니다. 매크로 지표를 수동으로 확인하십시오.");
            return fallback;
        }
    }
}
