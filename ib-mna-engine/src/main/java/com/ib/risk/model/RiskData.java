package com.ib.risk.model;

/**
 * 4대 리스크 카테고리별 원천 점수를 담는 데이터 객체
 */
public record RiskData(
    double financialScore,
    double legalScore,
    double operationalScore,
    double securityScore
) {}
