package com.ib.mna.application;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ib.domain.deal.Deal;
import com.ib.domain.deal.DealStatus;
import com.ib.mna.dto.RiskMetricResponse;
import com.ib.mna.dto.ValuationBridgeResponse;
import com.ib.mna.service.RiskEvaluationService;
import com.ib.mna.service.ValuationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DealApplicationServiceTest {

    @Mock
    private ValuationService valuationService;
    @Mock
    private RiskEvaluationService riskEvaluationService;
    @Mock
    private JdbcTemplate jdbcTemplate;
    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private DealApplicationService dealApplicationService;

    @Test
    @SuppressWarnings("null")
    void testCreateAndEvaluateDeal_Success() throws JsonProcessingException {
        // Given
        String dealName = "Test-Deal-001";
        BigDecimal initialValue = new BigDecimal("1000.0");
        
        ValuationBridgeResponse valuationResponse = ValuationBridgeResponse.builder()
                .postDealValue(new BigDecimal("1200.0"))
                .build();
        
        RiskMetricResponse riskResponse = RiskMetricResponse.builder()
                .var95(new BigDecimal("50.0"))
                .riskLevel("HIGH")
                .build();

        when(valuationService.calculateValuationBridge(anyList(), any())).thenReturn(valuationResponse);
        when(riskEvaluationService.evaluateAdvancedMetrics(anyString(), any())).thenReturn(riskResponse);
        when(objectMapper.writeValueAsString(any())).thenReturn("{}");

        // When
        Deal result = dealApplicationService.createAndEvaluateDeal(dealName, initialValue);

        // Then
        assertNotNull(result);
        assertEquals(dealName, result.getName());
        assertEquals(DealStatus.APPROVED, result.getStatus());
        assertEquals(1200.0, result.getValuation());
        assertEquals(50.0, result.getRiskScore());

        // Verify Infrastructure calls
        verify(jdbcTemplate, times(1)).update(anyString(), eq("DealCreated"), anyString());
        verify(objectMapper, times(1)).writeValueAsString(any(Deal.class));
    }

    @Test
    void testCreateAndEvaluateDeal_EventPublishFailure_ShouldThrowException() throws JsonProcessingException {
        // Given
        String dealName = "Fail-Deal";
        when(valuationService.calculateValuationBridge(anyList(), any())).thenReturn(ValuationBridgeResponse.builder().postDealValue(BigDecimal.TEN).build());
        when(riskEvaluationService.evaluateAdvancedMetrics(anyString(), any())).thenReturn(RiskMetricResponse.builder().var95(BigDecimal.ONE).build());
        when(objectMapper.writeValueAsString(any())).thenThrow(new RuntimeException("JSON Error"));

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            dealApplicationService.createAndEvaluateDeal(dealName, BigDecimal.ONE);
        });
    }
}
