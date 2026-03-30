package com.ib.risk.util;

import com.ib.domain.risk.RiskGrade;

public class RiskGradeMapper {
    /**
     * 최종 리스크 점수를 5단계 리스크 등급(RiskGrade)으로 변환합니다.
     * 
     * @param score 0-100 사이의 리스크 점수
     * @return RiskGrade (AAA~D)
     */
    public static RiskGrade toGrade(double score) {
        if (score > 100) return RiskGrade.AAA;
        if (score < 0) return RiskGrade.D;
        
        return RiskGrade.fromScore(score);
    }
}
