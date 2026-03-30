package com.ib.risk.integration;

import org.springframework.stereotype.Component;

/**
 * VDR 리스크 어댑터의 Mock 구현체 (Phase 3 초기 단계용)
 */
@Component
public class MockRiskVDRAdapter implements RiskVDRAdapter {
    @Override
    public double getNearRealTimeRisk(String dealId) {
        // 실제 운영 시에는 VDR API (Near Real-time NLP 분석기) 호출
        // 현재는 문서 보안 위반 탐지 가정 스코어(12.5) 반환
        return 12.5;
    }
}
