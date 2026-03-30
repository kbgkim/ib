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
        // 1. 계산 및 영속화 (Audit 필드 포함)
        com.ib.domain.entity.RiskMaster savedMaster = riskCompositeEngine.calculateAndSave(
            request.dealId(),
            request.rawData(),
            request.evaluatorId(),
            request.evalComment()
        );
        
        // 2. 결과 매핑 및 반환
        return new RiskEvaluationResponse(
            savedMaster.getDealId(),
            savedMaster.getTotalScore().doubleValue(),
            com.ib.domain.risk.RiskGrade.valueOf(savedMaster.getFinalGrade()),
            com.ib.domain.risk.RiskGrade.valueOf(savedMaster.getFinalGrade()).getDescription(),
            savedMaster.getEvaluatorId(),
            savedMaster.getEvalComment(),
            request.rawData()
        );
    }
}
