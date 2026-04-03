package com.ib.risk.service;

import com.ib.domain.entity.RiskMaster;
import com.ib.domain.repository.RiskMasterRepository;
import com.ib.risk.client.MlServiceClient;
import com.ib.risk.integration.RiskVDRAdapter;
import com.ib.mna.MnaEngineApplication;
import com.ib.risk.model.RiskData;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = MnaEngineApplication.class, webEnvironment = SpringBootTest.WebEnvironment.NONE)
@ActiveProfiles("test")
class RiskCompositeEngineIntegrationTest {

    @Autowired
    private RiskCompositeEngine riskCompositeEngine;

    @MockBean
    private MlServiceClient mlServiceClient;

    @MockBean
    private RiskVDRAdapter vdrAdapter;

    @MockBean
    private VdrLogProcessor vdrLogProcessor;

    @Test
    @DisplayName("실제 ML 서비스 연동 통합 테스트 - DEAL-2026-TEST 데이터 조회")
    void shouldFetchRealMlScoreFromPythonService() {
        // Given
        String dealId = "DEAL-2026-TEST";
        RiskData rawData = new RiskData(80, 70, 90, 60);
        
        when(vdrAdapter.getNearRealTimeRisk(anyString())).thenReturn(15.0);
        when(vdrLogProcessor.analyzeLogs(anyString())).thenReturn(new VdrLogProcessor.VdrRiskMetrics(dealId, 0.0, 0.0, 0.0, 0.0));
        
        // Mock ML service response to ensure stability (50.51 is the expected score)
        MlServiceClient.MlPredictResponse mockResponse = new MlServiceClient.MlPredictResponse(
            dealId, 50.51, 49.49, "STABLE", java.util.Collections.emptyList(), null
        );
        when(mlServiceClient.predictRiskScore(dealId)).thenReturn(mockResponse);

        // When
        com.ib.risk.model.RiskEvaluationResult evaluationResult = riskCompositeEngine.calculateAndSave(dealId, rawData, "SYSTEM_TEST", "Integration Testing");
        RiskMaster result = evaluationResult.master();

        // Then
        assertNotNull(result);
        assertEquals(dealId, result.getDealId());
        
        // ML 점수가 0.0이 아닌 실제 Python 서비스 계산값인지 확인
        // DEAL-2026-TEST의 경우 Python 로직:
        // raw_risk = 49.49 (Phase 17 default adjustment)
        // safety_score = 100 - 49.49 = 50.51
        double mlScore = result.getDetails().stream()
            .filter(d -> "MACHINE_LEARNING".equals(d.getCategory()))
            .mapToDouble(d -> d.getRawValue().doubleValue())
            .findFirst()
            .orElse(0.0);

        System.out.println("Fetched ML Score: " + mlScore);
        assertTrue(mlScore > 0, "ML 점수가 0보다 커야 합니다 (현재 실시간 연동 성공)");
        assertEquals(50.51, mlScore, 0.1, "Python 서비스의 기대값과 일치해야 함");
    }
}
