package com.ib.risk.integration;

import org.springframework.stereotype.Component;

/**
 * ML 리스크 어댑터의 Mock 구현체 (Phase 3 초기 단계용)
 */
@Component
public class MockRiskMLAdapter implements RiskMLAdapter {
    @Override
    public double getPredictiveScore(String dealId) {
        // 실제 운영 시에는 외부 ML 마이크로서비스 gRPC/REST 호출
        // 현재는 고정된 테스트 스코어(0.15) 반환
        return 0.15; 
    }
}
