package com.ib.risk.web;

import com.ib.domain.risk.RiskGrade;
import com.ib.risk.model.RiskData;

/**
 * 리스크 평가 결과 응답 DTO
 */
public record RiskEvaluationResponse(
    String dealId,
    double totalScore,
    RiskGrade finalGrade,
    String description,
    String evaluatorId,
    String evalComment,
    RiskData rawData
) {}
