package com.ib.risk.service;

import com.ib.domain.entity.RiskDetail;
import com.ib.domain.entity.RiskMaster;
import com.ib.domain.repository.RiskMasterRepository;
import com.ib.domain.risk.RiskGrade;
import com.ib.risk.model.RiskData;
import com.ib.risk.util.RiskGradeMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RiskCompositeEngine {

    private final RiskMasterRepository riskMasterRepository;
    private final com.ib.risk.client.MlServiceClient mlServiceClient;

    // 가중치 정의
    private static final double WEIGHT_FINANCIAL = 0.40;
    private static final double WEIGHT_LEGAL = 0.30;
    private static final double WEIGHT_OPERATIONAL = 0.20;
    private static final double WEIGHT_SECURITY = 0.10;

    @Transactional
    public RiskMaster calculateAndSave(String dealId, RiskData data, String evaluatorId, String evalComment) {
        // 1. 점수 계산
        double financialWeighted = data.financialScore() * WEIGHT_FINANCIAL;
        double legalWeighted = data.legalScore() * WEIGHT_LEGAL;
        double operationalWeighted = data.operationalScore() * WEIGHT_OPERATIONAL;
        double securityWeighted = data.securityScore() * WEIGHT_SECURITY;
        
        double totalScore = financialWeighted + legalWeighted + operationalWeighted + securityWeighted;
        RiskGrade grade = RiskGradeMapper.toGrade(totalScore);

        // 1-1. 머신러닝 피처 모델 조회 (Circuit Breaker 적용)
        double mlRawScore = 0.0;
        try {
            com.ib.risk.client.MlServiceClient.MlPredictResponse mlResponse = mlServiceClient.predictRiskScore(dealId);
            mlRawScore = mlResponse.mlScore();
        } catch (Exception e) {
            // 폴백: 호출 실패 시 기본값 0.0
            mlRawScore = 0.0;
        }

        // 2. 상세 내역 생성 (ML 점수는 별도 가중치 0으로 로깅만 수행)
        List<RiskDetail> details = Arrays.asList(
            createDetail(dealId, "FINANCIAL", "Financial Stability", data.financialScore(), financialWeighted),
            createDetail(dealId, "LEGAL", "Legal Compliance", data.legalScore(), legalWeighted),
            createDetail(dealId, "OPERATIONAL", "Operational Efficiency", data.operationalScore(), operationalWeighted),
            createDetail(dealId, "SECURITY", "Information Security", data.securityScore(), securityWeighted),
            createDetail(dealId, "MACHINE_LEARNING", "AI Confidence Score", mlRawScore, 0.0)
        );

        // 3. 마스터 레코드 갱신 또는 생성
        RiskMaster master = riskMasterRepository.findById(dealId).orElseGet(() -> RiskMaster.builder().dealId(dealId).build());
        master.setTotalScore(BigDecimal.valueOf(totalScore));
        master.setFinalGrade(grade.name());
        master.setEvaluatorId(evaluatorId);
        master.setEvalComment(evalComment);
        
        // 기존 상세 내역 삭제 후 교체 (orphanRemoval에 의해 DB에서 삭제됨)
        if (master.getDetails() != null) {
            master.getDetails().clear();
            master.getDetails().addAll(details);
        } else {
            master.setDetails(details);
        }

        return riskMasterRepository.save(master);
    }

    private RiskDetail createDetail(String dealId, String category, String factorName, double raw, double weighted) {
        return RiskDetail.builder()
            .dealId(dealId)
            .category(category)
            .factorName(factorName)
            .rawValue(BigDecimal.valueOf(raw))
            .weightedScore(BigDecimal.valueOf(weighted))
            .build();
    }

    public double calculateTotalScore(RiskData data) {
        return (data.financialScore() * WEIGHT_FINANCIAL) +
               (data.legalScore() * WEIGHT_LEGAL) +
               (data.operationalScore() * WEIGHT_OPERATIONAL) +
               (data.securityScore() * WEIGHT_SECURITY);
    }
}
