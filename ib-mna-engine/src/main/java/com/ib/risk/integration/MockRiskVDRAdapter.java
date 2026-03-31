package com.ib.risk.integration;

import com.ib.risk.service.VdrLogProcessor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * VDR 리스크 어댑터의 Mock 구현체 (Phase 3 초기 단계용)
 */
@Component
@RequiredArgsConstructor
public class MockRiskVDRAdapter implements RiskVDRAdapter {
    
    private final VdrLogProcessor logProcessor;

    @Override
    public double getNearRealTimeRisk(String dealId) {
        // 실제 운영 시에는 VDR API (Near Real-time NLP 분석기) 호출
        // Phase 2에서는 로그 분석기 시뮬레이션을 통해 동적 점수 반환
        return logProcessor.analyzeLogs(dealId).totalRisk();
    }
}
