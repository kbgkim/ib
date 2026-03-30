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

    @Autowired
    private MlServiceClient mlServiceClient;

    @MockBean
    private RiskVDRAdapter vdrAdapter;

    @Test
    @DisplayName("실제 ML 서비스 연동 통합 테스트 - DEAL-2026-TEST 데이터 조회")
    void shouldFetchRealMlScoreFromPythonService() {
        // Given
        String dealId = "DEAL-2026-TEST";
        RiskData rawData = new RiskData(80, 70, 90, 60);
        
        // VDR은 Mock 처리 (Task 3 연동 확인용)
        when(vdrAdapter.getNearRealTimeRisk(anyString())).thenReturn(15.0);

        // When
        RiskMaster result = riskCompositeEngine.calculateAndSave(dealId, rawData, "SYSTEM_TEST", "Integration Testing");

        // Then
        assertNotNull(result);
        assertEquals(dealId, result.getDealId());
        
        // ML 점수가 0.0이 아닌 실제 Python 서비스 계산값인지 확인
        // DEAL-2026-TEST의 경우 Python 로직:
        // raw_risk = (85.0 * 0.08) * 10 = 68.0
        // safety_score = 100 - 68.0 = 32.0
        double mlScore = result.getDetails().stream()
            .filter(d -> "MACHINE_LEARNING".equals(d.getCategory()))
            .mapToDouble(d -> d.getRawValue().doubleValue())
            .findFirst()
            .orElse(0.0);

        System.out.println("Fetched ML Score: " + mlScore);
        assertTrue(mlScore > 0, "ML 점수가 0보다 커야 합니다 (현재 실시간 연동 성공)");
        assertEquals(32.0, mlScore, 0.1, "Python 서비스의 기대값과 일치해야 함");
    }
}
