package com.ib.risk.service;

import org.springframework.stereotype.Service;
import java.util.Random;

/**
 * VDR Access Log Processor (Phase 2 Simulation)
 * 분석 대상: 문서 열람 빈도, 대외비 문서 접근 패턴, Q&A 응답 지연 등
 */
@Service
public class VdrLogProcessor {

    private final Random random = new Random();

    public VdrRiskMetrics analyzeLogs(String dealId) {
        // 실제 운영 시에는 VDR API 로그 엔드포인트 파싱
        // 현재는 시뮬레이션 데이터 생성
        double accessAnomalyScore = 10 + random.nextDouble() * 20; // 10-30: 빈상적 접근 패턴
        double sensitiveDocExposure = 5 + random.nextDouble() * 15; // 5-20: 대외비 문서 노출 지수
        double qnaRiskScore = 0 + random.nextDouble() * 10; // 0-10: Q&A 답변 지연 및 충돌

        double totalRisk = (accessAnomalyScore * 0.4) + (sensitiveDocExposure * 0.4) + (qnaRiskScore * 0.2);

        return new VdrRiskMetrics(dealId, totalRisk, accessAnomalyScore, sensitiveDocExposure, qnaRiskScore);
    }

    public record VdrRiskMetrics(
        String dealId,
        double totalRisk,
        double accessAnomalyScore,
        double sensitiveDocExposure,
        double qnaRiskScore
    ) {}
}
