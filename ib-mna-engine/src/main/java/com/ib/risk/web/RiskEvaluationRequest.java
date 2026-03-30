package com.ib.risk.web;

import com.ib.risk.model.RiskData;

/**
 * 리스크 평가 요청 DTO
 */
public record RiskEvaluationRequest(
    String dealId,
    String evaluatorId,
    String evalComment,
    RiskData rawData
) {}
