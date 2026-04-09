package com.ib.mna.application;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ib.domain.deal.Deal;
import com.ib.mna.dto.RiskMetricResponse;
import com.ib.mna.dto.ValuationBridgeResponse;
import com.ib.mna.service.RiskEvaluationService;
import com.ib.mna.service.ValuationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Collections;

/**
 * DealApplicationService: Orchestrates domain logic and infrastructure services.
 * Implements "Structure Realignment" by centralizing flow.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DealApplicationService {

    private final ValuationService valuationService;
    private final RiskEvaluationService riskEvaluationService;
    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper;

    /**
     * Orchestrates Deal creation, valuation, and risk evaluation.
     * Transactional ensures both Deal state and Outbox event are atomical.
     */
    @Transactional
    public Deal createAndEvaluateDeal(String dealName, BigDecimal initialValue) {
        log.info("Starting deal creation process for: {}", dealName);

        // 1. Domain Object Creation
        Deal deal = new Deal(dealName);

        // 2. Orchestration: Valuation
        ValuationBridgeResponse valuation = valuationService.calculateValuationBridge(Collections.emptyList(), BigDecimal.ONE);
        deal.evaluate(valuation.getPostDealValue().doubleValue());

        // 3. Orchestration: Risk
        RiskMetricResponse risk = riskEvaluationService.evaluateAdvancedMetrics(dealName, valuation.getPostDealValue());
        deal.applyRisk(risk.getVar95().doubleValue());

        // 4. Domain Logic: Approve
        deal.approve();

        // 5. Infrastructure: Publish Outbox Event
        publishEvent("DealCreated", deal);

        log.info("Deal processing completed: ID={}, Status={}", deal.getId(), deal.getStatus());
        return deal;
    }

    /**
     * Outbox Pattern: Save event to DB in the same transaction.
     */
    private void publishEvent(String type, Object payload) {
        log.info("Publishing outbox event: type={}, payload={}", type, payload);
        try {
            String jsonPayload = objectMapper.writeValueAsString(payload);
            jdbcTemplate.update(
                "INSERT INTO ib.outbox_event (event_type, payload, status) VALUES (?, ?, 'NEW')",
                type, jsonPayload
            );
            log.debug("Event successfully persisted to outbox_event table");
        } catch (Exception e) {
            log.error("Failed to publish outbox event: {}", type, e);
            throw new RuntimeException("Event publishing failed", e);
        }
    }
}
