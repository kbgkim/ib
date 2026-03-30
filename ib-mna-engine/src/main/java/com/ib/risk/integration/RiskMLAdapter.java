package com.ib.risk.integration;

/**
 * 외부 ML 마이크로서비스로부터 예측 리스크 점수를 가져오는 어댑터 인터페이스
 */
public interface RiskMLAdapter {
    /**
     * 특정 딜에 대한 ML 기반 예측 리스크 점수를 반환합니다.
     * 
     * @param dealId 딜 식별자
     * @return 예측 리스크 점수 (0.0 ~ 1.0 가중치 조정용)
     */
    double getPredictiveScore(String dealId);
}
