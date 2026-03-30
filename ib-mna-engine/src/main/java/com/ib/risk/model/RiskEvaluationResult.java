package com.ib.risk.model;

import com.ib.domain.entity.RiskMaster;
import com.ib.risk.client.MlServiceClient.MlPredictResponse;
import lombok.Builder;

/**
 * 리스크 평가 결과와 AI 부가 정보를 담는 내부 DTO
 */
@Builder
public record RiskEvaluationResult(
    RiskMaster master,
    MlPredictResponse mlResponse
) {}
