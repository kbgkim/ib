package com.ib.risk.integration;

/**
 * VDR(가상 데이터룸) 실사 문서 분석 기반 리스크 탐지 어댑터 인터페이스
 */
public interface RiskVDRAdapter {
    /**
     * VDR 실사 문서에서 탐지된 보안 및 법적 리스크 실시간 스코어를 반환합니다.
     * 
     * @param dealId 딜 식별자
     * @return 리스크 탐지 점수 (0-100)
     */
    double getNearRealTimeRisk(String dealId);
}
