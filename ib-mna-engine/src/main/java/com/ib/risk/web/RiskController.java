package com.ib.risk.web;

import com.ib.domain.risk.RiskGrade;
import com.ib.risk.service.RiskCompositeEngine;
import com.ib.risk.util.RiskGradeMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/risk")
@RequiredArgsConstructor
public class RiskController {

    private final RiskCompositeEngine riskCompositeEngine;

    @PostMapping("/evaluate")
    public RiskEvaluationResponse evaluate(@RequestBody RiskEvaluationRequest request) {
        // 1. 계산 및 영속화 (ML 상세 데이터 포함)
        com.ib.risk.model.RiskEvaluationResult result = riskCompositeEngine.calculateAndSave(
            request.dealId(),
            request.rawData(),
            request.evaluatorId(),
            request.evalComment()
        );
        
        com.ib.domain.entity.RiskMaster savedMaster = result.master();
        com.ib.risk.client.MlServiceClient.MlPredictResponse mlResponse = result.mlResponse();
            
        double vdrScore = savedMaster.getDetails().stream()
            .filter(d -> "VDR_SECURITY".equals(d.getCategory()))
            .mapToDouble(d -> d.getRawValue().doubleValue())
            .findFirst()
            .orElse(0.0);
            
        // 2. 결과 매핑 및 반환 (AI 리포트 필드 추가)
        return new RiskEvaluationResponse(
            savedMaster.getDealId(),
            savedMaster.getTotalScore().doubleValue(),
            com.ib.domain.risk.RiskGrade.valueOf(savedMaster.getFinalGrade()),
            com.ib.domain.risk.RiskGrade.valueOf(savedMaster.getFinalGrade()).getDescription(),
            savedMaster.getEvaluatorId(),
            savedMaster.getEvalComment(),
            request.rawData(),
            mlResponse.mlScore(),
            vdrScore,
            mlResponse.confidenceLevel(),
            mlResponse.topFactors()
        );
    }
}
